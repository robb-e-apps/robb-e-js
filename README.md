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
2. **You should have a Robb-e Sales license**
3. **Create a product** in your Robb-e dashboard.
4. **Create Free or Trial Edition** in product to use it as **_default license type_** in your Application
5. **Add an application** to that product (**Integration** tab).
6. In the application's settings:
   - Set the your **Redirect URI** and **Cancel URI**. For example:
     - `http://localhost:8095/oauth-callback`
     - `http://localhost:8095/oauth-cancel`
     - Select default license type for Application
   - Save the generated **Application Code** (also referred to as `client_id`).
7. In this demo app, create `.env` file with necessary information:
   - **PORT=8095** _(Your app port)_
   - **HOST=http://localhost** _(Your app host)_
   - **PORT_FE=8080** _(Robb-e frontend port)_
   - **PORT_BE=3000** _(Robb-e backend port)_
   - **APPLICATION_CODE=1f071fae-6b8f-6890-97c0-aaa0fd990802** _(Your created Application `(client_id)`)_
     `

> ⚠️ Without a valid Application Code, the authentication flow will not work.

> ⚠️ Also don't forget to logout from Robb-e to correctly test thr OAuth flow

---

## 🚀 Getting Started

### ▶️ Start the demo server

```bash
npm install
npm start
```

#### The app will be available at:

`http://localhost:8095`

---
