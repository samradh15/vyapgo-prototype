// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Safely load env vars
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Only initialize if config is valid and running in browser or runtime environment
let firebaseApp: FirebaseApp;

if (
  typeof window !== "undefined" || // client-side
  (process.env.NODE_ENV === "development" && getApps().length === 0) // dev build
) {
  firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  // Safe fallback to prevent crashes during server build or static export
  firebaseApp = getApps().length ? getApp() : ({} as FirebaseApp);
}

export { firebaseApp };

// ✅ Auth initialization guarded — won’t break build if app isn’t real yet
export const auth =
  firebaseApp && (firebaseApp as any).name
    ? getAuth(firebaseApp)
    : ({} as ReturnType<typeof getAuth>);

if (auth && (auth as any).languageCode !== undefined) {
  auth.languageCode = "en";
}