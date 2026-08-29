import { Stack } from 'expo-router';
import { AuthProvider } from '../src/store/AuthContext';

/**
 * Root stack. Route groups below (auth)/(onboarding)/(tabs) map to the
 * three phases of docs/02-design/01-prototypes/user-journeys.md: ONB-0 →
 * ONB-1..3 → core loop tabs.
 *
 * TODO: read useAuth()/profile-completeness here and redirect between the
 * three groups accordingly (unauthenticated -> (auth), authenticated but no
 * profile yet -> (onboarding), profile complete -> (tabs)).
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout" />
        <Stack.Screen name="log-history" />
        <Stack.Screen name="device-pairing" />
      </Stack>
    </AuthProvider>
  );
}
