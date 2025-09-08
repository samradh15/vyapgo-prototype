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
  linkWithPhoneNumber,
  ConfirmationResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  linkWithPopup,
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

/** =========================================================
 *  reCAPTCHA (per-container) + OTP flows
 * ======================================================= */
const verifiers: Record<string, RecaptchaVerifier> = {};
let signInConfirmation: ConfirmationResult | null = null;
let linkConfirmation: ConfirmationResult | null = null;

/**
 * Ensure an (optionally invisible) reCAPTCHA verifier exists for a container.
 * - containerId should match a DOM element id.
 * - invisible=true is best for auth actions.
 */
export function ensureRecaptcha(containerId = 'recaptcha-container', invisible = true) {
  if (verifiers[containerId]) return verifiers[containerId];
  const v = new RecaptchaVerifier(auth, containerId, {
    size: invisible ? 'invisible' : 'normal',
  });
  try {
    // Some environments require an explicit render to instantiate the widget
    (v as any).render?.();
  } catch {}
  verifiers[containerId] = v;
  return v;
}

/** ---- Phone OTP: SIGN-IN (login page) ---- */
export async function sendOtp(e164Phone: string, containerId = 'recaptcha-container') {
  const verifier = ensureRecaptcha(containerId, true);
  signInConfirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
  return true;
}

export async function verifyOtpDetailed(code: string): Promise<SignInResult> {
  if (!signInConfirmation) throw new Error('OTP was not requested');
  const cred = await signInConfirmation.confirm(code);
  signInConfirmation = null;

  const info = getAdditionalUserInfo(cred);
  const isNewUser =
    !!(info?.isNewUser ??
      (cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime));
  return { user: cred.user, isNewUser };
}

/** ---- Google / Apple (SIGN-IN) ---- */
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

/** =========================================================
 *  Account Linking (from Account page)
 * ======================================================= */

/** Link Google to the currently signed-in user */
export async function linkGoogle(): Promise<{ ok: true } | { ok: false; message: string }> {
  const user = auth.currentUser;
  if (!user) return { ok: false, message: 'Not signed in' };
  try {
    await linkWithPopup(user, new GoogleAuthProvider());
    return { ok: true };
  } catch (e: any) {
    const msg =
      e?.code === 'auth/credential-already-in-use'
        ? 'This Google account is already linked to another user.'
        : e?.message || 'Google linking failed';
    return { ok: false, message: msg };
  }
}

/** Start linking a phone number (sends OTP) */
export async function startLinkPhone(
  e164Phone: string,
  containerId = 'recaptcha-link'
): Promise<{ ok: true } | { ok: false; message: string }> {
  const user = auth.currentUser;
  if (!user) return { ok: false, message: 'Not signed in' };
  try {
    const verifier = ensureRecaptcha(containerId, true);
    linkConfirmation = await linkWithPhoneNumber(user, e164Phone, verifier);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'Failed to send OTP for linking' };
  }
}

/** Verify the OTP and finish linking the phone number */
export async function verifyLinkPhone(
  code: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!linkConfirmation) return { ok: false, message: 'No pending OTP verification' };
  try {
    await linkConfirmation.confirm(code);
    linkConfirmation = null;
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'Invalid OTP' };
  }
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