# 🔐 Robb-e Platform Web Integration Demo

This project demonstrates how a third-party **web application** can authenticate with the **Robb-e platform** using:

- **OAuth2 Authorization Code Flow with PKCE** (User Login)
- **OAuth2 Client Credentials Flow** (Machine-to-Machine / M2M)

---

## 🧭 Choose a Flow

After starting the app and visiting [http://localhost:8095](http://localhost:8095), you can choose between:

- **User Login Flow** — Authenticate end users via browser and fetch their user details.
- **M2M Flow** — Authenticate a backend service or client app via client credentials.

Both flows are isolated and independently testable.

---

## 📋 Prerequisites

Before running the demo, you must register and set up your **Application** on the [Robb-e platform](https://www.robb-e.com):

1. Ensure you select a **Robb-e Sales product** (checkbox) when registering your workspace.
2. In the left menu, go to **Portfolio → Products** and create a **Product**.
3. Create at least one **Component** and add it to newly created **Free or Trial Edition**.
4. You can skip the **Pricing** tab in testing mode.
5. Under the product’s **Integration** tab, create a new **Application**.
   - Configure Redirect URI: `http://localhost:8095/oauth-callback`
   - Configure Cancel URI: `http://localhost:8095/oauth-cancel`
   - Select the default license type
6. Save the generated **Application Code**.
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

## ▶️ Test the Integration — Authorization Code Flow (User Login)

1. Open the demo app and click **User Flow**.
1. Then click **Log in with Robb-e**.
1. You are redirected to the Robb-e platform login screen. Enter your email and verification code.
1. After login, confirm access for the product application.
1. The demo app exchanges the authorization code for tokens and displays the **Access Token** and **Refresh Token** payloads.
1. Click **Get User Details** to call a standard API endpoint with the `Authorization: Bearer <token>` header.
   The user details are displayed, demonstrating a simple token-based API request.

## ▶️ Test the Integration — M2M Flow (Client Credentials)

This part of the demo shows how a `Machine-to-Machine` application can authenticate using the OAuth2 Client Credentials Grant.

## 🔧 Create a Client for M2M Flow

The Application Owner must configure a Client on the Robb-e platform:

1. Log into the [Robb-e platform](https://www.robb-e.com)
2. In the left menu, go to **Portfolio** → **Products**, and select your Product.
3. Under the **Integration** tab, find **Add Client** button and click on it.
4. After creating, copy the generated:
   - `client_id`
   - `client_secret`
     > ⚠️ These credentials are sensitive — store them securely and never expose them in frontend code.

## ▶️ Run the M2M Demo

Start the demo app if not already running:

```bash
npm install
npm start
```

1. The app will be available at:
   👉 [http://localhost:8095](http://localhost:8095)
2. Choose **M2M Flow**
3. Fill in your **Client ID** and **Client Secret**, then click **`Authorize`**.
4. If valid, the Robb-e platform will issue:
   - An **`Access Token`**
   - A **`Refresh Token`**
   - Decoded payloads of tokens

5. You can now:
   - Click **Call Protected API** to simulate accessing a backend resource using the M2M token.
   - Click **Refresh Token** to renew the access token.
   - Click **Clear Tokens** to remove stored tokens and reset the UI.
