// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// FIX: Only initialize if the key exists (prevents build crash)
// FIX: Only initialize if the key exists (prevents build crash)
let firebaseApp: FirebaseApp | undefined;

try {
  firebaseApp =
    getApps().length === 0 && process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      ? initializeApp(firebaseConfig)
      : getApps()[0];
} catch (e) {
  console.warn("Firebase init failed (likely missing keys in build):", e);
}

export { firebaseApp };

// Export services safely
export const auth = firebaseApp ? getAuth(firebaseApp) : null;