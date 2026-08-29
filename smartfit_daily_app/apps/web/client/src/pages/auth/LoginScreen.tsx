import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { loginWithEmail } from '../../services/authService';
import { colors, radius, spacing, typography } from '../../constants/theme';

/**
 * ONB-0 · REQ-15 (login + session persistence) — mirrors v1/00-auth-login.html.
 * TODO: route to "/" if the user already completed onboarding, or
 * /onboarding/personal-info otherwise — needs a useProfile() check.
 */
export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin() {
    try {
      await loginWithEmail(email, password);
      navigate('/onboarding/personal-info', { replace: true });
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
      <Button label="ลืมรหัสผ่าน?" variant="ghost" onPress={() => navigate('/forgot-password')} />
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
