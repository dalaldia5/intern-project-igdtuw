// routes/fileRoute.js
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const dotenv = require("dotenv");
const { Readable } = require("stream");

dotenv.config();
const router = express.Router();

// ✅ Temporary memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload file (store directly to GridFS)
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded!" });

    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });

    const filename = Date.now() + "-" + req.file.originalname;
    const readableStream = Readable.from(req.file.buffer);

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    readableStream
      .pipe(uploadStream)
      .on("error", (err) => {
        console.error("❌ Upload error:", err);
        res.status(500).json({ message: "Upload failed!" });
      })
      .on("finish", () => {
        res.json({
          message: "✅ File uploaded successfully!",
          file: {
            filename,
            originalname: req.file.originalname, // ✅ added
            contentType: req.file.mimetype,
          },
        });
      });
  } catch (err) {
    console.error("❌ Error uploading file:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch all files
router.get("/files", async (req, res) => {
  try {
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    const files = await bucket.find().toArray();

    if (!files || files.length === 0)
      return res.status(404).json({ message: "No files found!" });

    res.json(files);
  } catch (err) {
    console.error("❌ Error fetching files:", err);
    res.status(500).json({ message: "Error fetching files" });
  }
});

// ✅ Download a single file
router.get("/file/:filename", async (req, res) => {
  try {
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    const files = await bucket
      .find({ filename: req.params.filename })
      .toArray();

    if (!files || files.length === 0)
      return res.status(404).json({ message: "File not found!" });

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    bucket.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (err) {
    console.error("❌ Error retrieving file:", err);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

// ✅ Delete a file by filename or ObjectId
router.delete("/file/:identifier", async (req, res) => {
  try {
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
    const identifier = req.params.identifier.trim();

    // Check if identifier is ObjectId
    let file;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      file = await bucket.find({ _id: new mongoose.Types.ObjectId(identifier) }).toArray();
    } else {
      file = await bucket.find({ filename: identifier }).toArray();
    }

    if (!file || file.length === 0) {
      console.warn(`❌ File not found in DB for: ${identifier}`);
      return res.status(404).json({ message: `File not found: ${identifier}` });
    }

    await bucket.delete(file[0]._id);
    console.log(`✅ Deleted file: ${file[0].filename}`);
    res.status(200).json({ message: "✅ File deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting file:", err);
    res.status(500).json({ message: "Error deleting file" });
  }
});




module.exports = router;
