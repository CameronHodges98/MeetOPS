# MeetOPS — Firebase Setup Guide

- Live Demo at https://meetops-661f5.web.app/
- Email: demo@demoaccount.com
- Password: Dem0@1234

## What you need

- Node.js installed (https://nodejs.org — LTS version)
- A Google account
- These files: `index.html`, `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`

---

## Step 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project**
3. Name it (e.g. `meetops-prod`)
4. Disable Google Analytics (not needed)
5. Click **Create project**

---

## Step 2 — Enable Authentication

1. In your Firebase project, click **Authentication** in the left sidebar
2. Click **Get started**
3. Under **Sign-in method**, click **Email/Password**
4. Enable it, click **Save**
5. Click the **Users** tab → **Add user**
6. Add an email + password for each manager/admin who needs access

---

## Step 3 — Enable Firestore

1. Click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your region (pick the closest to your location)
5. Click **Enable**

---

## Step 4 — Get Your Firebase Config Keys

1. In Firebase console, click the **gear icon** ⚙️ → **Project settings**
2. Scroll down to **Your apps**
3. Click the **</>** (Web) icon to add a web app
4. Name it `meetops`, click **Register app**
5. You'll see a config block like this:

```js
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "MeetOPS.firebaseapp.com",
    projectId: "MeetOPS",
    storageBucket: "MeetOPS.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123",
};
```

6. Open `index.html` in a text editor
7. Find the `FIREBASE_CONFIG` block (search for `YOUR_API_KEY`)
8. Replace each placeholder with your actual values

---

## Step 5 — Update .firebaserc

Open `.firebaserc` and replace `YOUR_PROJECT_ID` with your actual project ID
(e.g. `meetops-prod`).

---

## Step 6 — Install Firebase CLI & Deploy

Open a terminal in the folder containing these files and run:

```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Log in to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy the app
firebase deploy --only hosting
```

After deploying you'll see a URL like:

```
https://meetops-prod.web.app
```

That's your live app — share it with your managers.

---

## Step 7 — Add More Users

Any time you need to add a new manager:

1. Go to Firebase console → Authentication → Users → Add user
2. Give them their email + password
3. They log in at your app URL — the app matches their email first name to
   the SUPERVISOR field in the CSV to filter their view automatically

To grant **admin** access (full data view + upload/delete):

1. Go to Firebase console → Firestore Database
2. Create a document at `admins/{uid}` — the document can be empty; its
   existence is what grants admin rights
3. The UID is shown in Authentication → Users next to the user's email

---

## Updating the App

Any time you make changes to `index.html`, redeploy with:

```bash
firebase deploy --only hosting
```

---

## Data Structure in Firestore

All data is shared across all authenticated users. Role-based filtering
(managers see only their own team) happens in the browser.

```
performanceDays/
  2026-01-15  →  { date, filename, rows: [...] }
  2026-01-16  →  { date, filename, rows: [...] }

ctDays/
  2026-04-09  →  { date, filename }
    employees/
      John_Smith   →  { employee, records: [...] }
      Jane_Doe     →  { employee, records: [...] }

admins/
  {uid}  →  (document existence = admin role; content irrelevant)
```

Performance `rows` entries contain: `LOCATION`, `EMPLOYEE`, `SUPERVISOR`,
`JOB TITLE`, `PPH`, `GAP %`, `POINTS`, `TOTAL HOURS`, `DIRECT HOURS`,
`INDIRECT HOURS`, `ADMIN HOURS`, `GAP HOURS`, `PUNCH HOURS`, `DIRECT %`,
`INDIRECT %`, `ADMIN %`.

Cycle time `records` entries are stored compressed — keys `a` (action),
`s` (supervisor), `j` (job title), `t` (ISO timestamp).

---

## Free Tier Limits (Spark Plan)

| Resource          | Free limit  | Your usage (est.) |
| ----------------- | ----------- | ----------------- |
| Firestore storage | 1 GB        | ~50MB/month       |
| Reads/day         | 50,000      | ~5,000/day        |
| Writes/day        | 20,000      | ~500/day          |
| Hosting bandwidth | 10 GB/month | ~1 GB/month       |

You will stay well within free limits. Only upgrade if you scale to 50+ daily users.

---

## Troubleshooting

**"Missing or insufficient permissions"** — Firestore rules weren't deployed. Run:

```bash
firebase deploy --only firestore:rules
```

**Login says "user not found"** — Make sure you created the user in Firebase console → Authentication → Users.

**Blank screen after login** — Open browser console (F12) and check for errors. Usually means the Firebase config keys weren't replaced correctly in `index.html`.
