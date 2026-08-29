import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/store/AuthContext';
import { logout } from '../../src/services/authService';
import { typography } from '../../src/constants/theme';

/**
 * "โปรไฟล์" tab — INT-2, INT-3, ONB-0 · REQ-12, REQ-13, REQ-17 —
 * mirrors v1/11-device-integrations.html (account section + logout button
 * added 2026-08-29 alongside ONB-0).
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/welcome');
  }

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>โปรไฟล์</Text>
      <Text style={typography.body}>{user?.email}</Text>
      {/* TODO: smart-scale / wearable connection cards -> push to /device-pairing */}
      <Button label="เชื่อมต่ออุปกรณ์" variant="secondary" onPress={() => router.push('/device-pairing')} />
      <Button label="ออกจากระบบ" variant="ghost" onPress={handleLogout} />
    </ScreenContainer>
  );
}
