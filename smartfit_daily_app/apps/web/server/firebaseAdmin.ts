import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// On real GCP hosting (Cloud Run, Cloud Functions, etc.) initializeApp() with
// no args auto-discovers both the project and credentials from the ambient
// environment — no config needed there. Locally, there's no such ambient
// environment, so this needs either GOOGLE_APPLICATION_CREDENTIALS pointing
// at a downloaded service account key, or `gcloud auth application-default
// login` — see README.md's "Local Admin SDK credentials" section.
if (getApps().length === 0) {
  initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
}

export const db = getFirestore();
export const auth = getAuth();
