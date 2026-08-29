import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Stepper } from '../../components/Stepper';
import { ProgressDots } from '../../components/ProgressDots';
import { api } from '../../services/api';
import type { OnboardingContext } from '../../layouts/OnboardingLayout';
import { onboardingDraft } from '../../store/onboardingDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { personalInfoScreenRowStyles as rowStyles, personalInfoScreenStyles as styles } from './styles';
import type { ActivityLevel, Sex } from '@smartfit/shared-types';

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'น้อยมาก — แทบไม่ออกกำลังกาย' },
  { value: 'light', label: 'น้อย — ออกกำลังกาย 1–3 วัน/สัปดาห์' },
  { value: 'moderate', label: 'ปานกลาง — ออกกำลังกาย 3–5 วัน/สัปดาห์' },
  { value: 'active', label: 'มาก — ออกกำลังกาย 6–7 วัน/สัปดาห์' },
  { value: 'very_active', label: 'มากที่สุด — ออกกำลังกายหนัก หรืองานใช้แรงกายมาก' },
];

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** Mifflin-St Jeor BMR, then × activity factor — computed client-side per NFR-01/03. */
function computeTdeeKcal(sex: Sex, weightKg: number, heightCm: number, age: number, activityLevel: ActivityLevel) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
  return Math.round(bmr * ACTIVITY_FACTOR[activityLevel]);
}

/**
 * ONB-1 · REQ-01 — mirrors v1/01-onboarding-personal-info.html (step 1 of 4).
 * TDEE (Mifflin-St Jeor) is computed client-side (NFR-01/03) before calling
 * PUT /api/profile/personal-info.
 */
export default function PersonalInfoScreen() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<OnboardingContext>();
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState<Sex | null>(null);
  const [weightKg, setWeightKg] = useState(60);
  const [heightCm, setHeightCm] = useState(165);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.displayName) setName(profile.displayName);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    setAge(profile.age);
    setSex(profile.sex);
    setWeightKg(profile.weightKg);
    setHeightCm(profile.heightCm);
    setActivityLevel(profile.activityLevel);
  }, [profile]);

  const nameValid = name.trim().length > 0;
  const ageValid = age >= 10 && age <= 100;
  const weightValid = weightKg >= 20 && weightKg <= 250;
  const heightValid = heightCm >= 100 && heightCm <= 220;
  const sexValid = sex !== null;
  const activityValid = activityLevel !== null;

  async function handleSubmit() {
    setTouched(true);
    if (!(nameValid && ageValid && weightValid && heightValid && sexValid && activityValid)) return;

    const tdeeKcal = computeTdeeKcal(sex!, weightKg, heightCm, age, activityLevel!);
    const displayName = name.trim();
    try {
      await api.put('/profile/personal-info', { displayName, age, sex, weightKg, heightCm, activityLevel, tdeeKcal });
      Object.assign(onboardingDraft, { displayName, age, sex, weightKg, heightCm, activityLevel, tdeeKcal });
      navigate('/onboarding/equipment');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScreenContainer style={{ paddingTop: 0, gap: 0 }}>
      <View style={{ marginTop: spacing[4] }}>
        <ProgressDots total={4} currentIndex={0} />
      </View>
      <View style={[styles.wordmarkRow, { marginTop: spacing[6] }]}>
        <Text style={[typography.caption, { color: colors.ink }]}>smartfit daily</Text>
        <Text style={typography.caption}>ขั้นตอนที่ 1 จาก 4</Text>
      </View>

      <Text style={typography.h1}>ข้อมูลส่วนตัวของคุณ</Text>
      <Text style={[typography.body, { color: colors.inkMuted, marginTop: spacing[2] }]}>
        บอกข้อมูลพื้นฐานของร่างกาย เพื่อให้เราคำนวณเป้าหมายแคลอรี่ที่พอดีกับคุณ
      </Text>

      <View style={{ marginTop: spacing[8], gap: spacing[6] }}>
        <Input
          label="ชื่อ-นามสกุล"
          placeholder="เช่น พิมพ์ใจ สุขสันต์"
          value={name}
          onChangeText={setName}
          error={touched && !nameValid ? 'กรุณากรอกชื่อ-นามสกุล' : undefined}
        />

        <View>
          <Stepper label="อายุ (ปี)" value={age} onChange={setAge} min={10} max={100} unit="ปี" error={touched && !ageValid} />
          {touched && !ageValid && <Text style={styles.errorText}>กรุณากรอกอายุระหว่าง 10–100 ปี</Text>}
        </View>

        <View>
          <Text style={styles.groupLabel}>เพศ</Text>
          <Text style={[typography.bodySm, { marginBottom: spacing[2] }]}>ใช้ในสูตรคำนวณ BMR (Mifflin-St Jeor) เท่านั้น</Text>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            <SelectableRow label="หญิง" selected={sex === 'female'} onPress={() => setSex('female')} style={{ flex: 1 }} />
            <SelectableRow label="ชาย" selected={sex === 'male'} onPress={() => setSex('male')} style={{ flex: 1 }} />
          </View>
          {touched && !sexValid && <Text style={styles.errorText}>กรุณาเลือกเพศ เพื่อใช้ในการคำนวณ BMR</Text>}
        </View>

        <View>
          <Stepper label="น้ำหนัก (กก.)" value={weightKg} onChange={setWeightKg} step={0.5} min={20} max={250} unit="กก." error={touched && !weightValid} />
          {touched && !weightValid && <Text style={styles.errorText}>กรุณากรอกน้ำหนักระหว่าง 20–250 กก. (ห้ามติดลบ)</Text>}
        </View>

        <View>
          <Stepper label="ส่วนสูง (ซม.)" value={heightCm} onChange={setHeightCm} min={100} max={220} unit="ซม." error={touched && !heightValid} />
          {touched && !heightValid && <Text style={styles.errorText}>กรุณากรอกส่วนสูงระหว่าง 100–220 ซม.</Text>}
        </View>

        <View>
          <Text style={styles.groupLabel}>ระดับกิจกรรม</Text>
          <View style={{ gap: spacing[2] }}>
            {ACTIVITY_OPTIONS.map((opt) => (
              <SelectableRow
                key={opt.value}
                label={opt.label}
                selected={activityLevel === opt.value}
                onPress={() => setActivityLevel(opt.value)}
              />
            ))}
          </View>
          {touched && !activityValid && <Text style={styles.errorText}>กรุณาเลือกระดับกิจกรรมของคุณ</Text>}
        </View>
      </View>

      {error && <Text style={[styles.errorText, { marginTop: spacing[4] }]}>{error}</Text>}
      <View style={{ marginTop: spacing[8], marginBottom: spacing[8] }}>
        <Button label="ถัดไป" onPress={handleSubmit} />
      </View>
    </ScreenContainer>
  );
}

function SelectableRow({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: object;
}) {
  return (
    <Pressable onPress={onPress} style={[rowStyles.row, selected && rowStyles.rowSelected, style]}>
      <View style={[rowStyles.radioOuter, selected && rowStyles.radioOuterSelected]}>
        {selected && <View style={rowStyles.radioInner} />}
      </View>
      <Text style={typography.body}>{label}</Text>
    </Pressable>
  );
}

