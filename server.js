const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* Serve frontend and uploaded files */
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* Multer config */
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

/* Upload route */
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file received");
  }
  res.sendStatus(200);
});

/* List videos */
app.get("/videos", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.json([]);
    res.json(files);
  });
});

/* Delete video */
app.delete("/delete/:name", (req, res) => {
  fs.unlink(path.join("uploads", req.params.name), () => {
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
