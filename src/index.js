import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { HOST_IP, HOST, PORT } from './config/config.js';
import { handler as callbackHandler } from './api/callback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/result.html'));
});

app.get('/oauth-cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/cancel.html'));
});

app.get('/config/config.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'config/config.js'));
});

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});

app.get('/oauth-callback', callbackHandler);

app.listen(PORT, HOST_IP, () => {
  console.info(`🚀 App running at ${HOST}:${PORT}`);
});
