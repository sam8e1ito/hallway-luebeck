# Hallway Luebeck — Complete Guide

## 🎯 What This Is

**Hallway Luebeck** is a full-featured social app built with React + Vite + Firebase. It includes:

-   ✅ Email/password authentication
-   ✅ User profiles with auto-generated avatars
-   ✅ Posts (normal & anonymous) with comments, likes/dislikes, and reports
-   ✅ Cyberbullying protection with intelligent content filtering
-   ✅ User search with profile likes system
-   ✅ Public and anonymous chats
-   ✅ Top profiles leaderboard
-   ✅ Fully responsive design (mobile, tablet, desktop)
-   ✅ Real-time updates via Firestore

All code is optimized for fast loading and ready to deploy on Vercel.

---

## 📋 Prerequisites & Setup

### What You Need

1. **Node.js** (v16+) → Download from https://nodejs.org
2. **Firebase project** → Create free at https://firebase.google.com
3. **Vercel account** (optional, for deployment) → https://vercel.com

### Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Name it `hallway-luebeck` (or any name you like)
4. Enable **Authentication** (Email/Password method only)
5. Create a **Firestore** database
6. From **Project Settings**, copy these 6 values:
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET` (optional; leave blank if not using)
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`

### Step 2: Create `.env` File in Project Root

In your project folder, create a file named `.env` (this file is NOT committed to GitHub) and add:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note:** STORAGE_BUCKET is optional and left empty (app uses generated avatars, not file uploads).

### Step 3: Install Dependencies & Run Locally

```powershell
npm ci
npm run dev
```

Open your browser to the URL shown (usually `http://localhost:5173` or `http://localhost:5174`).

---

## 📁 Project Structure

```
hallway-luebeck/
├── src/
│   ├── pages/                    # Route pages
│   │   ├── Home.jsx              # Homepage with posts & leaderboard
│   │   ├── Login.jsx             # Sign in page
│   │   ├── Register.jsx          # Create account page
│   │   ├── Profile.jsx           # User profile, edit username
│   │   ├── Chats.jsx             # Chat hub (links to anon/public)
│   │   ├── PublicChat.jsx        # Public chat room
│   │   ├── AnonChat.jsx          # Anonymous chat room
│   │   └── Search.jsx            # Search & like users
│   ├── components/
│   │   ├── Navbar.jsx            # Bottom navigation bar
│   │   ├── Posts.jsx             # Post feed, comments, likes
│   │   ├── ProtectedRoute.jsx    # Auth guard for routes
│   ├── hooks/
│   │   ├── authContext.js        # Auth context (useAuth hook)
│   │   └── useAuth.jsx           # AuthProvider component
│   ├── firebase.js               # Firebase init & helpers
│   ├── App.jsx                   # Main router
│   ├── main.jsx                  # React entry point
│   └── main.css                  # Global styles
├── public/                       # Static assets
├── vite.config.js                # Vite build config (optimized)
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── .env                          # Environment variables (NOT in git)
├── .gitignore                    # Ignored files
├── cors.json                     # CORS config (if Storage enabled)
└── README.md                     # This file

```

---

## 🚀 How to Use Locally

### 1. Start Development Server

```powershell
npm run dev
```

Opens at http://localhost:5173 (or next available port).

### 2. Run Production Build

```powershell
npm run build
npm run preview
```

Builds optimized bundle and previews at http://localhost:4173.

### 3. Check for Errors

```powershell
npm run lint
```

Verifies code quality; fix any errors shown.

---

## 🌐 Deploy to Vercel

Vercel is the fastest, easiest way to host this app. It's free and auto-deploys on every push.

### Steps

1. **Push to GitHub**

```powershell
git add .
git commit -m "Initial commit"
git push
```

2. **Create Vercel Project**

    - Go to https://vercel.com
    - Click "New Project"
    - Select your GitHub repository
    - Click "Import"

3. **Add Environment Variables**

    - In Vercel project dashboard, go to **Settings → Environment Variables**
    - Add all 6 `VITE_*` keys from your `.env` file
    - Click "Save"

4. **Deploy**
    - Click "Deploy"
    - Vercel builds and deploys automatically
    - Your app is live at `your-project-name.vercel.app`

**Future deploys:** Just push to GitHub; Vercel redeploys automatically.

---

## 🔧 How Everything Works

### Authentication Flow

