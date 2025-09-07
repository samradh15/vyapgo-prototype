'use client';

import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  type User,
} from 'firebase/auth';

/** ---- Init (safe if already initialized) ---- */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
};

if (!getApps().length) initializeApp(firebaseConfig);
export const auth = getAuth();

/** ---- Types ---- */
export type SignInResult = { user: User; isNewUser: boolean };

/** ---- Auth state helpers ---- */
export function onAuthStateChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
export async function signOutUser() {
  await signOut(auth);
}

/** ---- Phone OTP (invisible reCAPTCHA) ---- */
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export function ensureRecaptcha(containerId = 'recaptcha-container') {
  if (recaptchaVerifier) return recaptchaVerifier;
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  try {
    // in some environments this is needed to instantiate the widget
    (recaptchaVerifier as any).render?.();
  } catch {}
  return recaptchaVerifier;
}

export async function sendOtp(e164Phone: string) {
  if (!recaptchaVerifier) ensureRecaptcha();
  confirmationResult = await signInWithPhoneNumber(auth, e164Phone, recaptchaVerifier!);
  return true;
}

export async function verifyOtpDetailed(code: string): Promise<SignInResult> {
  if (!confirmationResult) throw new Error('OTP was not requested');
  const cred = await confirmationResult.confirm(code);
  const info = getAdditionalUserInfo(cred);
  const isNewUser =
    !!(info?.isNewUser ??
      (cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime));
  return { user: cred.user, isNewUser };
}

/** ---- Google / Apple ---- */
export async function signInWithGoogleDetailed(): Promise<SignInResult> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const info = getAdditionalUserInfo(cred);
  const isNewUser =
    !!(info?.isNewUser ??
      (cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime));
  return { user: cred.user, isNewUser };
}

export async function signInWithAppleDetailed(): Promise<SignInResult> {
  const provider = new OAuthProvider('apple.com');
  const cred = await signInWithPopup(auth, provider);
  const info = getAdditionalUserInfo(cred);
  const isNewUser =
    !!(info?.isNewUser ??
      (cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime));
  return { user: cred.user, isNewUser };
}

/** ---- Persistence (lighter in dev) ---- */
const devPersistence = process.env.NEXT_PUBLIC_AUTH_PERSISTENCE || 'session'; // 'session' | 'none' | 'local'
const choose = (mode: string) =>
  mode === 'none' ? inMemoryPersistence :
  mode === 'session' ? browserSessionPersistence :
  browserLocalPersistence;

setPersistence(
  auth,
  process.env.NODE_ENV === 'development'
    ? choose(devPersistence)
    : browserLocalPersistence
).catch(() => {
  // ignore hot-reload race
});