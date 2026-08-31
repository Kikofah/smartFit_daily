import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { loginWithEmail, loginWithGoogle, loginWithApple } from '../../services/authService';
import { api } from '../../services/api';
import { nextOnboardingStep } from '../../hooks/onboardingStep';
import { colors, spacing, typography } from '../../constants/theme';
import { loginScreenStyles as styles } from './styles';
import type { UserProfile } from '@smartfit/shared-types';

/** ONB-0 · REQ-15 (login + session persistence) — mirrors v1/00-auth-login.html. */
export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Routes to "/" if onboarding (ONB-1/2/3) is already done, or whichever
  // step is next otherwise — fetched fresh rather than via useProfile(),
  // since AuthContext's user state hasn't necessarily updated yet at the
  // moment right after a successful login call.
  async function routeAfterLogin() {
    const profile = await api.get<UserProfile>('/profile').catch(() => null);
    navigate(nextOnboardingStep(profile) ?? '/', { replace: true });
  }

  async function handleEmailLogin() {
    const isEmailValid = email.trim() !== '';
    const isPasswordValid = password !== '';
    setEmailError(isEmailValid ? null : 'กรุณากรอกอีเมล');
    setPasswordError(isPasswordValid ? null : 'กรุณากรอกรหัสผ่าน');
    if (!isEmailValid || !isPasswordValid) return;

    setError(null);
    try {
      await loginWithEmail(email, password);
      await routeAfterLogin();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    try {
      // TODO: replace with a real Google sign-in popup/redirect flow (e.g. Firebase
      // Auth's signInWithPopup(auth, new GoogleAuthProvider())) to obtain a real
      // idToken before calling loginWithGoogle.
      await loginWithGoogle('');
      await routeAfterLogin();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleAppleLogin() {
    setError(null);
    try {
      // TODO: replace with a real Sign in with Apple flow to obtain a real
      // idToken/rawNonce pair before calling loginWithApple.
      await loginWithApple('', '');
      await routeAfterLogin();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer>
      <BackLink label="ย้อนกลับ" onPress={() => navigate('/welcome')} />

      <Text style={typography.h1}>เข้าสู่ระบบ</Text>
      <Text style={styles.subtitle}>ยินดีต้อนรับกลับมา</Text>

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

        <View>
          <View style={styles.passwordField}>
            <Input
              label="รหัสผ่าน"
              placeholder="รหัสผ่านของคุณ"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
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
          <View style={styles.forgotLinkRow}>
            <Text style={styles.forgotLink} onPress={() => navigate('/forgot-password')}>
              ลืมรหัสผ่าน?
            </Text>
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Button label="เข้าสู่ระบบ" onPress={handleEmailLogin} />
      </View>

      <Divider label="หรือ" />

      <View style={{ gap: spacing[2] }}>
        <SocialButton label="เข้าสู่ระบบด้วย Google" icon={<GoogleIcon />} onPress={handleGoogleLogin} />
        <SocialButton label="เข้าสู่ระบบด้วย Apple" icon={<AppleIcon />} onPress={handleAppleLogin} />
      </View>

      <Text style={styles.footerNote}>
        ยังไม่มีบัญชี?{' '}
        <Text style={styles.footerLink} onPress={() => navigate('/signup')}>
          สมัครสมาชิก
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

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.5}>
      <path d="M16.5 8.5c-.9-1-2.1-1.6-3.4-1.6-1 0-1.7.3-2.4.3-.7 0-1.5-.3-2.4-.3-2.7 0-5.3 2.2-5.3 6 0 3.2 2.4 7.6 4.3 7.6.9 0 1.3-.6 2.4-.6s1.4.6 2.4.6c1.4 0 2.6-1.8 3.4-3.3-2.2-1-2.6-4.1-.5-5.4a4 4 0 0 0 1.5-3.3z" />
      <path d="M13.2 5.2c.5-.7.9-1.7.7-2.7-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.8 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
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
