// Server-only module. Do NOT import in Client Components.
import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
let privateKey = process.env.FIREBASE_PRIVATE_KEY!;

// Support both quoted and unquoted env styles
if (privateKey?.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

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
  adminApp = getApps()[0]!;
}

export const adminAuth = getAuth(adminApp);

/** Verify a Firebase ID token from Authorization: Bearer <token> */
export async function verifyIdToken(idToken: string) {
  return adminAuth.verifyIdToken(idToken);
}