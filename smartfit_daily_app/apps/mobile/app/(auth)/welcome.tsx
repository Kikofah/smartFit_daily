import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * ONB-0 · REQ-14, REQ-15 — mirrors v1/00-auth-welcome.html.
 * See docs/02-design/01-prototypes/user-journeys.md#onb-0.
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>smartFit_daily</Text>
      <Button label="สมัครสมาชิก" onPress={() => router.push('/(auth)/signup')} />
      <Button label="มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" variant="ghost" onPress={() => router.push('/(auth)/login')} />
    </ScreenContainer>
  );
}
