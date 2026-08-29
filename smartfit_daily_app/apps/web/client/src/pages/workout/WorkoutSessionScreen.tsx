import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * REC-1, REC-3 · REQ-04, REQ-06 — mirrors v1/06-workout-session.html.
 * Pushed from the "วันนี้" tab after POST /api/workouts/sessions.
 */
export default function WorkoutSessionScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>กำลังออกกำลังกาย</Text>
      {/* TODO: embedded video player + "เปลี่ยนวิดีโอ" (POST /api/workouts/today/recommendation/swap) */}
      <Button label="จบเซสชัน" onPress={() => navigate('/workout/result', { replace: true })} />
    </ScreenContainer>
  );
}
