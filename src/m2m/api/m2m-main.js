let currentAccessToken = null;
let currentRefreshToken = null;

function decodeJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    ['iat', 'exp'].forEach((key) => {
      if (payload[key]) {
        const readable = new Date(payload[key] * 1000).toISOString();
        payload[key] = `${payload[key]} (${readable})`;
      }
    });
    return JSON.stringify(payload, null, 2);
  } catch (e) {
    return '❌ Invalid token format.';
  }
}

function updateUIWithTokens() {
  const access = sessionStorage.getItem('access_token');
  const refresh = sessionStorage.getItem('refresh_token');

  if (access) {
    currentAccessToken = access;
    document.getElementById('access-token-info').textContent =
      decodeJwt(access);
    document.getElementById('access-box').style.display = 'block';
  }

  if (refresh) {
    currentRefreshToken = refresh;
    document.getElementById('refresh-token-info').textContent =
      decodeJwt(refresh);
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

  if (!currentAccessToken) {
    resultBox.textContent = '❌ No access token available.';
    return;
  }

  let payload;
  try {
    payload = JSON.parse(atob(currentAccessToken.split('.')[1]));
  } catch (err) {
    resultBox.textContent = '❌ Invalid access token format.';
    return;
  }

  const { tenantCode, applicationCode, applicationClientCode } = payload;

  try {
    const res = await fetch(
      `/clients/${tenantCode}/${applicationCode}/${applicationClientCode}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
      },
    );

    const text = await res.text();

    if (!res.ok) {
      resultBox.textContent = `❌ API Error:\n${text}`;
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
      resultBox.textContent = `API Response:\n${JSON.stringify(parsed, null, 2)}`;
    } catch {
      resultBox.textContent = `API Response:\n${text}`;
    }
    resultBox.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    resultBox.textContent = `❌ Request failed: ${err.message}`;
  }
}

window.onload = () => {
  updateUIWithTokens();

  document.getElementById('auth-form').addEventListener('submit', getToken);
  document
    .getElementById('refresh-btn')
    .addEventListener('click', refreshToken);
  document
    .getElementById('call-api-btn')
    .addEventListener('click', callProtectedApi);
  document.getElementById('clear-btn').addEventListener('click', clearTokens);
};
