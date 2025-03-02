const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { MongoClient, GridFSBucket } = require("mongodb");
const RateLimit = require('express-rate-limit');
const { ObjectId } = require("mongodb");
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

// Rate Limiter Setup
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

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

  // Start Express app after DB is connected
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });

  app.get("/", limiter, (req, res) => res.send("Success!!!!!!"));

  app.post('/upload', limiter, upload.single("file"), async (req, res) => {
    const file = req.file;
    const orgId = req.query.orgId;  

    if (!file) return res.status(400).send("No file uploaded.");
    if (!orgId) return res.status(400).send("Organization ID required.");

    const orgDB = database.collection(`fs.${orgId}`);  
    const bucket = new GridFSBucket(database, { bucketName: `fs.${orgId}` });

    const fileName = `${Date.now()}-${file.originalname}`;

    fs.createReadStream(file.path)
      .pipe(bucket.openUploadStream(fileName, {
        metadata: {
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          organization: orgId  
        }
      }))
      .on("finish", () => res.status(201).json({ message: "File uploaded successfully", fileName }))
      .on("error", (err) => res.status(500).json({ error: err.message }));
});

  // Get Files of an Organization
  app.get("/get-files", limiter, async (req, res) => {
    const orgId = req.query.orgId;

    try {
      const files = await database.collection(`fs.${orgId}.files`).find().toArray();

      if (!files || files.length === 0) {
        return res.status(404).json({ message: "No files found for this organization" });
      }

      res.json(files);
    } catch (error) {
      console.error("Error retrieving files:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Get File by ID from Organization
  app.get("/get-file", limiter, async (req, res) => {
    const orgName = req.query.orgName;
    const fileId = new ObjectId(req.query.fileId);
    console.log(orgName, fileId);
    try {
      const bucket = new GridFSBucket(database, { bucketName: `fs.${orgName}` });
      const file = await database.collection(`fs.${orgName}.files`).findOne({ _id: fileId });

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      res.set("Content-Type", file.metadata.type);
      bucket.openDownloadStream(fileId).pipe(res);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

});
