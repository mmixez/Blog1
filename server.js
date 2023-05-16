
// importing packages

const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();

// store pulic folder's path

const initialPath = path.join(__dirname, 'public');

app.use(express.static(initialPath));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(initialPath, 'home.html'));
});

app.get('/writing', (req, res) => {
  res.sendFile(path.join(initialPath, 'writing.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(initialPath, 'about.html'));
});

// upload link
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.image) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  const file = req.files.image;
  const date = new Date();
  const imageName = `${date.getTime()}-${file.name}`;
  const imagePath = path.join(initialPath, 'uploads', imageName);

  // Move uploaded file to uploads directory
  file.mv(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(`/uploads/${imageName}`);
  });
});

app.get('/:blog', (req, res) => {
  res.sendFile(path.join(initialPath, 'blog.html'));
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});



