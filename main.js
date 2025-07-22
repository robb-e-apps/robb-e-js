async function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(plain) {
  const data = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function login() {
  const verifier = await generateCodeVerifier();
  const challenge = await sha256(verifier);
  const state = crypto.randomUUID();
  const tenantCode = '';
  const client_id = '';

  sessionStorage.setItem('code_verifier', verifier);
  sessionStorage.setItem('oauth_state', state);


  const res = await fetch(`http://localhost:3000/tenants/${tenantCode}/application-user-auth/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id,
      state,
      code_challenge: challenge,
      scopes: ['licenses:own'],
      redirect_uri: 'http://localhost:8080/api/callback',
    }),
  });

  const { redirectUrl } = await res.json();
  window.location.href = redirectUrl;
}

function showToken(jwt) {
  const payload = JSON.parse(atob(jwt.split('.')[1]));
  document.getElementById('output').textContent = JSON.stringify(payload, null, 2);
}

window.onload = () => {
  document.getElementById('login-btn').onclick = login;

  const params = new URLSearchParams(window.location.search);
  if (params.has('access_token')) {
    showToken(params.get('access_token'));
  }
};
