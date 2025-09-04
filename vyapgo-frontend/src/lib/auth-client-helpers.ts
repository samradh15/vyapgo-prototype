'use client';

import { getIdTokenSafe } from './firebase-client';

/** Call your API with ID token attached */
export async function authedFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = await getIdTokenSafe();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}