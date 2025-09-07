'use client';

import { getApps, initializeApp, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateUser } from './firebase-db';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadUserLogo(uid: string, file: File) {
  const path = `logos/${uid}/${Date.now()}_${file.name}`;
  const r = ref(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  await updateUser(uid, { logoUrl: url });
  return url;
}