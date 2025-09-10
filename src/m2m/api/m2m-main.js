let currentRefreshToken = null;
let currentAccessToken = null;

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

  if (!res.ok) {
    result.textContent = `❌ Error: ${JSON.stringify(json, null, 2)}`;
    return;
  }

  currentAccessToken = json.access_token;
  currentRefreshToken = json.refresh_token;
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

  currentAccessToken = json.access_token;
  currentRefreshToken = json.refresh_token;
  result.textContent = `🔄 Token Refreshed:\n${JSON.stringify(json, null, 2)}`;
}

async function callProtectedApi() {
  const res = await fetch('/protected-user', {
    method: 'GET',
    headers: { Authorization: `Bearer ${currentAccessToken}` },
  });

  const result = document.getElementById('result-box');
  const text = await res.text();
  result.textContent = `🔐 API Response:\n${text}`;
}

window.onload = () => {
  document.getElementById('auth-form').addEventListener('submit', getToken);
  document
    .getElementById('refresh-btn')
    .addEventListener('click', refreshToken);
  document
    .getElementById('call-api-btn')
    .addEventListener('click', callProtectedApi);
};
