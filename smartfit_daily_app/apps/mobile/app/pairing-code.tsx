import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Button } from '../src/components/Button';
import { redeemPairingCode } from '../src/services/api';
import { signInWithPairingToken } from '../src/services/authService';
import { colors, radius, spacing, typography } from '../src/constants/theme';

/**
 * Replaces this app's old email/password login (2026-08-29) — the web app
 * (already signed in) generates a short-lived 6-digit code from its
 * Profile screen; entering it here signs this device in via a Firebase
 * custom token, so no credential is ever typed on the device. See
 * apps/web/server/routes/pairing/index.ts for the exchange this calls.
 */
export default function PairingCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      const { customToken } = await redeemPairingCode(code);
      await signInWithPairingToken(customToken);
      router.replace('/device-pairing');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: spacing[3] }}>
      <Text style={typography.h1}>เชื่อมต่อกับบัญชีของคุณ</Text>
      <Text style={typography.bodySm}>
        ไปที่หน้าโปรไฟล์ในเว็บแอป smartFit_daily แล้วกด "จับคู่อุปกรณ์" เพื่อรับรหัส 6 หลัก
      </Text>
      <TextInput
        style={styles.input}
        placeholder="000000"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
      <Button label="เชื่อมต่อ" onPress={handleSubmit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.paperSunken,
    padding: spacing[3],
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 8,
    color: colors.ink,
  },
});
