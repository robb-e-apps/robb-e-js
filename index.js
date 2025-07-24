import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { HOST_IP } from './config.js';
import { handler as callbackHandler } from './api/callback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'result.html'));
});

app.get('/oauth-cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'cancel.html'));
});

app.get('/config.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'config.js'));
});

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});

app.get('/oauth-callback', callbackHandler);

const PORT = 8081;
app.listen(PORT, HOST_IP, () => {
  console.log(`🚀 App running at http://localhost:${PORT}`);
});
