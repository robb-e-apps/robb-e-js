import { ROBBE_BE_URL } from '../../config/config.js';

export async function forwardTokenRequest(grantType, body) {
  const url = `${ROBBE_BE_URL}/application/client/oauth/token?grant_type=${grantType}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return { status: response.status, data };
}
