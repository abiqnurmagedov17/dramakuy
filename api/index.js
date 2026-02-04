// api/index.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const BASE = "https://magma-api.biz.id/dramabox";

async function proxy(res, url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ 
      error: "API error", 
      detail: e.message 
    });
  }
}

// Endpoints
app.get('/api/trending', (req, res) => {
  const page = req.query.page || 1;
  proxy(res, `${BASE}/trending?page=${page}`);
});

app.get('/api/foryou', (req, res) => {
  const page = req.query.page || 1;
  proxy(res, `${BASE}/foryou?page=${page}`);
});

app.get('/api/vip', (req, res) => {
  const page = req.query.page || 1;
  proxy(res, `${BASE}/vip?page=${page}`);
});

app.get('/api/latest', (req, res) => {
  const page = req.query.page || 1;
  proxy(res, `${BASE}/latest?page=${page}`);
});

app.get('/api/dubindo', (req, res) => {
  const page = req.query.page || 1;
  proxy(res, `${BASE}/dubindo?page=${page}`);
});

app.get('/api/search', (req, res) => {
  const query = req.query.query || '';
  const page = req.query.page || 1;
  proxy(
    res, 
    `${BASE}/search?query=${encodeURIComponent(query)}&page=${page}`
  );
});

app.get('/api/allepisode', (req, res) => {
  const bookId = req.query.bookId;
  proxy(res, `${BASE}/allepisode?bookId=${bookId}`);
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'DramaKuy API', 
    endpoints: [
      '/api/trending',
      '/api/foryou',
      '/api/vip',
      '/api/latest',
      '/api/dubindo',
      '/api/search',
      '/api/allepisode'
    ]
  });
});

// Export sebagai serverless function
module.exports = app;