import { Text, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';
import { welcomeScreenStyles as styles } from './styles';

/**
 * ONB-0 · REQ-14, REQ-15 — mirrors v1/00-auth-welcome.html.
 * See docs/02-design/01-prototypes/user-journeys.md#onb-0.
 */
export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.caption}>smartfit daily</Text>
      </View>

      <View style={styles.middle}>
        <Text style={typography.display}>smartfit daily</Text>
        <Text style={styles.subtitle}>
          เพื่อนคู่ใจที่ช่วยสร้างวินัยออกกำลังกายรายวันแบบยั่งยืน — พอดีกับร่างกายและเวลาที่มีจริงของคุณ
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button label="สมัครสมาชิก" onPress={() => navigate('/signup')} />
        <Button label="มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" variant="ghost" onPress={() => navigate('/login')} />
      </View>
    </ScreenContainer>
  );
}
