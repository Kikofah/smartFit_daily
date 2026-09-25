import Constants from 'expo-constants';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Sourced from app.config.js's `extra.firebase` (itself read from `.env` /
// EAS secrets at config-load time — see app.config.js), not hard-coded here.
// Firebase project region is also still undecided — see tech-stack.md §7.3.
const firebaseConfig = (Constants.expoConfig?.extra?.firebase ?? {}) as {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

// Firestore/Cloud Functions are no longer accessed directly from this app —
// all data goes through the Express API at apps/web/server (see
// services/api.ts). Only Authentication is a direct client SDK relationship.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
