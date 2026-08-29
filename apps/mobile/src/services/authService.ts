import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebase';

/**
 * ONB-0 / REQ-14-17. Per tech-stack.md §6.3.1, sign-up/login/logout are
 * direct Firebase Authentication client SDK calls — no Cloud Function
 * involved. Only forgot-password goes through a Cloud Function (see
 * apps/functions/src/account-session/forgotPassword.ts).
 */

export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function loginWithGoogle(idToken: string) {
  // TODO: wire up an Expo-compatible Google sign-in flow (e.g. expo-auth-session)
  // to obtain idToken before calling this.
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export function loginWithApple(idToken: string, rawNonce: string) {
  // TODO: wire up expo-apple-authentication to obtain idToken/rawNonce.
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken, rawNonce });
  return signInWithCredential(auth, credential);
}

export function logout() {
  return signOut(auth);
}

/** Calls the forgotPassword Cloud Function (REQ-16) rather than the client SDK directly,
 * because Google/Apple accounts must be rejected with a specific error. */
export function requestPasswordReset(email: string) {
  return httpsCallable(functions, 'forgotPassword')({ email });
}

export { sendPasswordResetEmail };
