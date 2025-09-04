'use client';

import { getApps, initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  ConfirmationResult,
  type User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  connectAuthEmulator,
} from 'firebase/auth';
import { getAdditionalUserInfo } from 'firebase/auth';

/* ---------------------------------------
   Firebase init (idempotent & client-safe)
---------------------------------------- */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  // accept either SENDER_ID or MESSAGING_SENDER_ID
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    '',
};

function initApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

const app = initApp();
export const auth = getAuth(app);

// Optional: use emulator locally if you want (set env NEXT_PUBLIC_USE_AUTH_EMULATOR=1)
if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === '1'
) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  } catch {
    /* ignore duplicate emulator connections during HMR */
  }
}

// Device language for SMS/consent prompts
try {
  auth.useDeviceLanguage();
} catch { /* noop */ }

/* ---------------------------------------
   Persistence (configurable in dev)
---------------------------------------- */
const devPersistence = process.env.NEXT_PUBLIC_AUTH_PERSISTENCE || 'session'; // 'session' | 'none' | 'local'
const pickPersistence = (mode: string) =>
  mode === 'none'
    ? inMemoryPersistence
    : mode === 'session'
    ? browserSessionPersistence
    : browserLocalPersistence;

setPersistence(
  auth,
  process.env.NODE_ENV === 'development'
    ? pickPersistence(devPersistence)
    : browserLocalPersistence
).catch(() => {
  // ignore if already set during hot reload
});

/* ---------------------------------------
   Auth state helpers
---------------------------------------- */
export function onAuthStateChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
export async function signOutUser() {
  await signOut(auth);
}

/* ---------------------------------------
   reCAPTCHA + Phone OTP helpers
---------------------------------------- */
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

function ensureContainer(containerId: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!document.getElementById(containerId)) {
    const el = document.createElement('div');
    el.id = containerId;
    // keep it off-screen; invisible widget uses it just for anchor
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    el.style.top = '0';
    document.body.appendChild(el);
  }
}

export function ensureRecaptcha(containerId = 'recaptcha-container') {
  if (recaptchaVerifier) return recaptchaVerifier;
  ensureContainer(containerId);
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    'expired-callback': () => {
      // re-create on expiry
      recaptchaVerifier?.clear();
      recaptchaVerifier = null;
    },
  });
  return recaptchaVerifier;
}

export async function sendOtp(e164Phone: string) {
  if (!recaptchaVerifier) ensureRecaptcha();
  confirmationResult = await signInWithPhoneNumber(auth, e164Phone, recaptchaVerifier!);
  return true;
}

export async function verifyOtp(code: string) {
  if (!confirmationResult) throw new Error('OTP was not requested');
  const cred = await confirmationResult.confirm(code);
  // cleanup verifier after successful verification
  try {
    recaptchaVerifier?.clear();
  } catch { /* noop */ }
  recaptchaVerifier = null;
  confirmationResult = null;
  return cred.user;
}

/* ---------------------------------------
   Google & Apple SSO
---------------------------------------- */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function signInWithGoogleDetailed() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const info = getAdditionalUserInfo(cred);
    return { user: cred.user, isNewUser: !!info?.isNewUser };
  }
  
  export async function signInWithAppleDetailed() {
    const provider = new OAuthProvider('apple.com');
    const cred = await signInWithPopup(auth, provider);
    const info = getAdditionalUserInfo(cred);
    return { user: cred.user, isNewUser: !!info?.isNewUser };
  }
  
  // Uses your existing confirmationResult from sendOtp()
  export async function verifyOtpDetailed(code: string) {
    if (!confirmationResult) throw new Error('OTP was not requested');
    const cred = await confirmationResult.confirm(code);
    const info = getAdditionalUserInfo(cred);
    return { user: cred.user, isNewUser: !!info?.isNewUser };
  }

/* ---------------------------------------
   Useful re-exports
---------------------------------------- */
export type { User };