import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { typography } from '../constants/theme';

/**
 * "วันนี้" tab — REC-1, REC-4 · REQ-04, REQ-07 — mirrors v1/05-daily-dashboard.html.
 * Must render the Calorie Ring + recommended video within a non-laggy time
 * (NFR-01).
 */
export default function DailyDashboardScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>วันนี้</Text>
      {/* TODO: Calorie Ring + recommended video card, fetched via GET /api/workouts/today/recommendation. */}
      <Button label="เริ่มออกกำลังกาย" onPress={() => navigate('/workout/session')} />
    </ScreenContainer>
  );
}