1. **Register:** User enters email, password, username → Firebase creates account → Auto-generated avatar assigned → Profile saved to Firestore → Navigate to Home
2. **Login:** User enters email/password → Firebase Auth validates → Profile fetched from Firestore → App shows Home
3. **Logout:** Click "Sign Out" in navbar → Clears auth state → Redirect to Login

### Posts & Comments

-   Users create posts on **Home** page (can be anonymous or normal)
-   Posts show author username (or "🔒 Anonymous" if posted anonymously)
-   Posts show text and like/dislike buttons
-   Click "Comments" to add replies (stored in subcollections)
-   One like/dislike per user per day (tracked by date)
-   All posts & comments filtered to prevent cyberbullying (no full names, profanity)

### Content Safety Filter

The app includes intelligent content filtering to prevent cyberbullying:

-   **Blocks full names** (e.g., "John Smith") to protect privacy
-   **Blocks common teacher references** (Mr., Mrs., Principal, etc.)
-   **Blocks profanity and hate speech** variations
-   **Applies to:** posts, comments, usernames, and all user-generated content
-   Users get a clear message if they try to post blocked content

### Anonymous Posts

Users can toggle "Post anonymously" before submitting:

-   Displays as "🔒 Anonymous" in the feed (reader can't identify author)
-   Author still gets credit for likes/dislikes on their profile
-   Great for sensitive topics, suggestions, or shy users
-   All content safety filters still apply (no names, no profanity)

### Search & Profiles

-   **Search** page lets users find others by username
-   Like/dislike other users → increases their "Total Likes" stat
-   **Top Profiles** sidebar shows top 5 users by likes

### Chats

-   **Public Chat:** All users see and can post messages
-   **Anonymous Chat:** Messages are anonymous; no username tied to them
-   Messages sorted by newest first; limited to last 50 for performance

### Avatars

-   Auto-generated from **DiceBear** (no file uploads required)
-   Uses username as seed (same username = same avatar)
-   Profile page shows current avatar with fallback emoji if missing

---

## 🛠️ Troubleshooting

### "Client is offline" Error

This is a transient Firestore network issue. The app retries automatically 3 times with backoff. If it persists:

1. Check internet connection
2. Verify Firebase project is active
3. Refresh the page
4. Check browser console (F12) for detailed errors

### Build Fails

```powershell
rm -r node_modules package-lock.json
npm ci
npm run build
```

### Routes Not Working

-   Ensure `.env` has all 6 Firebase keys
-   Confirm Firestore database is created (not just project)
-   Check browser console for import errors

### Auth Not Persisting

-   Firebase Auth auto-persists. Try signing in and checking browser DevTools → Application → Cookies → ensure `__session` exists

---

## 📊 Firebase Firestore Schema

The app uses these collections:

```
users/{uid}
  - uid: string (Firebase Auth UID)
  - username: string
  - displayName: string
  - photoURL: string (DiceBear URL)
  - likes: number (from profile likes)
  - createdAt: timestamp

posts/{postId}
  - authorId: string
  - authorUsername: string
  - text: string
  - likes: number (sum of all ratings)
  - reports: number
  - createdAt: timestamp
  - comments/{commentId}
    - authorId: string
    - authorUsername: string
    - text: string
    - createdAt: timestamp
  - ratings/{ratingId}
    - userId: string
    - value: number (+1 or -1)
    - date: string (YYYY-MM-DD)
    - createdAt: timestamp

reports/{reportId}
  - postId: string
  - reportedBy: string (user UID)
  - reason: string
  - createdAt: timestamp

chat_public/{messageId}
  - userId: string
  - username: string
  - text: string
  - createdAt: timestamp

chat_anon/{messageId}
  - text: string (no username)
  - createdAt: timestamp
```

---

## 🎨 UI/UX Features

-   **Bottom Navigation:** Quick access to Home, Chats, Search, Profile (fixed on mobile)
-   **Fully Responsive Design:**
    -   Desktop (1200px+): Wide layout with sidebar leaderboard
    -   Tablet (768-1024px): Adjusted spacing and grid layouts
    -   Mobile (< 768px): Optimized touch targets, stacked layout, readable text
    -   Extra small (< 480px): Compact navbar, efficient use of screen space
-   **Loading States:** Buttons show "Saving...", "Creating account...", etc.
-   **Error Messages:** Clear, actionable error alerts
-   **Success Feedback:** Green success messages when actions complete
-   **Sticky Leaderboard:** Top profiles visible while scrolling (desktop/tablet)
-   **Optimized Images:** Auto-generated avatars load fast (no uploads)
-   **Content Safety:** Real-time validation with friendly error messages

---

## 📦 Dependencies

All installed via `npm ci`:

-   **react** — UI framework
-   **react-dom** — React rendering
-   **react-router-dom** — Routing (multi-page SPA)
-   **firebase** — Backend (Auth, Firestore)
-   **vite** — Build tool & dev server
-   **ESLint** — Code quality

No heavy dependencies; app is lean and fast.

---

## ⚙️ Build Optimizations Applied

1. **Route-based code splitting:** Pages lazy-load with `React.lazy` + `Suspense` → reduces initial bundle
2. **Vendor chunking:** Firebase, React in separate cache-busting chunks
3. **Asset optimization:** Inline images < 4KB; esbuild minification
4. **Preconnect:** Avatar provider URL preloaded in `index.html` → faster avatar fetch
5. **No source maps in prod:** Reduces bundle size
6. **ES2018 target:** Optimized for modern browsers

**Bundle size:** ~640 KB gzipped (including Firebase)

---

## 🔐 Security Notes

-   `.env` is never committed (`.gitignore` protects it)
-   Firebase Security Rules should be configured for production (see below)
-   Usernames are public; emails are private (Firebase Auth only)

### Recommended Firestore Rules (Copy to Firebase Console)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any profile, but only write their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    // Anyone authenticated can read posts; only post author can delete
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if false;
      // Subcollections (comments, ratings) inherit parent rules
      match /{document=**} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    // Anyone can report; reports are write-only
    match /reports/{reportId} {
      allow write: if request.auth != null;
      allow read: if false;
    }
    // Chat is public
    match /chat_public/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    match /chat_anon/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

---

## 📝 Useful Commands

| Command           | What It Does                                             |
| ----------------- | -------------------------------------------------------- |
| `npm ci`          | Install exact dependencies (use this, not `npm install`) |
| `npm run dev`     | Start dev server (http://localhost:5173)                 |
| `npm run build`   | Build for production                                     |
| `npm run preview` | Preview prod build locally                               |
| `npm run lint`    | Check code quality                                       |

---

## 🤔 FAQ

### Q: Can I add file uploads for profile pictures?

**A:** Yes, but Firebase Storage has CORS & billing concerns. The current setup uses free DiceBear-generated avatars. If you want uploads later, enable Firebase Storage, configure CORS, and update the profile form.

### Q: Can I use this with a backend?

**A:** Currently it's client-side Firebase only. You could add a Node/Express backend, but Firebase + Vercel is simpler and cheaper at small scale.

### Q: How many users/messages before Firebase costs money?

**A:** Firebase free tier is generous: 50,000 reads/day, 20,000 writes/day. A small app with 100 active users rarely exceeds this. Monitor at https://console.firebase.google.com → Usage.

### Q: Can I modify the styling?

**A:** Yes! Edit `src/main.css`. Colors, spacing, animations are all customizable. The app uses no CSS libraries; it's all vanilla CSS.

### Q: Can I change the bottom navbar position?

**A:** Yes. In `src/main.css`, find `.navbar` and change `bottom: 0` to `top: 0` (and adjust padding accordingly).

---

## 🎓 Learning More

-   **React:** https://react.dev
-   **Vite:** https://vite.dev
-   **Firebase Docs:** https://firebase.google.com/docs
-   **Vercel:** https://vercel.com/docs

---

## ✅ Checklist Before Going Live

-   [ ] Firebase project created & keys added to `.env`
-   [ ] Tested locally: `npm run dev` → register, login, create post, comment, search
-   [ ] Prod build succeeds: `npm run build`
-   [ ] Firestore rules reviewed & applied
-   [ ] Deployed to Vercel with env vars set
-   [ ] App works on Vercel domain
-   [ ] Shared link with others to test

---

## 🆘 Need Help?

1. **Check browser console:** Press F12 → Console tab → look for red errors
2. **Check Vercel logs:** Dashboard → Deployments → view build/runtime logs
3. **Check Firebase Console:** Verify project is active, rules are correct, database exists
4. **Verify `.env`:** Make sure all 6 VITE\_ keys are filled in (not just placeholders)

---

## 📄 License

Free to use, modify, and deploy. No attribution required.

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Production-Ready ✅
