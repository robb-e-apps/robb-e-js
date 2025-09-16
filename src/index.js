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
import { handler as callbackHandler } from './user/api/callback.js';
import { forwardTokenRequest } from './m2m/api/proxy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/user', (req, res) => {
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

app.get('/user-main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'user/api/user-main.js'));
});

app.get('/m2m', (req, res) => {
  res.sendFile(path.join(__dirname, 'm2m/frontend/index.html'));
});

app.get('/m2m/m2m-main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'm2m/api/m2m-main.js'));
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

app.post('/m2m-token', async (req, res) => {
  const { grant_type } = req.query;
  const { client_id, client_secret } = req.body;

  const { status, data } = await forwardTokenRequest(grant_type, {
    client_id,
    client_secret,
  });

  res.status(status).json(data);
});

app.post('/m2m-refresh-token', async (req, res) => {
  const { grant_type } = req.query;
  const { client_id, client_secret, refresh_token } = req.body;

  const { status, data } = await forwardTokenRequest(grant_type, {
    client_id,
    client_secret,
    refresh_token,
  });

  res.status(status).json(data);
});

app.get(
  '/clients/:tenantCode/:applicationCode/:clientCode',
  async (req, res) => {
    const { tenantCode, applicationCode, clientCode } = req.params;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).send('Missing access token');
    }

    try {
      const response = await fetch(
        `${ROBBE_BE_URL}/tenants/${encodeURIComponent(tenantCode)}/applications/${encodeURIComponent(applicationCode)}/clients/${encodeURIComponent(clientCode)}`,
        {
          method: 'GET',
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
      return res.json(data);
    } catch (err) {
      console.error('❌ Failed to proxy client request:', err);
      return res.status(500).send('Proxy error');
    }
  },
);

app.get('/clear-cookies', (req, res) => {
  res.clearCookie('code_verifier', { path: '/' });
  res.clearCookie('oauth_state', { path: '/' });
  res.clearCookie('connect.sid', { path: '/' });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.info(`🚀 App running at ${HOST}:${PORT}`);
});
