const PORT_FE = 8080;
const PORT_BE = 3000;
export const PORT = 8081;
export const HOST = 'http://localhost';
export const HOST_IP = '0.0.0.0';

export const ROBBE_BE_URL = `${HOST}:${PORT_BE}`;
export const ROBBE_FE_URL = `${HOST}:${PORT_FE}`;

export const REDIRECT_URI = `${ROBBE_FE_URL}/oauth-callback`;
export const APPLICATION_CODE = '1f06708c-b44f-6a20-9695-aa8c81cce146';

// Put {HOST}:{PORT}/oauth-callback as Redirect URL in your application in Robb-e
// Example: http://localhost:8081/oauth-callback
// Example: http://localhost:8081/oauth-cancel
