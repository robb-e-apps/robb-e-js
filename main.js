import {
  REDIRECT_URI,
  API_BASE,
  TENANT_CODE,
  CLIENT_ID,
  AUTH_HEADER,
} from './config.js';

const CODE_VERIFIER_KEY = 'code_verifier';
const STATE_KEY = 'oauth_state';

function generateCodeVerifier() {
  const array = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

function sha256Hex(input) {
  return sha256(input);
}

async function login() {
  const verifier = generateCodeVerifier();
  const challenge = sha256Hex(verifier);
  const state = crypto.randomUUID();

  sessionStorage.setItem(CODE_VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
  document.cookie = `${CODE_VERIFIER_KEY}=${verifier}; path=/`;

  const res = await fetch(
    `${API_BASE}/tenants/${TENANT_CODE}/applications/users/authorize`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_HEADER,
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        state,
        code_challenge: challenge,
        scopes: ['licenses:own'],
        redirect_uri: REDIRECT_URI,
      }),
    },
  );

  const { redirectUrl } = await res.json();
  if (!redirectUrl) return alert('❌ redirectUrl not returned!');

  window.location.href = redirectUrl;
}

function showToken(jwt) {
  const payload = JSON.parse(atob(jwt.split('.')[1]));
  document.getElementById('output').textContent = JSON.stringify(
    payload,
    null,
    2,
  );
}

window.onload = () => {
  document.getElementById('login-btn').onclick = login;

  const params = new URLSearchParams(window.location.search);
  if (params.has('access_token')) showToken(params.get('access_token'));
};
