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
  const tenantCode = '1f0670a8-ffd9-6560-ab4c-0104e6b8c6ff';
  const client_id = '1f06708c-b44f-6a20-9695-aa8c81cce146';

  sessionStorage.setItem('code_verifier', verifier);
  sessionStorage.setItem('oauth_state', state);
  document.cookie = `code_verifier=${verifier}; path=/`;

const res = await fetch(`http://localhost:3000/tenants/${tenantCode}/applications/users/authorize`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '25ee73a499c098bcc1f630080fdd3b7b8ac0908e43aedf58f9cdd6e127da78e0',
  },
  body: JSON.stringify({
    client_id,
    state,
    code_challenge: challenge,
    scopes: ['licenses:own'],
    redirect_uri: 'http://localhost:8080/api/callback',
  }),
});

const result = await res.json();
console.log('Auth response:', result);

const { redirectUrl } = result;
if (!redirectUrl) {
  alert('❌ redirectUrl not returned!');
  return;
}
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
