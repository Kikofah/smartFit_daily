import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { ProgressDots } from '../../components/ProgressDots';
import { api } from '../../services/api';
import type { OnboardingContext } from '../../layouts/OnboardingLayout';
import { onboardingDraft } from '../../store/onboardingDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { equipmentScreenStyles as styles } from './styles';
import type { EquipmentType } from '@smartfit/shared-types';

const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string }[] = [
  { value: 'none', label: 'ไม่มีอุปกรณ์' },
  { value: 'dumbbell', label: 'ดัมเบล' },
  { value: 'full_gym', label: 'ยิมครบชุด' },
];

/**
 * ONB-2 · REQ-03 — mirrors v1/02-onboarding-equipment.html (step 2 of 4).
 * Multi-select; "none" is mutually exclusive with every other option (server
 * also enforces this — see server/routes/personalization-profile/index.ts).
 */
export default function EquipmentScreen() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<OnboardingContext>();
  const [selected, setSelected] = useState<Set<EquipmentType>>(new Set());
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.equipmentTypes) setSelected(new Set(profile.equipmentTypes));
  }, [profile]);

  function toggle(value: EquipmentType) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else if (value === 'none') {
        next.clear();
        next.add('none');
      } else {
        next.delete('none');
        next.add(value);
      }
      return next;
    });
  }

  async function handleSubmit() {
    setTouched(true);
    if (selected.size === 0) return;

    const equipmentTypes = Array.from(selected);
    try {
      await api.put('/profile/equipment', { equipmentTypes });
      onboardingDraft.equipmentTypes = equipmentTypes;
      navigate('/onboarding/goal-select');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ paddingTop: 0, gap: 0 }}>
      <View style={{ marginTop: spacing[4] }}>
        <ProgressDots total={4} currentIndex={1} />
      </View>
      <View style={[styles.wordmarkRow, { marginTop: spacing[6] }]}>
        <Button label="‹ ย้อนกลับ" variant="ghost" onPress={() => navigate('/onboarding/personal-info')} />
        <Text style={typography.caption}>ขั้นตอนที่ 2 จาก 4</Text>
      </View>

      <Text style={typography.h1}>เลือกอุปกรณ์ที่คุณมี</Text>
      <Text style={[typography.body, { color: colors.inkMuted, marginTop: spacing[2] }]}>
        เราจะแนะนำวิดีโอที่คุณทำได้จริงตามอุปกรณ์นี้เท่านั้น
      </Text>

      <View style={[styles.chipGroup, { marginTop: spacing[8] }]}>
        {EQUIPMENT_OPTIONS.map((opt) => (
          <Chip key={opt.value} label={opt.label} selected={selected.has(opt.value)} onPress={() => toggle(opt.value)} />
        ))}
      </View>

      <Text style={[typography.bodySm, { marginTop: spacing[4] }]}>
        เลือกได้มากกว่า 1 อย่าง — หากเลือก "ไม่มีอุปกรณ์" ระบบจะแนะนำเฉพาะท่าที่ใช้น้ำหนักตัว (bodyweight) เท่านั้น
      </Text>
      {touched && selected.size === 0 && (
        <Text style={styles.errorText}>กรุณาเลือกอุปกรณ์อย่างน้อย 1 อย่าง (เลือก "ไม่มีอุปกรณ์" ได้ถ้าไม่มีอุปกรณ์เลย)</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={{ marginTop: spacing[8], marginBottom: spacing[8] }}>
        <Button label="ถัดไป" onPress={handleSubmit} disabled={selected.size === 0} />
      </View>
    </ScreenContainer>
  );
}
