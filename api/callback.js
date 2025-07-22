export async function handler(req, res) {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send('Missing `code` or `state`');
  }

  const cookies = req.headers.cookie || '';
  const match = cookies.match(/code_verifier=([^;]+)/);
  const code_verifier = match ? decodeURIComponent(match[1]) : '';

  const tokenRes = await fetch('http://localhost:3000/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      app_id: '1f06708c-b44f-6a20-9695-aa8c81cce146',
      code_verifier,
      state,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(500).send(`❌ Token exchange failed: ${err}`);
  }

  const { access_token } = await tokenRes.json();

  res.writeHead(302, {
    Location: `${process.env.FRONTEND_URL || ''}/?access_token=${access_token}`,
  });
  res.end();
}
