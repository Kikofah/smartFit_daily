import { Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { typography } from '../../constants/theme';

/**
 * REC-2 · REQ-05 — mirrors v1/07-workout-result.html.
 * MET is computed client-side, then POST /api/workouts/sessions/:id/complete
 * is called with an optimistic UI update within 250ms (NFR-02) — no waiting
 * on the round trip.
 */
export default function WorkoutResultScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: 16 }}>
      <Text style={typography.h1}>ผลการออกกำลังกาย</Text>
      {/* TODO: show calculatedKcal (from client-side MET calc), call the complete endpoint. */}
      <Button label="กลับหน้าหลัก" onPress={() => navigate('/', { replace: true })} />
    </ScreenContainer>
  );
}
