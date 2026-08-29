import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { useAuth } from '../store/AuthContext';
import { logout } from '../services/authService';
import { typography } from '../constants/theme';

/**
 * "โปรไฟล์" tab — ONB-0 · REQ-17 — mirrors v1/11-device-integrations.html
 * minus the device-pairing section (INT-2/INT-3 moved to the mobile
 * companion app on 2026-08-29 — Bluetooth/HealthKit/Health Connect have no
 * web equivalent).
 */
export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/welcome', { replace: true });
  }

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>โปรไฟล์</Text>
      <Text style={typography.body}>{user?.email}</Text>
      <Text style={typography.bodySm}>
        เชื่อมต่อตาชั่งอัจฉริยะ/wearable ได้จากแอปมือถือ smartFit_daily (Bluetooth/HealthKit ใช้บนเว็บไม่ได้)
      </Text>
      <Button label="ออกจากระบบ" variant="ghost" onPress={handleLogout} />
    </ScreenContainer>
  );
}
