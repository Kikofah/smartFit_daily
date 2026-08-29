import { Stack } from 'expo-router';
import { AuthProvider } from '../src/store/AuthContext';

/**
 * Root stack — trimmed 2026-08-29 to a companion app for INT-2/INT-3 only
 * (Bluetooth smart-scale + wearable HealthKit/Health Connect pairing).
 * Onboarding, the daily dashboard, planner, logging, and streak/forecast
 * all moved to the web-first Express app (apps/web) — see
 * docs/02-design/02-technical/tech-stack.md's 2026-08-29 architecture
 * change. This app now only needs auth (so the same account can be used to
 * pair a device) and the device-pairing screen itself.
 *
 * TODO: read useAuth() here and redirect (auth) -> device-pairing once
 * signed in, instead of relying on each auth screen's own navigate() call.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="device-pairing" />
      </Stack>
    </AuthProvider>
  );
}
