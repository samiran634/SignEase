const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/files", express.static("files"));
require("dotenv").config();
const PORT=process.env.PORT||5000;
//mongodb connection----------------------------------------------
const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
}

console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
  });
//multer------------------------------------------------------------
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});
app.get("/get-file", async (req, res) => {
    let {key} =req.query;
    if (!mongoose.Types.ObjectId.isValid(key)) {
      return res.status(400).json({ status: "error", error: "Invalid PDF ID" });
  }
    try {
        const data = await PdfSchema.findById(key);
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: error.message });
    }
});

//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(5000, () => {
  console.log(`Server Started on http//localhost:${PORT}`);
});