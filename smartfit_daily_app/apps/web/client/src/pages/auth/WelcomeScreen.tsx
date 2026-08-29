import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * ONB-0 · REQ-14, REQ-15 — mirrors v1/00-auth-welcome.html.
 * See docs/02-design/01-prototypes/user-journeys.md#onb-0.
 */
export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>smartFit_daily</Text>
      <Button label="สมัครสมาชิก" onPress={() => navigate('/signup')} />
      <Button label="มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" variant="ghost" onPress={() => navigate('/login')} />
    </ScreenContainer>
  );
}
