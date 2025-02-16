require('dotenv').config();

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');

// Configuración de conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'components', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.html'));
});

app.get('/uploadUser', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.html'));
});

app.post('/uploadSuccessful', urlencodedParser, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO ranking (rank, score, name) VALUES (?, ?, ?)',
      [req.body.rank, req.body.score, req.body.name]
    );
    await connection.end();
    res.status(200).send('<h1>User added successfully</h1>');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding user');
  }
});

app.get('/allUsers', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute('SELECT * FROM ranking');
    await connection.end();

    if (users.length > 0) {
      let tableContent = users
        .map(
          (user) =>
            `<tr>
              <td>${user.rank}</td>
              <td>${user.score}</td>
              <td>${user.name}</td>
            </tr>`
        )
        .join('');

      res.status(200).send(`
        <html>
          <head>
            <title>Users</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              a { text-decoration: none; color: #0a16f7; margin: 15px; }
            </style>
          </head>
          <body>
            <h1>Users</h1>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Score</th>
                  <th>Name</th> 
                  </tr>
              </thead>
              <tbody>
                ${tableContent}
              </tbody>
            </table>
            <div>
              <a href="/">Inicio</a>
              <a href="/uploadUser">Add Score</a>
            </div>
          </body>
        </html>
      `);
    } else {
      res.status(404).send('Ranking not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving ranking');
  }
});

app.listen(3000, () => console.log('Server ready on port 3000.'));
app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});

module.exports = app;
