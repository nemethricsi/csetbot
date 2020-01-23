const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ok');
});

app.post('/webhook', (req, res) => {
  res.send('webhook ok');
});

module.exports = app;
