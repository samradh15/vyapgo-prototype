'use server';

// Server-only module. Do NOT import in Client Components.
import { getApp, getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Accept either FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID
const projectId =
  process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    'Missing Firebase Admin envs: FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID), FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
  );
}

// Support both quoted and \n-escaped env styles
if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1);
}
privateKey = privateKey.replace(/\\n/g, '\n');

let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  adminApp = getApp();
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

/** Verify a Firebase ID token from Authorization: Bearer <token> */
export async function verifyIdToken(idToken: string) {
  return adminAuth.verifyIdToken(idToken);
}

/** Create a Firebase Custom Token for a given uid (used by server OTP verify) */
export async function createCustomToken(uid: string, claims?: Record<string, unknown>) {
  return adminAuth.createCustomToken(uid, claims);
}