# 🔐 Robb-e Platform Web Integration Demo

OAuth2 Authorization Code Flow (User Login)

This project demonstrates how a third-party **web application** can authenticate users via the **Robb-e platform** using the **OAuth2 Authorization Code Flow with PKCE**.

---

## 📋 Prerequisites

Before running the demo, you must register and set up your **Application** on the [Robb-e platform](https://www.robb-e.com):

1. Ensure you select a **Robb-e Sales product** (checkbox) when registering your workspace.
2. In the left menu, go to **Portfolio → Products** and create a **Product**.
3. Create at least one **Component** and add it to newly created **Free or Trial Edition**.
4. You can skip **Pricing** tab in testing mode.
5. Under the product’s **Integration** tab, create a new **Application**.
   - Configure Redirect URI: `http://localhost:8095/oauth-callback`
   - Configure Cancel URI: `http://localhost:8095/oauth-cancel`
   - Select the default license type
6. Save the generated **Application Code** (`client_id`).
7. Open the existing `.env` file in this project and replace the dummy value of `APPLICATION_CODE` with your code from the Robb-e platform:

```env
PORT=8095
HOST=http://localhost
PORT_FE=8080
PORT_BE=3000

APPLICATION_CODE=[paste-your-application-code-here]
```

> ⚠️ Without a valid `APPLICATION_CODE`, the login flow will not work.
> ⚠️ In **testing mode**, the login user must be a **member of the workspace** where the Product and Application have been registered.
> ⚠️ Make sure you are logged out of the Robb-e platform before testing the flow.

---

## ▶️ Start the Application

Install dependencies and run the demo:

```bash
npm install
npm start
```

The app will be available at:
👉 [http://localhost:8095](http://localhost:8095)

---

## ▶️ Test the Integration

1. Open the demo app and click **Log in with Robb-e**.
2. You are redirected to the Robb-e platform login screen. Enter your email and verification code.
3. After login, confirm access for the product application.
4. The demo app exchanges the authorization code for tokens and displays the **Access Token** and **Refresh Token** payloads.
5. Click **Get User Details** to call a standard API endpoint with the `Authorization: Bearer <token>` header.
   The user details are displayed, demonstrating a simple token-based API request.
