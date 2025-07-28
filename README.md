# 🔐 Robb-e Web Integration Demo: OAuth2 Authorization Code Flow (User Login)

This demo showcases how a third-party **web application** can authenticate users via **Robb-e** and access their license data using the **OAuth2 Authorization Code Flow with PKCE**.

---

## 🎯 Purpose

To demonstrate a **secure, standards-based login flow** using Robb-e’s OAuth2 capabilities:

- A user logs in via Robb-e
- Grants access to the application
- The app receives a JWT `access_token`
- The decoded token payload is displayed on the result screen

> ⚠️ This demo **only covers user login via Authorization Code + PKCE**. It does **not** cover client credentials (M2M) flows.

---

## ▶️ How It Works

### 🔐 OAuth2 Flow (PKCE)

1. The app generates a `code_verifier` and `code_challenge` (SHA-256).
2. It redirects the user to Robb-e’s authorize page:

`GET /app/authorize?client_id=...&code_challenge=...&state=...&redirect_uri=...`

3. The user logs into Robb-e and confirms access.
4. Robb-e redirects to your app’s `redirect_uri` with a `code` and `state`.
5. Backend exchanges the code (and verifier) for an `access_token`:
6. After exchange, the user is redirected to `/result?access_token=...`
7. The frontend decodes the token and displays its content.

---

## 🔧 Setup Instructions

Before running this demo, follow these steps to configure your Robb-e application:

1. **Register on [Robb-e](https://dev.robb-e.com/)** if you don’t already have an account.
2. **Create a product** in your Robb-e dashboard.
3. **Add an application** to that product.
4. In the application's settings:
   - Set the **Redirect URI** to:  
     `http://localhost:8081/oauth-callback`
   - Save the generated **Application Code** (also referred to as `client_id`).
5. In this demo app, update the config to use your **Application Code**.

> ⚠️ Without a valid Application Code, the authentication flow will not work.

---

## 🚀 Getting Started

### ▶️ Start the demo server

```bash
npm install
npm start
```

#### The app will be available at:

`http://localhost:8081`

Make sure this matches the redirect URI registered in your Robb-e application settings:

`http://localhost:8081/oauth-callback`

---
