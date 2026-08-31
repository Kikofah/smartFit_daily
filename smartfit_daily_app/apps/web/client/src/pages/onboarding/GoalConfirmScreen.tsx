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
import type { GoalType } from '@smartfit/shared-types';

/**
 * kcal to burn via exercise per kg of current body weight per day —
 * confirmed 2026-08-31. This app tracks exercise burn only (no food-intake
 * logging yet), so this is the number REC-1/PLN-3/INT-1 actually consume —
 * lands in the same range as a single real workout session already
 * estimates elsewhere in the app (~150–350 kcal for a typical 20–30 min
 * session), scaled by weight the same way MET-based calorie burn already is.
 */
const GOAL_META: Record<GoalType, { label: string; kcalPerKg: number }> = {
  lose_weight: { label: 'ลดน้ำหนัก', kcalPerKg: 4.5 },
  tone_up: { label: 'กระชับสัดส่วน', kcalPerKg: 3.0 },
  build_endurance: { label: 'เพิ่มความอึด', kcalPerKg: 5.5 },
};

/**
 * TDEE ± per-goalType delta — the original diet-style net energy-balance
 * target (REQ-02), reinstated 2026-08-31 alongside the exercise-burn target
 * above so a future food-intake logging feature has something to build on.
 * Not consumed by anything today (REC-1/PLN-3/INT-1 all use
 * dailyCalorieTargetKcal instead) — shown here purely as forward-looking
 * context, with its safety floor protection kept intact.
 */
const GOAL_INTAKE_DELTA_KCAL: Record<GoalType, number> = {
  lose_weight: -500,
  tone_up: 0,
  build_endurance: 300,
};
const SAFETY_FLOOR_MIN_KCAL = 1200; // exact value tied to sex/age band — see log 2026-08-27

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
    const goal = GOAL_META[goalType];
    const dailyCalorieTargetKcal = Math.round(weightKg * goal.kcalPerKg);

    const rawIntakeKcal = tdeeKcal + GOAL_INTAKE_DELTA_KCAL[goalType];
    const isSafetyFloorApplied = rawIntakeKcal < SAFETY_FLOOR_MIN_KCAL;
    const dailyIntakeTargetKcal = isSafetyFloorApplied ? SAFETY_FLOOR_MIN_KCAL : rawIntakeKcal;

    return { goal, dailyCalorieTargetKcal, dailyIntakeTargetKcal, isSafetyFloorApplied };
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
        <Text style={typography.caption}>เป้าหมาย: {computed.goal.label}</Text>
        <Text style={styles.targetNumber}>{fmt(computed.dailyCalorieTargetKcal)}</Text>
        <Text style={typography.bodySm}>kcal / วัน</Text>
      </View>

      <View style={{ marginTop: spacing[6] }}>
        <View style={styles.breakdownRow}>
          <Text style={typography.bodySm}>น้ำหนักตัวปัจจุบัน</Text>
          <Text style={typography.body}>{fmt(weightKg)} กก.</Text>
        </View>
        <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
          <Text style={typography.bodySm}>สูตรตามเป้าหมาย</Text>
          <Text style={typography.body}>{computed.goal.kcalPerKg} kcal/กก.</Text>
        </View>
      </View>

      <View style={[styles.secondaryCard, { marginTop: spacing[6] }]}>
        <Text style={typography.bodySm}>เป้าหมายแคลอรี่ที่ควรได้รับต่อวัน (สำหรับวางแผนอาหารในอนาคต)</Text>
        <Text style={[typography.h2, { marginTop: spacing[1] }]}>{fmt(computed.dailyIntakeTargetKcal)} kcal/วัน</Text>
        <Text style={[typography.caption, { color: colors.inkMuted, marginTop: spacing[1] }]}>
          คำนวณจาก TDEE ({fmt(tdeeKcal)} kcal){' '}
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
