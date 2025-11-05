'use client';

import { getApps, initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/* =========================
   Firebase Initialization
   ========================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
};

if (!getApps().length) initializeApp(firebaseConfig);

export const db = getFirestore();
const auth = getAuth();

/* =========================
   Types
   ========================= */
export type OnboardingAnswers = {
  shopName?: string;
  businessType?: string;
  locationCity?: string;
  sellingChannels?: string[];
  inventorySize?: string;
  primaryGoal?: string;
};

export type UserProfile = {
  onboardingCompleted: boolean;
  uid: string;

  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;

  storeName?: string;
  businessType?: string;
  categories?: string[];
  location?: string;
  teamSize?: number;
  goal?: string;
  logoUrl?: string;

  onboarding?: (OnboardingAnswers & { complete?: boolean }) | null;

  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
};

/* =========================
   Helpers
   ========================= */
const userRef = (uid: string) => doc(db, 'users', uid);

/** Create the user doc if missing (idempotent). */
export async function ensureUserDoc(uid: string, seed: Partial<UserProfile> = {}): Promise<void> {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  const u = auth.currentUser;
  await setDoc(
    ref,
    {
      uid,
      email: u?.email ?? null,
      phoneNumber: u?.phoneNumber ?? null,
      displayName: u?.displayName ?? null,
      onboarding: { complete: false },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...seed,
    },
    { merge: true }
  );
}

/** Minimal check used by the onboarding gate. */
export async function getOnboardingStatus(uid: string): Promise<{ complete: boolean }> {
  const snap = await getDoc(userRef(uid));
  const data = snap.data() as UserProfile | undefined;
  return { complete: !!data?.onboarding?.complete };
}

/**
 * Save onboarding answers (and optionally mark complete).
 * When completing, hydrate top-level fields only if currently empty (no overwrites).
 */
export async function saveOnboarding(
  uid: string,
  answers: OnboardingAnswers,
  opts: { complete?: boolean } = {}
): Promise<void> {
  const ref = userRef(uid);
  const snap = await getDoc(ref);

  // IMPORTANT: type this as Partial<UserProfile> (fixes your TS errors)
  const existing: Partial<UserProfile> =
    (snap.exists() ? (snap.data() as UserProfile) : {}) ?? {};

  const patch: Partial<UserProfile> = {
    onboarding: {
      ...(existing.onboarding || {}),
      ...answers,
      complete: opts.complete ?? existing.onboarding?.complete ?? false,
    },
    updatedAt: serverTimestamp(),
  };

  if (opts.complete) {
    if (!existing.storeName && answers.shopName) patch.storeName = answers.shopName;
    if (!existing.location && answers.locationCity) patch.location = answers.locationCity;
    if (!existing.businessType && answers.businessType) patch.businessType = answers.businessType;
    if (!existing.goal && answers.primaryGoal) patch.goal = answers.primaryGoal;
  }

  await setDoc(ref, patch, { merge: true });
}

/** Fetch full user profile (normalized). */
export async function fetchUserDoc(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userRef(uid));
  if (!snap.exists()) return null;
  const data = snap.data() as UserProfile;
  return {
    ...data,
    uid,
    categories: Array.isArray(data.categories) ? data.categories : [],
  };
}

/** Safe partial update for Account page edits. */
export async function updateUser(uid: string, partial: Partial<UserProfile>): Promise<void> {
  const allowed: (keyof UserProfile)[] = [
    'email',
    'phoneNumber',
    'displayName',
    'storeName',
    'businessType',
    'categories',
    'location',
    'teamSize',
    'goal',
    'logoUrl',
    'onboarding',
  ];

  const safe: Partial<UserProfile> = {};
  for (const k of allowed) {
    if (k in partial) (safe as any)[k] = (partial as any)[k];
  }
  (safe as any).updatedAt = serverTimestamp();

  await updateDoc(userRef(uid), safe as any);
}