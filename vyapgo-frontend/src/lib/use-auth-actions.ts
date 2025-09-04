'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  auth,
  googleProvider,
  appleProvider,
  getIdTokenSafe,
} from '@/lib/firebase-client';
import {
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';

/** Where to go after a successful login/signup */
const DEFAULT_REDIRECT = '/onboarding'; // change to '/dashboard' if you prefer

export function useAuthActions(redirectTo: string = DEFAULT_REDIRECT) {
  const router = useRouter();

  const [loading, setLoading] = useState<null | 'google' | 'apple' | 'phone' | 'verify'>(null);
  const [error, setError] = useState<string | null>(null);

  // phone flow
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  /** Create (once) an invisible reCAPTCHA verifier bound to the page */
  const ensureRecaptcha = useCallback(() => {
    if (recaptchaRef.current) return recaptchaRef.current;
    // element with id="recaptcha-container" must exist in the page
    recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
    });
    return recaptchaRef.current;
  }, []);

  const finalizeLogin = useCallback(async () => {
    // Optional: call your API to set a session cookie; for now we just route
    const token = await getIdTokenSafe(true);
    if (!token) {
      setError('Could not retrieve ID token after sign-in.');
      return;
    }
    router.replace(redirectTo);
  }, [redirectTo, router]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading('google');
    try {
      await signInWithPopup(auth, googleProvider);
      await finalizeLogin();
    } catch (e: any) {
      setError(e?.message || 'Google sign-in failed.');
    } finally {
      setLoading(null);
    }
  }, [finalizeLogin]);

  const loginWithApple = useCallback(async () => {
    setError(null);
    setLoading('apple');
    try {
      await signInWithPopup(auth, appleProvider);
      await finalizeLogin();
    } catch (e: any) {
      setError(e?.message || 'Apple sign-in failed.');
    } finally {
      setLoading(null);
    }
  }, [finalizeLogin]);

  const startPhoneLogin = useCallback(async (e164Phone: string) => {
    setError(null);
    setLoading('phone');
    try {
      if (!/^\+?[1-9]\d{6,14}$/.test(e164Phone)) {
        throw new Error('Enter a valid phone number with country code (e.g., +91XXXXXXXXXX).');
      }
      const verifier = ensureRecaptcha();
      confirmationResultRef.current = await signInWithPhoneNumber(auth, e164Phone, verifier);
      return true;
    } catch (e: any) {
      setError(e?.message || 'Could not start phone login.');
      return false;
    } finally {
      setLoading(null);
    }
  }, [ensureRecaptcha]);

  const verifyPhoneOtp = useCallback(async (code: string) => {
    setError(null);
    setLoading('verify');
    try {
      const cr = confirmationResultRef.current;
      if (!cr) throw new Error('No OTP session found. Please retry phone login.');
      await cr.confirm(code);
      await finalizeLogin();
      return true;
    } catch (e: any) {
      setError(e?.message || 'Invalid OTP. Please try again.');
      return false;
    } finally {
      setLoading(null);
    }
  }, [finalizeLogin]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (e: any) {
      setError(e?.message || 'Logout failed.');
    }
  }, [router]);

  return {
    loading,
    error,
    setError,
    loginWithGoogle,
    loginWithApple,
    startPhoneLogin,
    verifyPhoneOtp,
    logout,
  };
}