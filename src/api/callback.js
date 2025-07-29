import {
  HOST,
  ROBBE_BE_URL,
  APPLICATION_CODE,
  PORT,
} from '../config/config.js';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export async function handler(req, res) {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).send('Missing `code` or `state`');

  const code_verifier =
    req.headers.cookie?.match(/code_verifier=([^;]+)/)?.[1] || '';

  const tokenRes = await fetch(`${ROBBE_BE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      app_id: APPLICATION_CODE,
      code_verifier,
      state,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(500).send(`❌ Token exchange failed: ${err}`);
  }

  const { access_token, refresh_token } = await tokenRes.json();

  res.write(`
  <script>
    sessionStorage.setItem('${ACCESS_TOKEN_KEY}', '${access_token}');
    sessionStorage.setItem('${REFRESH_TOKEN_KEY}', '${refresh_token}');
    window.location.href = '${HOST}:${PORT}/result';
  </script>
`);
  res.end();
}
