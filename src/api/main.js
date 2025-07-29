let HOST, PORT, ROBBE_FE_URL, APPLICATION_CODE;

async function loadConfig() {
  const res = await fetch('/config.json');
  const config = await res.json();
  ({ HOST, PORT, ROBBE_FE_URL, APPLICATION_CODE } = config);
}

const CODE_VERIFIER_KEY = 'code_verifier';
const STATE_KEY = 'oauth_state';

async function generateCodeChallengeAndVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const codeVerifier = Array.from(array, (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(digest));
  const codeChallenge = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { codeVerifier, codeChallenge };
}

function storeSessionData(codeVerifier, sessionId) {
  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  sessionStorage.setItem(STATE_KEY, sessionId);
  document.cookie = `${CODE_VERIFIER_KEY}=${codeVerifier}; path=/`;
}

async function generateOAuth2URL() {
  const { codeVerifier, codeChallenge } =
    await generateCodeChallengeAndVerifier();

  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  const sessionId = Array.from(array, (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');

  storeSessionData(codeVerifier, sessionId);

  const redirectUri = encodeURIComponent(`${HOST}:${PORT}/oauth-callback`);

  return `${ROBBE_FE_URL}/app/authorize?client_id=${APPLICATION_CODE}&code_challenge=${codeChallenge}&redirect_uri=${redirectUri}&scopes=license:own&state=${sessionId}`;
}

async function login() {
  const oauthUrl = await generateOAuth2URL();
  window.location.href = oauthUrl;
}

window.onload = async () => {
  await loadConfig();
  document.getElementById('login-btn').onclick = login;
};
