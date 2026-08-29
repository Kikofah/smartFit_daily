import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { signUpWithEmail } from '../../src/services/authService';
import { colors, radius, spacing, typography } from '../../src/constants/theme';

/**
 * ONB-0 · REQ-14 (sign-up: email/password, Google, Apple) — mirrors v1/00-auth-signup.html.
 * This companion app only needs an account to pair a device (INT-2/INT-3) —
 * ONB-1..3 onboarding happens on the web app (apps/web).
 */
export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignup() {
    try {
      await signUpWithEmail(email, password);
      router.replace('/device-pairing');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: spacing[3] }}>
      <Text style={typography.h1}>สมัครสมาชิก</Text>
      <TextInput style={styles.input} placeholder="อีเมล" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="รหัสผ่าน" value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
      <Button label="สมัครสมาชิก" onPress={handleEmailSignup} />
      {/* TODO: "สมัครด้วย Google" / "สมัครด้วย Apple" — expo-auth-session / expo-apple-authentication */}
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
    ...typography.body,
  },
});
