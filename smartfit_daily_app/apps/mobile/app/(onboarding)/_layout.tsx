import { Stack } from 'expo-router';

/** ONB-1 → ONB-2 → ONB-3, linear flow, progress dots per DESIGN.md §4.1. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
