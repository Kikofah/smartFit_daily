import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * "แผน" tab — PLN-1, PLN-2 · REQ-08, REQ-09 — mirrors v1/08-weekly-planner.html.
 * Read-only flag per day is derived (planDate < today AND has a daily_log),
 * never persisted — see getWeeklyPlan.
 */
export default function PlannerScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>แผนรายสัปดาห์</Text>
      {/* TODO: 7-day calendar grid, Cheat/Rest Day toggle per day. */}
      <Button label="ดูประวัติ log" variant="ghost" onPress={() => router.push('/log-history')} />
    </ScreenContainer>
  );
}
