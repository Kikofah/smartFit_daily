import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * ONB-0 / REQ-14-17. Sign-up/login/logout are direct Firebase Authentication
 * client SDK calls — no server route involved. Only forgot-password goes
 * through the Express API (see api.ts), since it needs to reject Google
 * accounts server-side.
 */

export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Same call for sign-up and login — Firebase creates the account on first use, signs in on repeats. */
export function loginWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function logout() {
  return signOut(auth);
}
