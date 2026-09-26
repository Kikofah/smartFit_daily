import { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper';
import { ProgressDots } from '../../components/ProgressDots';
import { api } from '../../services/api';
import type { OnboardingContext } from '../../layouts/OnboardingLayout';
import { onboardingDraft } from '../../store/onboardingDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { goalConfirmScreenStyles as styles } from './styles';
import {
  computeDailyCalorieTargetKcal,
  computeDailyIntakeTarget,
  GOAL_INTAKE_DELTA_KCAL,
  GOAL_KCAL_PER_KG,
} from '../../../../server/domain/goalTargets';
import type { GoalType } from '@smartfit/shared-types';

// Thai display labels only — the actual kcal/kg and TDEE-delta constants
// (and the safety-floor logic) live in server/domain/goalTargets.ts, shared
// by both this screen and the server (see 2026-09-25 dedupe report) so they
// can't drift out of sync again.
const GOAL_LABELS: Record<GoalType, string> = {
  lose_weight: 'ลดน้ำหนัก',
  tone_up: 'กระชับสัดส่วน',
  build_endurance: 'เพิ่มความอึด',
};

/**
 * ONB-3 (part b) · REQ-02 — mirrors v1/04-onboarding-goal-confirm.html (step 4 of 4, final).
 * Uses the real weightKg from step 1 (threaded via onboardingDraft) to
 * compute the daily exercise-calorie target. Completes onboarding via
 * PUT /api/profile/goal, then navigates to "/".
 */
export default function GoalConfirmScreen() {
  const navigate = useNavigate();
  const { profile, isLoading } = useOutletContext<OnboardingContext>();
  const savedGoalSelection = profile?.goalSelection;
  const goalType = onboardingDraft.goalType ?? savedGoalSelection?.goalType;
  const weightKg = onboardingDraft.weightKg ?? profile?.weightKg;
  const tdeeKcal = onboardingDraft.tdeeKcal ?? profile?.tdeeKcal;
  const [targetWeightKg, setTargetWeightKg] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (savedGoalSelection?.targetWeightKg !== undefined) {
      setTargetWeightKg(savedGoalSelection.targetWeightKg);
    }
  }, [savedGoalSelection]);

  useEffect(() => {
    if (isLoading) return;
    if (!goalType) {
      navigate('/onboarding/goal-select', { replace: true });
    } else if (weightKg === undefined || tdeeKcal === undefined) {
      navigate('/onboarding/personal-info', { replace: true });
    }
  }, [isLoading, goalType, weightKg, tdeeKcal, navigate]);

  const computed = useMemo(() => {
    if (!goalType || weightKg === undefined || tdeeKcal === undefined) return null;
    // Exact/unrounded per TC-ONB-3-001/003 (confirmed 2026-09-25) — stored
    // as-is; only rendering below rounds it for display.
    const dailyCalorieTargetKcal = computeDailyCalorieTargetKcal(weightKg, goalType);
    const { dailyIntakeTargetKcal, isSafetyFloorApplied } = computeDailyIntakeTarget(tdeeKcal, goalType);

    return {
      label: GOAL_LABELS[goalType],
      kcalPerKg: GOAL_KCAL_PER_KG[goalType],
      dailyCalorieTargetKcal,
      dailyIntakeTargetKcal,
      isSafetyFloorApplied,
    };
  }, [goalType, weightKg, tdeeKcal]);

  if (!goalType || weightKg === undefined || tdeeKcal === undefined || !computed) return null;

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
        dailyIntakeTargetKcal: computed!.dailyIntakeTargetKcal,
      });
      navigate('/', { replace: true });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const fmt = (n: number) => n.toLocaleString('th-TH');
  // dailyCalorieTargetKcal/dailyIntakeTargetKcal are stored/compared as exact
  // values (see server/domain/goalTargets.ts) — this screen only rounds them
  // for display, per the 2026-09-25 rounding decision.
  const fmtKcal = (n: number) => fmt(Math.round(n));

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
        คำนวณจากน้ำหนักตัวปัจจุบันของคุณและเป้าหมายที่เลือก — ตัวเลขนี้คือแคลอรี่ที่ควรเผาผลาญจากการออกกำลังกายต่อวัน
      </Text>

      <View style={[styles.summaryCard, { marginTop: spacing[8] }]}>
        <Text style={typography.caption}>เป้าหมาย: {computed.label}</Text>
        <Text style={styles.targetNumber}>{fmtKcal(computed.dailyCalorieTargetKcal)}</Text>
        <Text style={typography.bodySm}>kcal / วัน</Text>
      </View>

      <View style={{ marginTop: spacing[6] }}>
        <View style={styles.breakdownRow}>
          <Text style={typography.bodySm}>น้ำหนักตัวปัจจุบัน</Text>
          <Text style={typography.body}>{fmt(weightKg)} กก.</Text>
        </View>
        <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
          <Text style={typography.bodySm}>สูตรตามเป้าหมาย</Text>
          <Text style={typography.body}>{computed.kcalPerKg} kcal/กก.</Text>
        </View>
      </View>

      <View style={[styles.secondaryCard, { marginTop: spacing[6] }]}>
        <Text style={typography.bodySm}>เป้าหมายแคลอรี่ที่ควรได้รับต่อวัน (สำหรับวางแผนอาหารในอนาคต)</Text>
        <Text style={[typography.h2, { marginTop: spacing[1] }]}>{fmtKcal(computed.dailyIntakeTargetKcal)} kcal/วัน</Text>
        <Text style={[typography.caption, { color: colors.inkMuted, marginTop: spacing[1] }]}>
          คำนวณจาก TDEE ({fmtKcal(tdeeKcal)} kcal){' '}
          {GOAL_INTAKE_DELTA_KCAL[goalType] === 0
            ? '(ไม่บวก/ลบ — คงระดับพลังงาน)'
            : `${GOAL_INTAKE_DELTA_KCAL[goalType] > 0 ? '+' : '−'}${Math.abs(GOAL_INTAKE_DELTA_KCAL[goalType])} kcal`}
          {computed.isSafetyFloorApplied && ' — ปรับให้ไม่ต่ำกว่าเกณฑ์ความปลอดภัยขั้นต่ำแล้ว'}
          . ยังไม่ถูกใช้คำนวณอะไรในแอปตอนนี้ เตรียมไว้สำหรับฟีเจอร์บันทึกอาหารในอนาคต
        </Text>
      </View>

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
