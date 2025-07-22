const express = require('express');
const path = require('path');
const { handler } = require('./api/callback.js');

const app = express();

// Serve static files
app.use(express.static(__dirname));

// Proxy for serverless function
app.get('/api/callback', (req, res) => handler(req, res));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Demo app running at http://localhost:${PORT}`);
});
