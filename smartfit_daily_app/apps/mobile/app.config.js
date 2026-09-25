// Dynamic layer on top of app.json (Expo merges the two — see
// https://docs.expo.dev/workflow/configuration/#dynamic-configuration).
// app.json stays the static structural config (name, plugins, permissions);
// this file adds `extra.firebase`, read at runtime via expo-constants
// (see src/services/firebase.ts) instead of the old `process.env.EXPO_PUBLIC_FIREBASE_*`
// inlining. Values still come from `.env` (gitignored) / EAS secrets, not
// hard-coded here, so nothing sensitive lands in this committed file.
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
  },
});
