/**
 * Robb-e OAuth2 PKCE Demo — main.js
 *
 * This file handles the client-side logic for the OAuth2 Authorization Code Flow with PKCE.
 *
 * Key functionality:
 * - Generates a secure PKCE code verifier and corresponding SHA-256 challenge.
 * - Sends a POST request to Robb-e's `/authorize` endpoint to obtain the login/consent redirect URL.
 * - Redirects the user to Robb-e for authentication and authorization.
 * - After successful login, Robb-e redirects back with an access token (via server callback).
 * - The access token (JWT) is decoded and its payload is displayed in the browser.
 */

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
  const outputEl = document.getElementById('output');
  outputEl.textContent = JSON.stringify(payload, null, 2);
  outputEl.style.display = 'block';
}

window.onload = () => {
  document.getElementById('login-btn').onclick = login;

  const params = new URLSearchParams(window.location.search);
  if (params.has('access_token')) showToken(params.get('access_token'));
};
