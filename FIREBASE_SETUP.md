# Firebase Integration & Setup Guide

This guide walks you through setting up a Firebase backend to enable production-grade database storage and secure admin logins for **The Living Book**.

If these variables are empty, the application automatically falls back to **Local Database Mode** (`local_db.json`), which works out-of-the-box for offline usage.

---

## Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** (or **Create a project**).
3. Enter a project name (e.g., `the-living-book`) and click **Continue**.
4. You can disable or enable Google Analytics for this project, then click **Continue** (or **Create project**).
5. Once ready, click **Continue** to enter the Project Dashboard.

---

## Step 2: Enable Email/Password Authentication
1. In the left-hand menu under **Build**, click **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, select **Email/Password** from the list of providers.
4. Toggle **Enable** (leave Passwordless sign-in disabled) and click **Save**.

---

## Step 3: Create a Cloud Firestore Database
1. In the left-hand menu under **Build**, click **Firestore Database**.
2. Click **Create Database**.
3. Select your Database Location (preferably close to your users) and click **Next**.
4. Choose **Start in production mode** (or test mode) and click **Create**.
5. Once created, go to the **Rules** tab, and ensure your rules permit admin operations, or set basic security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write access to all documents for authenticated admins
       match /{document=**} {
         allow read, write: if true; // Secure this in production based on auth
       }
     }
   }
   ```

---

## Step 4: Register a Web App (Get Client SDK Config)
1. Go to the project home page or click the **Gear Icon** (Project Settings) -> **General**.
2. Scroll down to the **Your apps** section and click the **Web Icon** (`</>`) to register a new Web App.
3. Enter an app nickname (e.g., `Living Book Web`) and click **Register app**.
4. Firebase will display an initialization code snippet. Copy the values inside the `firebaseConfig` object and paste them into your `.env.local` file:
   - `apiKey` ➔ `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` ➔ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` ➔ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (and `FIREBASE_PROJECT_ID` in the admin section)
   - `storageBucket` ➔ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` ➔ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` ➔ `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## Step 5: Generate a Service Account Private Key (Get Admin SDK Config)
1. Click the **Gear Icon** (Project Settings) and select **Service accounts**.
2. Click the **Generate new private key** button at the bottom of the page.
3. In the warning modal, click **Generate key**.
4. This downloads a `.json` credentials file to your computer. Open this file in a text editor (like Notepad or VS Code) to find the credentials:
   - Copy `project_id` and paste it as `FIREBASE_PROJECT_ID` in `.env.local`.
   - Copy `client_email` and paste it as `FIREBASE_CLIENT_EMAIL` in `.env.local`.
   - Copy the entire `private_key` string (including `"-----BEGIN PRIVATE KEY-----\n..."`) and paste it as `FIREBASE_PRIVATE_KEY` in `.env.local`.

---

## Step 6: Restart the Next.js Server
Once your `.env.local` file is populated with real credentials, save it, stop the running terminal, and run:
```bash
npm run build
npx next start -p 3005
```
The server will detect the environment variables, disable local database mode, and connect to your Cloud Firestore and Firebase Auth services.
