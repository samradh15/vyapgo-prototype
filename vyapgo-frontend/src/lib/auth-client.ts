'use client';

import { getApps, initializeApp } from 'firebase/app';
import { signInWithCustomToken } from 'firebase/auth';
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
  unlink,
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
 *  reCAPTCHA (multi-container) + OTP flows
 * ======================================================= */
const verifiers: Record<string, RecaptchaVerifier> = {};
let signInConfirmation: ConfirmationResult | null = null;   // phone SIGN-IN
let linkConfirmation: ConfirmationResult | null = null;      // phone LINKING

/**
 * Ensure a reCAPTCHA verifier exists for a DOM container id.
 * Set invisible=true for auth actions.
 */
export function ensureRecaptcha(containerId = 'recaptcha-container', invisible = true) {
  if (verifiers[containerId]) return verifiers[containerId];
  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: invisible ? 'invisible' : 'normal',
  });
  try {
    // Some environments require explicit render
    (verifiers[containerId] as any)?.render?.();
  } catch {}
  verifiers[containerId] = verifier;
  return verifier;
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
 *  Account Linking (Account page)
 * ======================================================= */

/** Current linked provider ids (e.g. ['google.com','phone']) */
export function getProviderIds(): string[] {
  return auth.currentUser?.providerData.map(p => p.providerId) ?? [];
}

/** Link Google to the currently signed-in user */
export async function linkGoogleToCurrent(): Promise<User> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const cred = await linkWithPopup(user, new GoogleAuthProvider());
  return cred.user;
}

/** Start linking a phone number (sends OTP) */
export async function startLinkPhone(
  e164Phone: string,
  containerId = 'recaptcha-link-anchor'
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const verifier = ensureRecaptcha(containerId, true);
  linkConfirmation = await linkWithPhoneNumber(user, e164Phone, verifier);
}

/** Verify the OTP and finish linking the phone number */
export async function verifyLinkPhone(code: string): Promise<User> {
  if (!linkConfirmation) throw new Error('No pending OTP verification');
  const cred = await linkConfirmation.confirm(code);
  linkConfirmation = null;
  return cred.user;
}

/** Safely unlink a provider (requires at least one other linked method) */
export async function unlinkProviderSafe(providerId: 'google.com' | 'apple.com' | 'phone') {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  if (user.providerData.length <= 1) {
    throw new Error('Add another sign-in method before unlinking this one');
  }
  await unlink(user, providerId);
}

export async function signInWithCustomJwt(token: string): Promise<{ user: any; isNewUser: boolean }> {
    const cred = await signInWithCustomToken(auth, token);
    const isNewUser =
      cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime;
    return { user: cred.user, isNewUser };
  }

  export async function signInWithCustomTokenClient(customToken: string) {
    const cred = await signInWithCustomToken(auth, customToken);
    const isNewUser =
      cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime;
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