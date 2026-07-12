# The Living Book — A Cinematic Interactive Experience

"The Living Book" is a premium, film-like 3D interactive web application tailored for teachers. Built using **Next.js 14 App Router, React Three Fiber, GSAP, and Firebase**, it simulates a physical book in an orbital deep space landscape of softly floating stars and radial nebulae, transitioning into an editable digital reader.

---

## Features

1. **Phase 1 — Cinematic Intro:**
   - 3D book rendered procedurally in React Three Fiber with custom lighting and embossed text.
   - Parallax GPU-driven particle field (2,000–4,000 stars on desktop, 800 on mobile) drifting in orbit.
   - Additive-blended nebula dust gas clouds (Indigo and Violet).
   - GSAP timeline dollying the camera and spinning the book 360° with a sweeping key light, before pivoting the cover open like a real book.
   - Intelligent skip triggers and sessionStorage memory to skip the intro on repeated navigations.

2. **Phase 2 — Table of Contents:**
   - Open book spread UI sitting on top of the floating starfield background.
   - Left Page holds editable book settings (Title, Author, description, emblem).
   - Right Page houses chapter listings with interactive lift-glow animations, and click-triggered 3D page-flipping transitions.

3. **Phase 3 — Reading & Writing Pages:**
   - Premium Lora serif typography with a custom drop-cap on the first paragraph and styled blockquotes.
   - Inline **TipTap Rich Text Editor** allowing admins to modify pages directly on the paper surface.
   - Autosave with a 1.5-second debounce driving updates to the database, complete with status indicators ("Saving...", "Saved ✓").

4. **Phase 4 — Admin Dashboard:**
   - Dark, minimal dashboard summarizing total chapters, views, and word counts.
   - Chapter manager facilitating chapter creation, deletion, inline renaming, publish toggles, and drag-and-drop sorting.
   - General Settings panel updating the book title, author, description, 3D cover text, and accent color.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **3D Render:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** GreenSock Animation Platform (`gsap` with ScrollTrigger)
- **Database & Auth:** Firebase Firestore & Firebase Auth (verified via server-side session cookies)
- **Rich Text Editor:** `@tiptap/react` with Starter Kit extensions
- **Styling:** Tailwind CSS, Lucide React Icons

---

## Setup & Local Installation

### 1. Clone the project and install packages
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:

```ini
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_client_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK Configuration (Private Key)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
# Replace the escaped newlines in your private key with standard \n strings if pasting
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ..."

# Initial Admin Seeding Account
ADMIN_EMAIL=admin@livingbook.edu
ADMIN_PASSWORD=SelectAPowerfulPassword123
```

### 3. Run the Database Seed Script
Populate your database with the initial administrator account, default book settings, and three sample chapters:
```bash
npm run seed
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- Go to `/admin/login` to authenticate as the administrator using the seeded credentials.
- Go to `/admin` to access the dashboard.
- Return to `/` to view the 3D book and edit chapters inline.

---

## Vercel Deployment Instructions

1. Deploy the Next.js project to Vercel (either via Vercel CLI or by linking a GitHub repository).
2. Add all environment variables listed in `.env.local` to the Vercel project's **Environment Variables** panel in settings.
3. Ensure the Firebase private key is input as a single line with `\n` characters representing newlines. Vercel will parse it correctly.
4. Run deployment. The application requires zero build configurations!
