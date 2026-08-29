import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * ONB-2 · REQ-03 — mirrors v1/02-onboarding-equipment.html.
 * Multi-select; "none" is mutually exclusive with every other option.
 */
export default function EquipmentScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>อุปกรณ์ที่มี</Text>
      {/* TODO: multi-select chips — ไม่มีอุปกรณ์ / ดัมเบล / ยิมครบชุด */}
      <Button label="ถัดไป" onPress={() => navigate('/onboarding/goal-select')} />
    </ScreenContainer>
  );
}
