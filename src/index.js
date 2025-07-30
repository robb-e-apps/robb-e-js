import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import {
  HOST,
  PORT,
  ROBBE_FE_URL,
  ROBBE_BE_URL,
  APPLICATION_CODE,
} from './config/config.js';
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

app.get('/config.json', (req, res) => {
  res.json({
    HOST,
    PORT,
    ROBBE_FE_URL,
    ROBBE_BE_URL,
    APPLICATION_CODE,
  });
});

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'api/main.js'));
});

app.get('/user.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'api/user.js'));
});

app.get('/oauth-callback', callbackHandler);

app.listen(PORT, () => {
  console.info(`🚀 App running at ${HOST}:${PORT}`);
});
