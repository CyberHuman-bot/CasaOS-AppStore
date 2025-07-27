const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve apps.json (app list)
app.get('/apps', (req, res) => {
  res.sendFile(path.join(__dirname, 'apps', 'apps.json'));
});

// Serve frontend static files (index.html, css, icons, screenshots)
app.use('/static', express.static(path.join(__dirname, '..', 'frontend')));

// Proxy install request to CasaOS API
app.post('/install-app', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:80/v1/app/install', req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Install failed', error: error.message });
  }
});

// Serve frontend homepage at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API & frontend server running at http://localhost:${PORT}`);
});
