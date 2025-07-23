# 🔐 Robb-e Web Integration Demo: OAuth2 Authorization Code Flow (User Login)

This demo showcases how a third-party **web application** can authenticate users via **Robb-e** and access their license data using the **OAuth2 Authorization Code Flow with PKCE**.

---

## 🎯 Purpose

To demonstrate a **secure, standards-based user login flow** using Robb-e’s OAuth2 capabilities, where:

- A user logs into Robb-e
- Grants permission to an application
- The app receives a JWT `accessToken` containing license data

> ⚠️ This demo **only covers the user login flow** using Authorization Code + PKCE. It does **not** cover machine-to-machine (client credentials) flows.

---

## 🔧 Related Endpoint

Authorization is initiated via:

`POST /tenants/:tenantCode/applications/users/authorize`

**Example request payload**:

```json
{
  "client_id": "your-app-id",
  "state": "random-state-string",
  "code_challenge": "base64url-pkce-challenge",
  "scopes": ["licenses:own"],
  "redirect_uri": "http://localhost:8080/api/callback"
}
```

**Response:**

```json
{
  "redirectUrl": "string";
}
```

## ▶️ Start the server

```bash
npm start
```

## 🖥️ What Happens When You Click “Log in with Robb-e”?

1. Generates a **PKCE `code_challenge`**
2. Sends a `POST` request to Robb-e’s `/authorize` endpoint
3. Receives a `redirectUrl` for login & consent
4. Redirects the user to the Robb-e login UI
5. After user logs in and gives consent, they are redirected back to `/api/callback` with a `code` and `state`
6. The `/api/callback` endpoint exchanges the `code` for an `accessToken`
7. The access token (a JWT) is **decoded and displayed** in the browser

## 📁 Project File Overview

Here are the five main files and their roles in the demo:

### 1. `index.html`

- A simple static HTML page that renders the UI.

### 2. `main.js`

- Handles the client-side logic of the OAuth2 flow.
- Generates a PKCE `code_verifier` and its SHA-256 `code_challenge`.
- Sends a `POST` request to Robb-e’s `/authorize` endpoint to receive a `redirectUrl`.
- Redirects the user to the Robb-e login/consent page.
- After redirect back from Robb-e, decodes the `access_token` JWT and displays its payload.

### 3. `callback.js`

- A backend (serverless-style) handler that runs when Robb-e redirects to the `redirect_uri` with a `code` and `state`.
- Exchanges the authorization code and PKCE verifier for an `access_token` via the Robb-e `/oauth/token` endpoint.
- Redirects the user back to the app with the `access_token` as a query parameter.

### 5. `config.js`

- Stores configuration values like:
  - `REDIRECT_URI`
  - `API_BASE`
  - `TENANT_CODE`
  - `CLIENT_ID`
  - `AUTH_HEADER`
