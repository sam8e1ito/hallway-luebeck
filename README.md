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

## 📝 Useful Commands

| Command           | What It Does                                             |
| ----------------- | -------------------------------------------------------- |
| `npm ci`          | Install exact dependencies (use this, not `npm install`) |
| `npm run dev`     | Start dev server (http://localhost:5173)                 |
| `npm run build`   | Build for production                                     |
| `npm run preview` | Preview prod build locally                               |
| `npm run lint`    | Check code quality                                       |

---

## 📄 License

Free to use, modify, and deploy. No attribution required.

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Production-Ready ✅
