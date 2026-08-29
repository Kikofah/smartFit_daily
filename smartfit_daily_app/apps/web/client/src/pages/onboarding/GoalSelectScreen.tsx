import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * ONB-3 · REQ-02 — mirrors v1/03-onboarding-goal-select.html.
 * goalType "lose_weight" requires a target weight on the next (confirm) screen.
 */
export default function GoalSelectScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>เป้าหมายหลัก</Text>
      {/* TODO: ลดน้ำหนัก / กระชับสัดส่วน / เพิ่มความอึด — single-select */}
      <Button label="ถัดไป" onPress={() => navigate('/onboarding/goal-confirm')} />
    </ScreenContainer>
  );
}
