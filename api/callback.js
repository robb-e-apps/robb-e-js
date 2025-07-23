import { REDIRECT_BASE, API_BASE, CLIENT_ID } from '../config.js';

export async function handler(req, res) {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).send('Missing `code` or `state`');

  const code_verifier =
    req.headers.cookie?.match(/code_verifier=([^;]+)/)?.[1] || '';

  const tokenRes = await fetch(`${API_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, app_id: CLIENT_ID, code_verifier, state }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(500).send(`❌ Token exchange failed: ${err}`);
  }

  const { access_token } = await tokenRes.json();

  res.writeHead(302, {
    Location: `${REDIRECT_BASE}/?access_token=${access_token}`,
  });
  res.end();
}
