import { useState } from 'react';
import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { useAuth } from '../store/AuthContext';
import { logout } from '../services/authService';
import { api } from '../services/api';
import { colors, typography } from '../constants/theme';

/**
 * "โปรไฟล์" tab — ONB-0 · REQ-17 — mirrors v1/11-device-integrations.html
 * minus the device-pairing UI itself (INT-2/INT-3 moved to the mobile
 * companion app on 2026-08-29 — Bluetooth/HealthKit/Health Connect have no
 * web equivalent). Instead, this screen generates the pairing code that
 * app lets the user redeem — see apps/web/server/routes/pairing/index.ts.
 */
export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    await logout();
    navigate('/welcome', { replace: true });
  }

  async function handleGenerateCode() {
    try {
      const { code } = await api.post<{ code: string }>('/pairing/create-code');
      setPairingCode(code);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>โปรไฟล์</Text>
      <Text style={typography.body}>{user?.email}</Text>

      <Text style={typography.bodySm}>
        เชื่อมต่อตาชั่งอัจฉริยะ/wearable ได้จากแอปมือถือ smartFit_daily (Bluetooth/HealthKit ใช้บนเว็บไม่ได้)
      </Text>
      {pairingCode ? (
        <Text style={{ ...typography.display, textAlign: 'center', letterSpacing: 8 }}>{pairingCode}</Text>
      ) : (
        <Button label="จับคู่อุปกรณ์" variant="secondary" onPress={handleGenerateCode} />
      )}
      {pairingCode && (
        <Text style={typography.caption}>กรอกรหัสนี้ในแอปมือถือภายใน 5 นาที</Text>
      )}
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}

      <Button label="ออกจากระบบ" variant="ghost" onPress={handleLogout} />
    </ScreenContainer>
  );
}
