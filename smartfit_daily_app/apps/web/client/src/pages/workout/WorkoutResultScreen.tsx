import { View, Text } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { CalorieRing } from '../../components/CalorieRing';
import { workoutDraft } from '../../store/workoutDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { workoutResultScreenStyles as styles } from './styles';

/**
 * REC-2 · REQ-05 — mirrors v1/07-workout-result.html.
 * All-or-nothing per PLN-3 — no partial credit for "almost reaching" the
 * daily target, and a miss is rendered neutral (never danger/red, no
 * negative icon) per DESIGN.md §4.2.
 */
export default function WorkoutResultScreen() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { calculatedKcal: number } };
  const calculatedKcal = state?.calculatedKcal ?? 0;
  const goalKcal = workoutDraft.goalKcal ?? 0;
  const totalKcal = (workoutDraft.accumulatedKcalBeforeSession ?? 0) + calculatedKcal;
  const isComplete = goalKcal > 0 && totalKcal >= goalKcal;

  return (
    <ScreenContainer style={{ paddingTop: spacing[6], gap: 0 }}>
      <View style={{ marginBottom: spacing[6] }}>
        <CalorieRing valueKcal={totalKcal} goalKcal={goalKcal} />
      </View>

      <View style={styles.statusPanel}>
        <StatusIcon success={isComplete} />
        <Text style={[typography.h3, { color: isComplete ? colors.ink : colors.inkMuted }]}>
          {isComplete ? 'ครบเป้าหมายวันนี้แล้ว' : 'วันนี้ยังไม่ครบเป้า'}
        </Text>
        <Text style={typography.bodySm}>
          {isComplete ? 'เก็บสถิติวันนี้ไว้แล้ว ทำต่อพรุ่งนี้ได้เลย' : 'พรุ่งนี้เริ่มนับใหม่ได้'}
        </Text>
      </View>

      <View style={styles.kcalDetail}>
        <Text style={[typography.body, { color: colors.inkMuted }]}>แคลอรี่ที่เผาผลาญเซสชันนี้</Text>
        <Text style={typography.h2}>{calculatedKcal} kcal</Text>
      </View>
      <Text style={[typography.caption, { textAlign: 'right', marginBottom: spacing[8] }]}>ประมาณจากสูตร MET</Text>

      <Button label="เสร็จสิ้น" onPress={() => navigate('/', { replace: true })} />
    </ScreenContainer>
  );
}

function StatusIcon({ success }: { success: boolean }) {
  const color = success ? colors.sage : colors.inkFaint;
  return (
    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={9} />
      {success && <path d="M8 12.5l2.5 2.5L16 9.5" />}
    </svg>
  );
}
