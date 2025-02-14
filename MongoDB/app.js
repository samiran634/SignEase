const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const methodOverride = require("method-override");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
 

app.use(cors({
  origin: "http://localhost:5173",  // Replace with React's running URL
  methods: "GET, POST, DELETE",
  allowedHeaders: "Content-Type"
}));

const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));
app.use(bodyParser.json());

// MongoDB connection
const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to database"))
  .catch((e) => console.error("MongoDB connection error:", e));

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("GridFS initialized");
});

// ✅ Corrected Multer storage engine (uses `url` instead of `db`)
const storage = new GridFsStorage({
  url: mongoUrl, // Use URL instead of db
 
  file: (req, file) =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        resolve({
          filename,
          bucketName: "uploads",
          metadata: { contentType: file.mimetype },
        });
      });
    }),
});

const upload = multer({ storage });

// Upload file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }
  res.json({ file: req.file });
});

// Get all files
app.get("/files", async (req, res) => {
  try {
    const files = await conn.db.collection("uploads.files").find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "No files exist" });
    }
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single file by filename
app.get("/files/:filename", async (req, res) => {
  try {
    const file = await conn.db.collection("uploads.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stream image
app.get("/image/:filename", async (req, res) => {
  try {
    const file = await conn.db.collection("uploads.files").findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const contentType = file.contentType || file.metadata?.contentType;
    if (contentType === "image/jpeg" || contentType === "image/png") {
      const readstream = gfs.openDownloadStreamByName(file.filename);
      res.set("Content-Type", contentType);
      readstream.pipe(res);
    } else {
      res.status(400).json({ error: "Not an image file" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file by ID
app.delete("/files/:id", async (req, res) => {
  try {
    await gfs.delete(new mongoose.Types.ObjectId(req.params.id));
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route
app.get("/", (req, res) => {
  res.send("Success!!!!!!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
