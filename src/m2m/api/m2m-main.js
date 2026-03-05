let currentAccessToken = null;
let currentRefreshToken = null;

function base64UrlDecodeToString(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return atob(b64);
}

function decodeJwtPayload(token) {
  if (!token) throw new Error('Missing token');

  token = token.trim().replace(/^Bearer\s+/i, '');
  const parts = token.split('.');
  if (parts.length !== 3)
    throw new Error(`Invalid JWT (got ${parts.length} parts)`);

  const json = base64UrlDecodeToString(parts[1]);
  return JSON.parse(json);
}

function formatPayloadForUi(payload) {
  const copy = structuredClone(payload);

  ['iat', 'exp'].forEach((key) => {
    if (copy[key]) {
      const readable = new Date(copy[key] * 1000).toISOString();
      copy[key] = `${copy[key]} (${readable})`;
    }
  });

  return JSON.stringify(copy, null, 2);
}

function updateUIWithTokens() {
  const access = sessionStorage.getItem('access_token');
  const refresh = sessionStorage.getItem('refresh_token');

  if (access) {
    currentAccessToken = access;
    document.getElementById('access-token-info').textContent =
      formatPayloadForUi(decodeJwtPayload(access));
    document.getElementById('access-box').style.display = 'block';
  }

  if (refresh) {
    currentRefreshToken = refresh;
    document.getElementById('refresh-token-info').textContent =
      formatPayloadForUi(decodeJwtPayload(refresh));
    document.getElementById('refresh-box').style.display = 'block';
  }

  if (access || refresh) {
    document.getElementById('actions').style.display = 'flex';
    document.getElementById('result-box').style.display = 'block';
    document.getElementById('clear-btn').style.display = 'inline-block';
  }
}

function clearTokens() {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');

  currentAccessToken = null;
  currentRefreshToken = null;

  document.getElementById('access-box').style.display = 'none';
  document.getElementById('refresh-box').style.display = 'none';
  document.getElementById('actions').style.display = 'none';
  document.getElementById('result-box').style.display = 'none';
  document.getElementById('result-box').textContent = '';
  document.getElementById('clear-btn').style.display = 'none';
}

async function getToken(event) {
  event.preventDefault();

  const client_id = document.getElementById('client-id').value.trim();
  const client_secret = document.getElementById('client-secret').value.trim();

  const res = await fetch('/m2m-token?grant_type=client_credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, client_secret }),
  });

  const result = document.getElementById('result-box');
  const json = await res.json();

  result.style.display = 'block';

  if (!res.ok) {
    result.textContent = `❌ Error: ${JSON.stringify(json, null, 2)}`;
    return;
  }

  const accessToken = json.access_token;
  const refreshToken = json.refresh_token;

  currentAccessToken = accessToken;
  currentRefreshToken = refreshToken;

  sessionStorage.setItem('access_token', accessToken);
  sessionStorage.setItem('refresh_token', refreshToken);

  updateUIWithTokens();

  result.textContent = `✅ Token:\n${JSON.stringify(json, null, 2)}`;
}

async function refreshToken() {
  const client_id = document.getElementById('client-id').value.trim();
  const client_secret = document.getElementById('client-secret').value.trim();

  const res = await fetch('/m2m-refresh-token?grant_type=refresh_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id,
      client_secret,
      refresh_token: currentRefreshToken,
    }),
  });

  const result = document.getElementById('result-box');
  const json = await res.json();

  if (!res.ok) {
    result.textContent = `❌ Refresh failed:\n${JSON.stringify(json, null, 2)}`;
    return;
  }

  const accessToken = json.access_token;
  const refreshToken = json.refresh_token;

  currentAccessToken = accessToken;
  currentRefreshToken = refreshToken;

  sessionStorage.setItem('access_token', accessToken);
  sessionStorage.setItem('refresh_token', refreshToken);

  updateUIWithTokens();

  result.textContent = `🔄 Token Refreshed:\n${JSON.stringify(json, null, 2)}`;
}

async function callProtectedApi() {
  const resultBox = document.getElementById('result-box');

  const access = currentAccessToken || sessionStorage.getItem('access_token');
  if (!access) {
    resultBox.textContent = '❌ No access token available.';
    return;
  }

  const payload = decodeJwtPayload(access);

  if (!payload || typeof payload !== 'object') {
    resultBox.textContent =
      '❌ Could not decode access token payload.\n\n' +
      'access(first 60): ' +
      String(access).slice(0, 60) +
      '...\n\n' +
      'payload: ' +
      JSON.stringify(payload, null, 2);
    return;
  }

  const tenantCode = payload.tenantCode;
  const applicationCode = payload.applicationCode;
  const applicationClientCode = payload.applicationClientCode;

  if (!tenantCode || !applicationCode || !applicationClientCode) {
    resultBox.textContent =
      '❌ Missing required fields in token payload.\n\n' +
      JSON.stringify(payload, null, 2);
    return;
  }

  const url = `/clients/${tenantCode}/${applicationCode}/${applicationClientCode}`;
  resultBox.textContent = `➡️ Calling:\n${url}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${access}` },
  });

  const text = await res.text();
  if (!res.ok) {
    resultBox.textContent = `❌ API Error:\n${text}`;
    return;
  }

  try {
    resultBox.textContent = `✅ API Response:\n${JSON.stringify(
      JSON.parse(text),
      null,
      2,
    )}`;
  } catch {
    resultBox.textContent = `✅ API Response:\n${text}`;
  }
}

async function getCredentials() {
  const flow = 'application-client';
  const params = new URLSearchParams({ flow });

  const res = await fetch(`/auth-url?${params.toString()}`);
  const { url } = await res.json();
  window.location.href = url;
}

window.onload = () => {
  updateUIWithTokens();

  document.getElementById('auth-form').addEventListener('submit', getToken);
  document.getElementById('refresh-btn').onclick = refreshToken;
  document.getElementById('call-api-btn').onclick = callProtectedApi;
  document.getElementById('clear-btn').onclick = clearTokens;

  document.getElementById('get-creds-btn').onclick = getCredentials;
};
