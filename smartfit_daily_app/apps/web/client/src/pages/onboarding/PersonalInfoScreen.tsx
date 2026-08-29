import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * ONB-1 · REQ-01 — mirrors v1/01-onboarding-personal-info.html.
 * Precondition: ONB-0 complete (real user account / signed in).
 * TDEE (Mifflin-St Jeor) is computed client-side (NFR-01/03) before calling
 * PUT /api/profile/personal-info.
 */
export default function PersonalInfoScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>ข้อมูลส่วนตัว</Text>
      {/* TODO: age / sex / weightKg / heightCm / activityLevel form, computing
          TDEE via the Mifflin-St Jeor formula client-side. */}
      <Button label="ถัดไป" onPress={() => navigate('/onboarding/equipment')} />
    </ScreenContainer>
  );
}
