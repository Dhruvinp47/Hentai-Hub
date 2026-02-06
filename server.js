const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Serve public folder
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Endpoint to upload
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.originalname });
});

// Endpoint to list all videos
app.get('/videos', (req, res) => {
  const files = fs.readdirSync('uploads/');
  const videos = files.map(f => ({ url: `/uploads/${f}`, filename: f }));
  res.json(videos);
});

// Delete video
app.delete('/videos/:filename', (req, res) => {
  const filePath = `uploads/${req.params.filename}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.sendStatus(200);
  }
  res.sendStatus(404);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
