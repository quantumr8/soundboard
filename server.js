const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use('/sounds', express.static('uploads'));

app.get('/sounds', async (req, res) => {
  try {
    const files = await fs.readdir('uploads');
    res.json(files.map(file => ({ name: path.basename(file, path.extname(file)), file })));
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.post('/upload', upload.array('sounds'), (req, res) => {
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
