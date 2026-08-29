import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * ONB-3 · REQ-02 — mirrors v1/04-onboarding-goal-confirm.html.
 * Computes dailyCalorieTargetKcal = TDEE +/- fixed offset, applies the
 * safety floor (1,200-1,500 kcal), then completes onboarding.
 */
export default function GoalConfirmScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>ยืนยันเป้าหมาย</Text>
      {/* TODO: show computed dailyCalorieTargetKcal + safety floor notice if applied,
          then call updateGoal Cloud Function. */}
      <Button label="เริ่มใช้งาน" onPress={() => router.replace('/(tabs)')} />
    </ScreenContainer>
  );
}
