import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { typography } from '../constants/theme';

/**
 * "แผน" tab — PLN-1, PLN-2 · REQ-08, REQ-09 — mirrors v1/08-weekly-planner.html.
 * Read-only flag per day is derived (planDate < today AND has a daily_log),
 * never persisted — see GET /api/planner/week.
 */
export default function PlannerScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>แผนรายสัปดาห์</Text>
      {/* TODO: 7-day calendar grid, Cheat/Rest Day toggle per day. */}
      <Button label="ดูประวัติ log" variant="ghost" onPress={() => navigate('/log-history')} />
    </ScreenContainer>
  );
}
