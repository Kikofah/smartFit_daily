import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * ONB-0 / REQ-14-17. Sign-up/login/logout are direct Firebase Authentication
 * client SDK calls — no server route involved. Only forgot-password goes
 * through the Express API (see api.ts's requestPasswordReset), since it
 * needs to reject Google/Apple accounts server-side.
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
