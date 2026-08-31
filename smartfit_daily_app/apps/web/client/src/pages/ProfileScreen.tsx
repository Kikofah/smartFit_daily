import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { IconProfile } from '../components/Icon';
import { useAuth } from '../store/AuthContext';
import { logout } from '../services/authService';
import { api } from '../services/api';
import { colors, spacing, typography } from '../constants/theme';
import { profileScreenStyles as styles } from './styles';

/**
 * "โปรไฟล์" tab — ONB-0 · REQ-17 — mirrors v1/11-device-integrations.html
 * minus the device-pairing UI itself (INT-2/INT-3 moved to the mobile
 * companion app on 2026-08-29 — Bluetooth/HealthKit/Health Connect have no
 * web equivalent). Instead, this screen generates the pairing code that
 * app lets the user redeem — see apps/web/server/routes/pairing/index.ts.
 */

const METHOD_LABELS: Record<string, string> = {
  password: 'เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน',
  'google.com': 'เข้าสู่ระบบด้วย Google',
  'apple.com': 'เข้าสู่ระบบด้วย Apple',
};

function ChevronIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.inkFaint} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function LinkRow({ label, onPress, showTopBorder }: { label: string; onPress: () => void; showTopBorder?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.linkRow, showTopBorder && styles.linkRowBorder]}>
      <Text style={typography.body}>{label}</Text>
      <ChevronIcon />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [weightKgInput, setWeightKgInput] = useState('');
  const [manualEntryError, setManualEntryError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedMessage, setSyncedMessage] = useState<string | null>(null);

  const providerId = user?.providerData?.[0]?.providerId;
  const methodLabel = (providerId && METHOD_LABELS[providerId]) || 'เข้าสู่ระบบอยู่';

  async function handleLogout() {
    await logout();
    navigate('/welcome', { replace: true });
  }

  async function handleGenerateCode() {
    try {
      const { code } = await api.post<{ code: string }>('/pairing/create-code');
      setPairingCode(code);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleManualWeightSync() {
    const weightKg = Number(weightKgInput);
    if (!weightKgInput || Number.isNaN(weightKg) || weightKg <= 0) {
      setManualEntryError('กรุณากรอกน้ำหนักเป็นตัวเลขที่มากกว่า 0');
      return;
    }

    setIsSyncing(true);
    setManualEntryError(null);
    try {
      // Same endpoint a real smart-scale sync would call — only `source` differs (REQ-12).
      await api.post('/integrations/smart-scale/sync', { weightKg, source: 'manual' });
      setSyncedMessage(`บันทึกน้ำหนัก ${weightKg} กก. แล้ว`);
      setShowManualEntry(false);
      setWeightKgInput('');
    } catch (e) {
      setManualEntryError((e as Error).message);
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 32 }}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <IconProfile size={28} color={colors.inkFaint} />
        </View>
        <Text style={typography.h1}>โปรไฟล์</Text>
      </View>

      <View>
        <Text style={[typography.h2, styles.sectionTitle]}>บัญชีผู้ใช้</Text>
        <Card>
          <Text style={typography.h3}>{user?.email ?? 'ผู้ใช้งาน'}</Text>
          <Text style={[typography.bodySm, styles.accountMethod]}>{methodLabel}</Text>
        </Card>
        <View style={styles.logoutButton}>
          <Button label="ออกจากระบบ" variant="destructive" onPress={handleLogout} />
        </View>
      </View>

      <View>
        <Text style={[typography.h2, styles.sectionTitle]}>อุปกรณ์ที่เชื่อมต่อ</Text>
        <Card style={styles.pairingCard}>
          <Text style={typography.bodySm}>
            เชื่อมต่อตาชั่งอัจฉริยะ/wearable ได้จากแอปมือถือ smartFit_daily (Bluetooth/HealthKit ใช้บนเว็บไม่ได้)
          </Text>
          {pairingCode ? (
            <>
              <Text style={[typography.display, styles.pairingCode]}>{pairingCode}</Text>
              <Text style={[typography.caption, styles.center]}>กรอกรหัสนี้ในแอปมือถือภายใน 5 นาที</Text>
            </>
          ) : (
            <Button label="จับคู่อุปกรณ์" variant="secondary" onPress={handleGenerateCode} />
          )}
          {error && <Text style={[typography.bodySm, { color: colors.danger }]}>{error}</Text>}
        </Card>
        {!showManualEntry ? (
          <Pressable
            onPress={() => {
              setSyncedMessage(null);
              setShowManualEntry(true);
            }}
          >
            <Text style={[typography.caption, styles.deviceNote, { textDecorationLine: 'underline' }]}>
              ไม่เชื่อมต่อก็ใช้แอปได้ปกติ — กรอกน้ำหนักเองได้เสมอ และแคลอรี่เผาผลาญยังคำนวณจากสูตร MET ได้
            </Text>
          </Pressable>
        ) : (
          <Card style={{ marginTop: spacing[3], gap: spacing[3] }}>
            <Input
              label="น้ำหนักปัจจุบัน (กก.)"
              value={weightKgInput}
              onChangeText={setWeightKgInput}
              keyboardType="decimal-pad"
              placeholder="เช่น 65.5"
              error={manualEntryError ?? undefined}
            />
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              <View style={{ flex: 1 }}>
                <Button
                  label={isSyncing ? 'กำลังบันทึก...' : 'บันทึกน้ำหนัก'}
                  onPress={handleManualWeightSync}
                  disabled={isSyncing}
                />
              </View>
              <Button label="ยกเลิก" variant="ghost" onPress={() => setShowManualEntry(false)} />
            </View>
          </Card>
        )}
        {syncedMessage && (
          <Text style={[typography.bodySm, { color: colors.success, marginTop: spacing[2] }]}>{syncedMessage}</Text>
        )}
      </View>

      <View>
        <Text style={[typography.h2, styles.sectionTitle]}>การตั้งค่า</Text>
        <Card style={styles.linksCard}>
          <LinkRow label="แก้ไขอุปกรณ์ที่มี" onPress={() => navigate('/onboarding/equipment')} />
          <LinkRow label="แก้ไขข้อมูลส่วนตัว" onPress={() => navigate('/onboarding/personal-info')} showTopBorder />
          <LinkRow label="แก้ไขเป้าหมายหลัก / น้ำหนักเป้าหมาย" onPress={() => navigate('/onboarding/goal-select')} showTopBorder />
        </Card>
      </View>
    </ScreenContainer>
  );
}
