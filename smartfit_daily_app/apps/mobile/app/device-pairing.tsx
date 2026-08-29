import { Text } from 'react-native';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Button } from '../src/components/Button';
import { typography } from '../src/constants/theme';

/**
 * INT-2, INT-3 · REQ-12, REQ-13 — mirrors v1/12-device-pairing.html.
 * Pushed from the "โปรไฟล์" tab. Must show a consent prompt before
 * connecting (NFR-05) — no auto-connect.
 */
export default function DevicePairingScreen() {
  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>เชื่อมต่ออุปกรณ์</Text>
      {/* TODO: Bluetooth scan (react-native-ble-plx) for smart scale;
          HealthKit/Health Connect permission flow for wearable. */}
      <Button label="เชื่อมต่อตาชั่งอัจฉริยะ" onPress={() => {}} />
      <Button label="เชื่อมต่อ Wearable" variant="secondary" onPress={() => {}} />
    </ScreenContainer>
  );
}
