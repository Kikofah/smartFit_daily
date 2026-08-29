import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { ProgressDots } from '../../components/ProgressDots';
import type { OnboardingContext } from '../../layouts/OnboardingLayout';
import { onboardingDraft } from '../../store/onboardingDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { goalSelectScreenStyles as styles } from './styles';
import type { GoalType } from '@smartfit/shared-types';

const GOAL_OPTIONS: { value: GoalType; title: string; subtext: string }[] = [
  { value: 'lose_weight', title: 'ลดน้ำหนัก', subtext: 'ลดพลังงานลง 500 kcal ต่อวันจาก TDEE อย่างค่อยเป็นค่อยไป' },
  { value: 'tone_up', title: 'กระชับสัดส่วน', subtext: 'คงพลังงานเท่าที่ใช้จริง (maintenance) เน้นสร้างความฟิตและกล้ามเนื้อ' },
  { value: 'build_endurance', title: 'เพิ่มความอึด', subtext: 'เพิ่มพลังงานขึ้น 300 kcal ต่อวันจาก TDEE เพื่อรองรับการฝึกที่มากขึ้น' },
];

/**
 * ONB-3 (part a) · REQ-02 — mirrors v1/03-onboarding-goal-select.html (step 3 of 4).
 * Single-select of 1 of 3 goals; the actual kcal target + safety floor is
 * computed on the next (confirm) screen, using the real tdeeKcal from step 1.
 */
export default function GoalSelectScreen() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<OnboardingContext>();
  const [goalType, setGoalType] = useState<GoalType | null>(null);

  useEffect(() => {
    if (profile?.goalSelection?.goalType) setGoalType(profile.goalSelection.goalType);
  }, [profile]);

  function handleSubmit() {
    if (!goalType) return;
    onboardingDraft.goalType = goalType;
    navigate('/onboarding/goal-confirm');
  }

  return (
    <ScreenContainer style={{ paddingTop: 0, gap: 0 }}>
      <View style={{ marginTop: spacing[4] }}>
        <ProgressDots total={4} currentIndex={2} />
      </View>
      <View style={[styles.wordmarkRow, { marginTop: spacing[6] }]}>
        <Button label="‹ ย้อนกลับ" variant="ghost" onPress={() => navigate('/onboarding/equipment')} />
        <Text style={typography.caption}>ขั้นตอนที่ 3 จาก 4</Text>
      </View>

      <Text style={typography.h1}>ตั้งเป้าหมายหลักของคุณ</Text>
      <Text style={[typography.body, { color: colors.inkMuted, marginTop: spacing[2] }]}>
        เลือกเป้าหมายที่ตรงกับสิ่งที่คุณอยากได้มากที่สุดตอนนี้ เปลี่ยนภายหลังได้เสมอ
      </Text>

      <View style={{ marginTop: spacing[8], gap: spacing[3] }}>
        {GOAL_OPTIONS.map((opt) => {
          const selected = goalType === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setGoalType(opt.value)}
              style={[styles.goalCard, selected && styles.goalCardSelected]}
            >
              <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>{opt.title}</Text>
                <Text style={[typography.bodySm, { marginTop: spacing[1] }]}>{opt.subtext}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: spacing[8], marginBottom: spacing[8] }}>
        <Button label="ถัดไป" onPress={handleSubmit} disabled={!goalType} />
      </View>
    </ScreenContainer>
  );
}
