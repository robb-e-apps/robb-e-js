import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
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
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'user/frontend/index.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'user/frontend/result.html'));
});

app.get('/oauth-cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'user/frontend/cancel.html'));
});

app.get('/error.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'user/frontend/error.html'));
});

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'user/api/main.js'));
});

app.get('/oauth-callback', callbackHandler);

app.get('/auth-url', (req, res) => {
  const randomBytes = crypto.randomBytes(32);

  const codeVerifier = Array.from(randomBytes, (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');

  const digest = crypto
    .createHash('sha256')
    .update(Buffer.from(codeVerifier, 'utf8'))
    .digest();

  const codeChallenge = Array.from(digest, (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');

  const state = crypto.randomUUID();

  res.cookie('code_verifier', codeVerifier, { path: '/', httpOnly: true });
  res.cookie('oauth_state', state, { path: '/', httpOnly: true });

  const redirectUri = `${HOST}:${PORT}/oauth-callback`;

  const url =
    `${ROBBE_FE_URL}/app/authorize` +
    `?client_id=${APPLICATION_CODE}` +
    `&code_challenge=${codeChallenge}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scopes=license:own` +
    `&state=${state}`;

  res.json({ url });
});

app.get('/users/:tenantCode/:userCode', async (req, res) => {
  const { tenantCode, userCode } = req.params;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send('Missing access token');
  }

  try {
    const response = await fetch(
      `${ROBBE_BE_URL}/tenants/${encodeURIComponent(tenantCode)}/users/${encodeURIComponent(userCode)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Failed to proxy user request:', err);
    res.status(500).send('Proxy error');
  }
});

app.get('/clear-cookies', (req, res) => {
  res.clearCookie('code_verifier', { path: '/' });
  res.clearCookie('oauth_state', { path: '/' });
  res.clearCookie('connect.sid', { path: '/' });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.info(`🚀 App running at ${HOST}:${PORT}`);
});
