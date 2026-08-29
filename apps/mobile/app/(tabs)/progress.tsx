import { Text } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { typography } from '../../src/constants/theme';

/**
 * "ความคืบหน้า" tab — PLN-4, INT-1 · REQ-09/10, REQ-11 — mirrors v1/10-progress-insights.html.
 * Weight/calorie charts: NFR-13 — earth-tone palette only, never a
 * red/green traffic-light scheme for body data.
 */
export default function ProgressScreen() {
  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>ความคืบหน้า</Text>
      {/* TODO: Streak Badge + weight/forecast chart, fetched via getStreak / getForecast. */}
    </ScreenContainer>
  );
}
