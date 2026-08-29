import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Button } from '../src/components/Button';
import { logout } from '../src/services/authService';
import { typography } from '../src/constants/theme';

/**
 * INT-2, INT-3 · REQ-12, REQ-13 — mirrors v1/12-device-pairing.html.
 * This companion app's main screen (see app/_layout.tsx — trimmed
 * 2026-08-29 when the rest of the product moved to apps/web). Must show a
 * consent prompt before connecting (NFR-05) — no auto-connect.
 */
export default function DevicePairingScreen() {
  const router = useRouter();

  async function handleSignOut() {
    await logout();
    router.replace('/pairing-code');
  }

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>เชื่อมต่ออุปกรณ์</Text>
      {/* TODO: Bluetooth scan (react-native-ble-plx) for smart scale, then
          api.post('/integrations/smart-scale/connect') + .../sync;
          HealthKit/Health Connect permission flow for wearable, then
          api.post('/integrations/wearable/connect') + .../readings — see
          apps/web/server/routes/integration-gateway/index.ts for the
          route contracts this now calls instead of Cloud Functions. */}
      <Button label="เชื่อมต่อตาชั่งอัจฉริยะ" onPress={() => {}} />
      <Button label="เชื่อมต่อ Wearable" variant="secondary" onPress={() => {}} />
      <Button label="ออกจากระบบ" variant="ghost" onPress={handleSignOut} />
    </ScreenContainer>
  );
}
