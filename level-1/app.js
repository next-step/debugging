const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일 저장 경로
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 원본 파일명 유지
  },
});

const upload = multer({ storage: storage });

app.use(express.static("public"));

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.json({
    message: "File uploaded successfully.",
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
