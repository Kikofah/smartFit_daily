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

// Firebase's own messages ("Firebase: Error (auth/invalid-credential).") are
// English and technical — map the codes a login can hit to Thai for the UI.
// Email enumeration protection makes wrong password and unknown email both
// arrive as auth/invalid-credential, so they share one message on purpose.
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/wrong-password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/user-not-found': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
  'auth/user-disabled': 'บัญชีนี้ถูกระงับการใช้งาน',
  'auth/too-many-requests': 'ลองเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
  'auth/network-request-failed': 'เชื่อมต่ออินเทอร์เน็ตไม่ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่',
  'auth/popup-closed-by-user': 'ปิดหน้าต่างเข้าสู่ระบบด้วย Google ก่อนเสร็จสิ้น กรุณาลองใหม่',
  'auth/cancelled-popup-request': 'ปิดหน้าต่างเข้าสู่ระบบด้วย Google ก่อนเสร็จสิ้น กรุณาลองใหม่',
  'auth/popup-blocked': 'เบราว์เซอร์บล็อกหน้าต่างเข้าสู่ระบบด้วย Google กรุณาอนุญาต pop-up แล้วลองใหม่',
};

export function loginErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  return (code && LOGIN_ERROR_MESSAGES[code]) ?? 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
}
