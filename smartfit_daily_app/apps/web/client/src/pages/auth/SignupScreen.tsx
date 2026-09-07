import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { signUpWithEmail, loginWithGoogle } from '../../services/authService';
import { colors, spacing, typography } from '../../constants/theme';
import { signupScreenStyles as styles } from './styles';

/**
 * ONB-0 · REQ-14 (sign-up: email/password, Google, Apple) — mirrors v1/00-auth-signup.html.
 * Creates a User Account, then always proceeds to ONB-1 (never skips ahead).
 */

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignupScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignup() {
    const isEmailValid = email.trim() !== '' && validEmail(email.trim());
    const isPasswordValid = password !== '';
    setEmailError(isEmailValid ? null : 'กรุณากรอกอีเมลให้ถูกต้อง');
    setPasswordError(isPasswordValid ? null : 'กรุณาตั้งรหัสผ่าน');
    if (!isEmailValid || !isPasswordValid) return;

    setError(null);
    try {
      await signUpWithEmail(email, password);
      navigate('/onboarding/personal-info', { replace: true });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleGoogleSignup() {
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/onboarding/personal-info', { replace: true });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer>
      <BackLink label="ย้อนกลับ" onPress={() => navigate('/welcome')} />

      <Text style={typography.h1}>สร้างบัญชีผู้ใช้</Text>
      <Text style={styles.subtitle}>สมัครสมาชิกก่อนเริ่มตั้งค่าโปรไฟล์ของคุณ</Text>

      <View style={styles.form}>
        <Input
          label="อีเมล"
          placeholder="name@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          error={emailError ?? undefined}
        />

        <View style={styles.passwordField}>
          <Input
            label="รหัสผ่าน"
            placeholder="ตั้งรหัสผ่าน"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            error={passwordError ?? undefined}
          />
          <Pressable
            style={styles.passwordToggle}
            onPress={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            <EyeIcon open={showPassword} />
          </Pressable>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Button label="สมัครสมาชิก" onPress={handleEmailSignup} />
      </View>

      <Divider label="หรือ" />

      <View style={{ gap: spacing[2] }}>
        <SocialButton label="สมัครด้วย Google" icon={<GoogleIcon />} onPress={handleGoogleSignup} />
      </View>

      <Text style={styles.footerNote}>
        มีบัญชีอยู่แล้ว?{' '}
        <Text style={styles.footerLink} onPress={() => navigate('/login')}>
          เข้าสู่ระบบ
        </Text>
      </Text>
    </ScreenContainer>
  );
}

function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.backLink} onPress={onPress}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.inkMuted} strokeWidth={1.5}>
        <path d="M15 5l-7 7 7 7" />
      </svg>
      <Text style={styles.backLinkText}>{label}</Text>
    </Pressable>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

function SocialButton({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable style={styles.socialButton} onPress={onPress}>
      {icon}
      <Text style={typography.body}>{label}</Text>
    </Pressable>
  );
}

function GoogleIcon() {
  return (
    <View style={styles.googleIcon}>
      <Text style={styles.googleIconLabel}>G</Text>
    </View>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.inkMuted} strokeWidth={1.5}>
        <path d="M3 3l18 18" />
        <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 6 10 6a15.6 15.6 0 0 1-3.3 3.9M6.5 6.6C4 8.3 2 11 2 11s3.5 6 10 6c1.3 0 2.5-.2 3.6-.6" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.inkMuted} strokeWidth={1.5}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
