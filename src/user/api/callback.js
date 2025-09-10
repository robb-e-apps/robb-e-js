import {
  ROBBE_BE_URL,
  APPLICATION_CODE,
  HOST,
  PORT,
} from '../../config/config.js';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = Object.fromEntries(
    (req.headers.cookie || '')
      .split('; ')
      .map((c) => c.split('=').map(decodeURIComponent)),
  );

  if (!code || !state) return res.status(400).send('Missing `code` or `state`');

  const code_verifier = cookies.code_verifier || '';
  const storedState = cookies.oauth_state || '';
  if (state !== storedState) return res.status(400).send('Invalid state');

  try {
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
      const errText = await tokenRes.text();
      const errorJson = encodeURIComponent(errText);
      const message = encodeURIComponent('Token exchange failed');

      return res.redirect(`/error.html?message=${message}&error=${errorJson}`);
    }

    const { access_token, refresh_token } = await tokenRes.json();

    res.send(`
      <script>
        sessionStorage.setItem('${ACCESS_TOKEN_KEY}', '${access_token}');
        sessionStorage.setItem('${REFRESH_TOKEN_KEY}', '${refresh_token}');
        window.location.href = '${HOST}:${PORT}/result';
      </script>
    `);
  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).send('Token exchange failed');
  }
}
