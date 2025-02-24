const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { MongoClient, GridFSBucket,ObjectId } = require("mongodb");
 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET, POST, DELETE",
  allowedHeaders: "Content-Type"
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Multer Setup
const upload = multer({ dest: "uploads/" });

async function connectDB() {
  try {
    const client = await MongoClient.connect(mongo_uri, { useUnifiedTopology: true });
    console.log("Connected to MongoDB");
    return client.db("pdfstorage");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

connectDB().then(database => {
  const bucket = new GridFSBucket(database, { bucketName: "fs" });

  // Start Express app after DB is connected
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });

  // API Routes
  app.get("/", (req, res) => res.send("Success!!!!!!"));

  app.post('/upload', upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    const fileName = `${Date.now()}-${file.originalname}`;

    fs.createReadStream(file.path)
      .pipe(bucket.openUploadStream(fileName, {
        metadata: {
          name: file.originalname,
          size: file.size,
          type: file.mimetype
        }
      }))
      .on("finish", () => res.status(201).json({ message: "File uploaded successfully", fileName }))
      .on("error", (err) => res.status(500).json({ error: err.message }));
  });


  app.get("/get-files", async (req, res) => {
    try {
      const files = await database.collection("fs.files").find().toArray();
  
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "No files found" });
      }
  
      res.json(files);
    } catch (error) {
      console.error("Error retrieving files:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  app.get("/get-file/:id", async (req, res) => {
    try {
      const fileId = new ObjectId(req.params.id);
      const client = await MongoClient.connect(mongo_uri, { useUnifiedTopology: true });
      const database = client.db("pdfstorage");
      const bucket = new GridFSBucket(database, { bucketName: "fs" });
  
      const file = await database.collection("fs.files").findOne({ _id: fileId });
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
  
      res.set("Content-Type", "application/pdf");
      bucket.openDownloadStream(fileId).pipe(res);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

