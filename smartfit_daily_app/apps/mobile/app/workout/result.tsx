import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * REC-2 · REQ-05 — mirrors v1/07-workout-result.html.
 * MET is computed client-side, then completeWorkoutSession is called with
 * an optimistic UI update within 250ms (NFR-02) — no waiting on the round trip.
 */
export default function WorkoutResultScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>ผลการออกกำลังกาย</Text>
      {/* TODO: show calculatedKcal (from client-side MET calc), call completeWorkoutSession. */}
      <Button label="กลับหน้าหลัก" onPress={() => router.replace('/(tabs)')} />
    </ScreenContainer>
  );
}
