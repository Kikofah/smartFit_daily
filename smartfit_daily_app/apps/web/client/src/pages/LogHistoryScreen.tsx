import { Text } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { typography } from '../constants/theme';

/**
 * PLN-3 · REQ-10 — mirrors v1/09-log-history.html.
 * Pushed from the "แผน" (Planner) tab.
 */
export default function LogHistoryScreen() {
  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>ประวัติ Log</Text>
      {/* TODO: list of DailyLog entries via GET /api/logs, newest first. */}
    </ScreenContainer>
  );
}
