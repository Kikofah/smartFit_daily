import { Text } from 'react-native';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { typography } from '../src/constants/theme';

/**
 * PLN-3 · REQ-10 — mirrors v1/09-log-history.html.
 * Pushed from the "แผน" (Planner) tab. Must survive unstable network
 * (NFR-08) — local persistence before sync.
 */
export default function LogHistoryScreen() {
  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 16 }}>
      <Text style={typography.h1}>ประวัติ Log</Text>
      {/* TODO: list of DailyLog entries via getLogs, newest first. */}
    </ScreenContainer>
  );
}
