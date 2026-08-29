import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * REC-1, REC-3 · REQ-04, REQ-06 — mirrors v1/06-workout-session.html.
 * Pushed from the "วันนี้" tab after startWorkoutSession.
 */
export default function WorkoutSessionScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>กำลังออกกำลังกาย</Text>
      {/* TODO: embedded video player + "เปลี่ยนวิดีโอ" (swapRecommendation) */}
      <Button label="จบเซสชัน" onPress={() => router.replace('/workout/result')} />
    </ScreenContainer>
  );
}
