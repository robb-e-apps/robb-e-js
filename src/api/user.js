let BACKEND_BASE_URL;

async function loadBackendUrl() {
  const res = await fetch('/config.json');
  const config = await res.json();
  BACKEND_BASE_URL = config.ROBBE_BE_URL;
}

export async function fetchUserDetails({ tenantCode, userCode, accessToken }) {
  if (!BACKEND_BASE_URL) await loadBackendUrl();

  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/tenants/${tenantCode}/users/${userCode}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (err) {
    console.error('❌ Failed to fetch user details:', err);
    throw err;
  }
}
