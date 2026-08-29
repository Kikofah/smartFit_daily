import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * ONB-2 · REQ-03 — mirrors v1/02-onboarding-equipment.html.
 * Multi-select; "none" is mutually exclusive with every other option.
 */
export default function EquipmentScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>อุปกรณ์ที่มี</Text>
      {/* TODO: multi-select chips — ไม่มีอุปกรณ์ / ดัมเบล / ยิมครบชุด */}
      <Button label="ถัดไป" onPress={() => router.push('/(onboarding)/goal-select')} />
    </ScreenContainer>
  );
}
