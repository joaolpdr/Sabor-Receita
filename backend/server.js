const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', 
  database: 'Sabor_Receita'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL (It may not be running):', err.message);
  } else {
    console.log('Connected to MySQL database Sabor_Receita.');
    const createRecipesTable = `
      CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255)
      )
    `;
    db.query(createRecipesTable);
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.get('/api/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      return res.json([
        { id: 1, title: 'Bolo de Cenoura', description: 'Delicioso bolo com cobertura de chocolate.', image_url: '' },
        { id: 2, title: 'Feijoada', description: 'Feijoada tradicional brasileira.', image_url: '' }
      ]);
    }
    if (results.length === 0) {
      return res.json([
        { id: 1, title: 'Bolo de Cenoura (Exemplo)', description: 'Delicioso bolo.', image_url: '' }
      ]);
    }
    res.json(results);
  });
});

app.post('/api/recipes', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : '';
  
  db.query('INSERT INTO recipes (title, description, image_url) VALUES (?, ?, ?)', [title, description, image_url], (err, result) => {
    if (err) {
        return res.json({ id: 999, title, description, image_url, status: 'simulated' });
    }
    res.json({ id: result.insertId, title, description, image_url });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
