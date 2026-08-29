import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { loginWithEmail } from '../../src/services/authService';
import { colors, radius, spacing, typography } from '../../src/constants/theme';

/**
 * ONB-0 · REQ-15 (login + session persistence) — mirrors v1/00-auth-login.html.
 * TODO: route to (tabs) if the user already completed onboarding, or
 * (onboarding) otherwise — needs a getProfile() check, see app/_layout.tsx.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin() {
    try {
      await loginWithEmail(email, password);
      router.replace('/(onboarding)/personal-info');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: spacing[3] }}>
      <Text style={typography.h1}>เข้าสู่ระบบ</Text>
      <TextInput style={styles.input} placeholder="อีเมล" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="รหัสผ่าน" value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
      <Button label="เข้าสู่ระบบ" onPress={handleEmailLogin} />
      <Button label="ลืมรหัสผ่าน?" variant="ghost" onPress={() => router.push('/(auth)/forgot-password')} />
      {/* TODO: "เข้าสู่ระบบด้วย Google" / "ด้วย Apple" */}
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
