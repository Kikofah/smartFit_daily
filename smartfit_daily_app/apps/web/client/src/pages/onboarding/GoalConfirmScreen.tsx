import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * ONB-3 · REQ-02 — mirrors v1/04-onboarding-goal-confirm.html.
 * Computes dailyCalorieTargetKcal = TDEE +/- fixed offset, applies the
 * safety floor (1,200-1,500 kcal), then completes onboarding.
 */
export default function GoalConfirmScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>ยืนยันเป้าหมาย</Text>
      {/* TODO: show computed dailyCalorieTargetKcal + safety floor notice if applied,
          then call PUT /api/profile/goal. */}
      <Button label="เริ่มใช้งาน" onPress={() => navigate('/', { replace: true })} />
    </ScreenContainer>
  );
}
