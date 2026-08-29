import { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper';
import { ProgressDots } from '../../components/ProgressDots';
import { api } from '../../services/api';
import { onboardingDraft } from '../../store/onboardingDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { goalConfirmScreenStyles as styles } from './styles';
import type { GoalType } from '@smartfit/shared-types';

const GOAL_META: Record<GoalType, { label: string; delta: number; formula: string }> = {
  lose_weight: { label: 'ลดน้ำหนัก', delta: -500, formula: 'TDEE − 500 kcal/วัน' },
  tone_up: { label: 'กระชับสัดส่วน', delta: 0, formula: 'TDEE + 0 kcal/วัน (maintenance)' },
  build_endurance: { label: 'เพิ่มความอึด', delta: 300, formula: 'TDEE + 300 kcal/วัน' },
};

/**
 * เกณฑ์ขั้นต่ำที่ใช้แสดงผลฝั่ง client ต้องตรงกับ SAFETY_FLOOR_MIN_KCAL ฝั่ง server
 * (server/routes/personalization-profile/index.ts) — REQ-02 ยืนยันช่วง 1,200-1,500 kcal/วัน
 * แต่ยังไม่ระบุว่าใช้ปลายไหนกับ profile แบบไหน (เช่น แยกตามเพศ) ถือเป็น open point รอ product/eng ตัดสินใจ
 */
const SAFETY_FLOOR_MIN_KCAL = 1200;

/**
 * ONB-3 (part b) · REQ-02 — mirrors v1/04-onboarding-goal-confirm.html (step 4 of 4, final).
 * Unlike the prototype's illustrative EXAMPLE_TDEE placeholder, this uses the
 * real tdeeKcal computed on step 1 (threaded via onboardingDraft). Completes
 * onboarding via PUT /api/profile/goal, then navigates to "/".
 */
export default function GoalConfirmScreen() {
  const navigate = useNavigate();
  const goalType = onboardingDraft.goalType;
  const tdeeKcal = onboardingDraft.tdeeKcal;
  const [targetWeightKg, setTargetWeightKg] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goalType) {
      navigate('/onboarding/goal-select', { replace: true });
    } else if (tdeeKcal === undefined) {
      navigate('/onboarding/personal-info', { replace: true });
    }
  }, [goalType, tdeeKcal, navigate]);

  const computed = useMemo(() => {
    if (!goalType || tdeeKcal === undefined) return null;
    const goal = GOAL_META[goalType];
    const raw = tdeeKcal + goal.delta;
    const isSafetyFloorApplied = raw <= SAFETY_FLOOR_MIN_KCAL;
    const dailyCalorieTargetKcal = isSafetyFloorApplied ? SAFETY_FLOOR_MIN_KCAL : raw;
    return { goal, raw, isSafetyFloorApplied, dailyCalorieTargetKcal };
  }, [goalType, tdeeKcal]);

  if (!goalType || tdeeKcal === undefined || !computed) return null;

  const targetWeightRequired = goalType === 'lose_weight';
  const targetWeightValid = targetWeightRequired
    ? targetWeightKg !== null && targetWeightKg >= 20 && targetWeightKg <= 250
    : targetWeightKg === null || (targetWeightKg >= 20 && targetWeightKg <= 250);

  async function handleStart() {
    setTouched(true);
    if (!targetWeightValid) return;

    try {
      await api.put('/profile/goal', {
        goalType,
        targetWeightKg: targetWeightKg ?? undefined,
        dailyCalorieTargetKcal: computed!.dailyCalorieTargetKcal,
      });
      navigate('/', { replace: true });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const fmt = (n: number) => n.toLocaleString('th-TH');

  return (
    <ScreenContainer style={{ paddingTop: 0, gap: 0 }}>
      <View style={{ marginTop: spacing[4] }}>
        <ProgressDots total={4} currentIndex={3} />
      </View>
      <View style={[styles.wordmarkRow, { marginTop: spacing[6] }]}>
        <Button label="‹ ย้อนกลับ" variant="ghost" onPress={() => navigate('/onboarding/goal-select')} />
        <Text style={typography.caption}>ขั้นตอนที่ 4 จาก 4</Text>
      </View>

      <Text style={typography.h1}>เป้าหมายแคลอรี่รายวันของคุณ</Text>
      <Text style={[typography.body, { color: colors.inkMuted, marginTop: spacing[2] }]}>
        คำนวณจาก TDEE โดยประมาณของคุณและเป้าหมายที่เลือก — ตัวเลขนี้คือพลังงานที่แนะนำให้ได้รับต่อวัน
      </Text>

      <View style={[styles.summaryCard, { marginTop: spacing[8] }]}>
        <Text style={typography.caption}>เป้าหมาย: {computed.goal.label}</Text>
        <Text style={styles.targetNumber}>{fmt(computed.dailyCalorieTargetKcal)}</Text>
        <Text style={typography.bodySm}>kcal / วัน</Text>
      </View>

      <View style={{ marginTop: spacing[6] }}>
        <View style={styles.breakdownRow}>
          <Text style={typography.bodySm}>TDEE โดยประมาณ</Text>
          <Text style={typography.body}>{fmt(tdeeKcal)} kcal</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={typography.bodySm}>สูตรตามเป้าหมาย</Text>
          <Text style={typography.body}>{computed.goal.formula}</Text>
        </View>
        <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
          <Text style={typography.bodySm}>ค่าที่คำนวณได้</Text>
          <Text style={typography.body}>{fmt(computed.raw)} kcal</Text>
        </View>
      </View>

      {computed.isSafetyFloorApplied && (
        <View style={styles.warningNote}>
          <WarningIcon />
          <Text style={styles.warningText}>
            ค่าที่คำนวณได้ต่ำกว่าเกณฑ์ขั้นต่ำเพื่อความปลอดภัยของร่างกาย ระบบจึงปรับเป็น{' '}
            <Text style={{ fontWeight: '600' }}>{fmt(SAFETY_FLOOR_MIN_KCAL)}</Text> kcal/วันแทน
          </Text>
        </View>
      )}

      <Text style={[typography.caption, { marginTop: spacing[4] }]}>
        ทุกเป้าหมายจะไม่ถูกปรับให้ต่ำกว่า 1,200–1,500 kcal/วัน เพื่อความปลอดภัยของร่างกาย ไม่ว่าผลคำนวณจะออกมาเท่าไหร่
      </Text>

      <View style={{ marginTop: spacing[6] }}>
        <Stepper
          label={targetWeightRequired ? 'น้ำหนักเป้าหมาย (กก.) *' : 'น้ำหนักเป้าหมาย (กก.) (ไม่บังคับ)'}
          value={targetWeightKg ?? (targetWeightRequired ? 60 : 0)}
          onChange={setTargetWeightKg}
          step={0.5}
          min={20}
          max={250}
          unit="กก."
          error={touched && !targetWeightValid}
        />
        <Text style={[typography.bodySm, { marginTop: spacing[2] }]}>
          {targetWeightRequired
            ? 'จำเป็นสำหรับเป้าหมาย "ลดน้ำหนัก" — ใช้พยากรณ์วันที่คาดว่าจะถึงเป้าหมายในหน้าความคืบหน้า (INT-1)'
            : 'กรอกไว้ล่วงหน้าได้ถ้าอยากเห็นวันที่คาดว่าจะถึงเป้าหมายในหน้าความคืบหน้า (INT-1) — ข้ามได้ถ้ายังไม่แน่ใจ'}
        </Text>
        {touched && !targetWeightValid && (
          <Text style={styles.errorText}>
            {targetWeightRequired
              ? 'กรุณากรอกน้ำหนักเป้าหมาย (จำเป็นสำหรับเป้าหมาย "ลดน้ำหนัก")'
              : 'กรุณากรอกน้ำหนักเป้าหมายระหว่าง 20–250 กก.'}
          </Text>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={{ marginTop: spacing[8], marginBottom: spacing[8] }}>
        <Button label="เริ่มใช้งาน" onPress={handleStart} />
      </View>
    </ScreenContainer>
  );
}

function WarningIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
      <path d="M10 7.2V11.3" stroke={colors.warning} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={10} cy={13.9} r={0.9} fill={colors.warning} />
      <path
        d="M8.8 2.9c.5-.9 1.9-.9 2.4 0l6.9 12.1c.5.9-.1 2-1.2 2H3.1c-1.1 0-1.7-1.1-1.2-2L8.8 2.9z"
        stroke={colors.warning}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </svg>
  );
}
