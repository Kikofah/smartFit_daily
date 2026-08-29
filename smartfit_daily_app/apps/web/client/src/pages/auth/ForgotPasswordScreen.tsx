import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { requestPasswordReset } from '../../services/api';
import { colors, typography } from '../../constants/theme';
import { forgotPasswordScreenStyles as styles } from './styles';

/**
 * ONB-0 · REQ-16 — mirrors v1/00-auth-forgot-password.html.
 * Not available for accounts signed up via Google/Apple — enforced by the
 * Express /api/auth/forgot-password route, not client-side.
 */

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const isEmailValid = email.trim() !== '' && validEmail(email.trim());
    setEmailError(isEmailValid ? null : 'กรุณากรอกอีเมลให้ถูกต้อง');
    if (!isEmailValid) return;

    setError(null);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (sent) {
    return (
      <ScreenContainer>
        <View style={styles.statusPanel}>
          <View style={styles.statusIconWrap}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth={1.5}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </View>
          <Text style={typography.h3}>ตรวจสอบอีเมลของคุณ</Text>
          <Text style={styles.statusBody}>
            หากอีเมลนี้มีอยู่ในระบบและสมัครด้วยอีเมล/รหัสผ่าน เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว
          </Text>
          <Button label="กลับไปเข้าสู่ระบบ" variant="secondary" onPress={() => navigate('/login')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <BackLink label="ย้อนกลับ" onPress={() => navigate('/login')} />

      <Text style={typography.h1}>ลืมรหัสผ่าน?</Text>
      <Text style={styles.subtitle}>กรอกอีเมลที่ใช้สมัครสมาชิกไว้ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้</Text>

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

        {error && <Text style={styles.error}>{error}</Text>}

        <Button label="ส่งลิงก์รีเซ็ตรหัสผ่าน" onPress={handleSubmit} />
      </View>

      <View style={styles.infoNote}>
        <View style={styles.infoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.info} strokeWidth={1.5}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8v.01" />
          </svg>
        </View>
        <Text style={styles.infoText}>
          ใช้ได้เฉพาะบัญชีที่สมัครด้วยอีเมล/รหัสผ่าน — บัญชีที่เชื่อมกับ Google หรือ Apple ไม่มีรหัสผ่านให้รีเซ็ต
          เข้าสู่ระบบด้วยวิธีเดิมที่สมัครไว้ได้เลย
        </Text>
      </View>
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
