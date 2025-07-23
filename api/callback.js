/**
 * Robb-e OAuth2 PKCE Demo — callback.js
 *
 * This serverless handler processes the OAuth2 authorization code callback from Robb-e.
 *
 * Key functionality:
 * - Receives the `code` and `state` as query parameters from the redirect_uri.
 * - Extracts the original `code_verifier` (stored in browser cookies).
 * - Sends a POST request to Robb-e's `/oauth/token` endpoint to exchange the code for an access token.
 * - If successful, the server responds with a 302 redirect to the frontend,
 *   attaching the access token (JWT) as a query param.
 * - If unsuccessful, a 500 error is returned with the error message.
 */

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
