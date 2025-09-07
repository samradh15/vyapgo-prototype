'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/auth-client';
import { ensureUserDoc, fetchUserDoc, UserProfile } from '@/lib/firebase-db';

type Ctx = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  needsOnboarding: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthUserCtx = createContext<Ctx>({
  user: null,
  profile: null,
  loading: true,
  needsOnboarding: false,
  refreshProfile: async () => {},
});

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(u: User | null) {
    if (!u) {
      setProfile(null);
      return;
    }
    await ensureUserDoc(u.uid);
    const doc = await fetchUserDoc(u.uid);
    setProfile(doc);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      await loadProfile(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const needsOnboarding = !!(user && profile && profile.onboardingCompleted === false);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      needsOnboarding,
      refreshProfile: async () => loadProfile(user),
    }),
    [user, profile, loading, needsOnboarding]
  );

  return <AuthUserCtx.Provider value={value}>{children}</AuthUserCtx.Provider>;
}

export function useAuthUser() {
  return useContext(AuthUserCtx);
}