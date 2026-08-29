import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { requestPasswordReset } from '../../src/services/authService';
import { colors, radius, spacing, typography } from '../../src/constants/theme';

/**
 * ONB-0 · REQ-16 — mirrors v1/00-auth-forgot-password.html.
 * Not available for accounts signed up via Google/Apple — enforced by the
 * forgotPassword Cloud Function, not client-side.
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: spacing[3] }}>
      <Text style={typography.h1}>ลืมรหัสผ่าน</Text>
      <Text style={typography.bodySm}>ใช้ไม่ได้กับบัญชีที่สมัครผ่าน Google/Apple</Text>
      <TextInput style={styles.input} placeholder="อีเมล" value={email} onChangeText={setEmail} autoCapitalize="none" />
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
      {sent && <Text style={{ color: colors.success }}>ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว</Text>}
      <Button label="ส่งลิงก์รีเซ็ตรหัสผ่าน" onPress={handleSubmit} />
      <Button label="กลับไปเข้าสู่ระบบ" variant="ghost" onPress={() => router.back()} />
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
