import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    increment,
} from "firebase/firestore";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

// Configure these environment variables in your Vercel / .env.local
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth helpers
export async function signUpWithEmail(email, password) {
    const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    return userCred;
}

export async function signInWithEmail(email, password) {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred;
}

export function signOutUser() {
    return signOut(auth);
}

// Firestore helpers
export async function createUserProfile(
    uid,
    { username, displayName, photoURL }
) {
    const docRef = doc(db, "users", uid);
    const data = {
        uid,
        username: username || null,
        displayName: displayName || null,
        photoURL: photoURL || null,
        likes: 0,
        createdAt: serverTimestamp(),
    };
    await setDoc(docRef, data, { merge: true });
    console.log("Profile saved:", data);
}

export async function getUserProfile(uid) {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
}

// Storage helpers
export async function uploadProfileImage(uid, file) {
    const ref = storageRef(storage, `profileImages/${uid}/${file.name}`);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
    return url;
}

// Posts / comments helpers (examples — expand as you build UIs)
export async function createPost({ authorId, text, metadata = {} }) {
    const col = collection(db, "posts");
    const docRef = await addDoc(col, {
        authorId,
        text,
        metadata,
        createdAt: serverTimestamp(),
        likes: 0,
        reports: 0,
    });
    return docRef.id;
}

// Comments
export async function addComment({ postId, authorId, text }) {
    const commentsCol = collection(db, "posts", postId, "comments");
    // store authorUsername if provided in the payload for easier rendering
    const payload = {
        authorId,
        text,
        createdAt: serverTimestamp(),
    };
    if (arguments[0] && arguments[0].authorUsername) {
        payload.authorUsername = arguments[0].authorUsername;
    }
    const docRef = await addDoc(commentsCol, payload);
    return docRef.id;
}

// Reports
export async function reportPost({ postId, reportedBy, reason }) {
    const reportsCol = collection(db, "reports");
    await addDoc(reportsCol, {
        postId,
        reportedBy,
        reason,
        createdAt: serverTimestamp(),
    });
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { reports: increment(1) });
}

// Daily rating (one per user per day)
export async function ratePost({ postId, userId, value }) {
    // Check if user already rated today
    const today = new Date().toISOString().split("T")[0];
    const q = query(
        collection(db, "posts", postId, "ratings"),
        where("userId", "==", userId),
        where("date", "==", today)
    );
    const snap = await getDocs(q);
    if (snap.size > 0) {
        return { success: false, message: "Already rated today" };
    }
    // Add rating
    const ratingsCol = collection(db, "posts", postId, "ratings");
    await addDoc(ratingsCol, {
        userId,
        value,
        date: today,
        createdAt: serverTimestamp(),
    });
    // Update post likes
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { likes: increment(value) });
    return { success: true };
}

export default app;
