import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Button } from '../../src/components/Button';
import { typography } from '../../src/constants/theme';

/**
 * "วันนี้" tab — REC-1, REC-4 · REQ-04, REQ-07 — mirrors v1/05-daily-dashboard.html.
 * Must render the Calorie Ring + recommended video within a non-laggy time
 * (NFR-01).
 */
export default function DailyDashboardScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>วันนี้</Text>
      {/* TODO: Calorie Ring + recommended video card, fetched via getTodayRecommendation. */}
      <Button label="เริ่มออกกำลังกาย" onPress={() => router.push('/workout/session')} />
    </ScreenContainer>
  );
}
