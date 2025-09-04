'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';

/** Read once from NEXT_PUBLIC_* */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  // measurementId optional
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const firebaseApp = app;

/** Auth singleton (client only) */
export const auth: Auth = getAuth(app);

/** Providers you'll use on Login/Signup */
export const googleProvider = new GoogleAuthProvider();
/** Apple uses generic OAuthProvider with 'apple.com' */
export const appleProvider = new OAuthProvider('apple.com');

/**
 * Helper: ensure we can fetch an ID token (used when calling your API)
 * Usage (client): const token = await getIdTokenSafe();
 */
export async function getIdTokenSafe(forceRefresh = false): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}