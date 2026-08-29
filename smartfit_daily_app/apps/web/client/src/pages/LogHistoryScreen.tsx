import { Text, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { IconCheck, IconDashedCircle } from '../components/Icon';
import { colors, spacing, typography } from '../constants/theme';
import type { DailyLog } from '@smartfit/shared-types';
import { logHistoryScreenStyles as styles } from './styles';

/**
 * PLN-3 · REQ-10 — mirrors v1/09-log-history.html.
 * Pushed from the "แผน" (Planner) tab; reverse-chronological list of DailyLog
 * entries. Status is conveyed with icon + color, never color alone
 * (DESIGN.md §4.2/§4.3) — an incomplete day is rendered icon-less and
 * neutral, never a red/negative mark.
 *
 * TODO: currently driven by local mock data matching the canonical 9-day
 * example (Wed 19 Aug - Thu 27 Aug 2026, today = Thu 27 Aug 2026) used by
 * v1/09-log-history.html and TC-PLN-2-004/TC-PLN-4-001, since
 * `GET /api/logs` (apps/web/server/routes/logging-streak/index.ts) is still
 * a stub. Wire this screen to `GET /logs` (docs/02-design/02-technical/api-spec.md
 * §3.6), which returns DailyLog entries ordered newest-first.
 */

interface MockLogEntry extends Pick<DailyLog, 'logDate' | 'accumulatedKcal' | 'completionStatus' | 'source'> {
  dayLabel: string;
}

// Reverse-chronological, matching v1/09-log-history.html exactly.
const MOCK_LOGS: MockLogEntry[] = [
  { logDate: '2026-08-27', dayLabel: 'พฤหัสบดี 27 ส.ค.', accumulatedKcal: 410, completionStatus: 'completed', source: 'workout_session' },
  { logDate: '2026-08-26', dayLabel: 'พุธ 26 ส.ค.', accumulatedKcal: 0, completionStatus: 'completed', source: 'cheat_rest_override' },
  { logDate: '2026-08-25', dayLabel: 'อังคาร 25 ส.ค.', accumulatedKcal: 385, completionStatus: 'completed', source: 'workout_session' },
  { logDate: '2026-08-24', dayLabel: 'จันทร์ 24 ส.ค.', accumulatedKcal: 260, completionStatus: 'incomplete', source: 'workout_session' },
  { logDate: '2026-08-23', dayLabel: 'อาทิตย์ 23 ส.ค.', accumulatedKcal: 450, completionStatus: 'completed', source: 'workout_session' },
  { logDate: '2026-08-22', dayLabel: 'เสาร์ 22 ส.ค.', accumulatedKcal: 395, completionStatus: 'completed', source: 'workout_session' },
  { logDate: '2026-08-21', dayLabel: 'ศุกร์ 21 ส.ค.', accumulatedKcal: 180, completionStatus: 'incomplete', source: 'workout_session' },
  { logDate: '2026-08-20', dayLabel: 'พฤหัสบดี 20 ส.ค.', accumulatedKcal: 0, completionStatus: 'completed', source: 'cheat_rest_override' },
  { logDate: '2026-08-19', dayLabel: 'พุธ 19 ส.ค.', accumulatedKcal: 420, completionStatus: 'completed', source: 'workout_session' },
];

function statusLabel(entry: MockLogEntry): string {
  const isCheatRest = entry.source === 'cheat_rest_override';
  if (isCheatRest) return 'Cheat Day / Rest Day · ครบเป้าหมาย';
  return entry.completionStatus === 'completed' ? 'ครบเป้าหมาย' : 'ไม่ครบเป้าหมาย';
}

function kcalLabel(entry: MockLogEntry): string {
  return entry.source === 'cheat_rest_override' ? '—' : `${entry.accumulatedKcal} kcal`;
}

export default function LogHistoryScreen() {
  const navigate = useNavigate();

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 24 }}>
      <View style={{ gap: 4 }}>
        <Text style={typography.caption}>ความคืบหน้า</Text>
        <Text style={typography.h1}>ประวัติการออกกำลังกาย</Text>
      </View>

      <View style={styles.subtabs}>
        <Text
          style={[styles.subtab, styles.subtabInactive]}
          onPress={() => navigate('/progress')}
          accessibilityRole="link"
        >
          ภาพรวม
        </Text>
        <Text style={[styles.subtab, styles.subtabActive]} accessibilityRole="link" aria-current="page">
          ประวัติ
        </Text>
      </View>

      <View style={{ gap: spacing[2] }}>
        {MOCK_LOGS.map((entry) => {
          const isCheatRest = entry.source === 'cheat_rest_override';
          return (
            <View key={entry.logDate} style={styles.logRow}>
              <View style={styles.logStatusIcon}>
                {isCheatRest && <IconDashedCircle size={18} color={colors.sand} />}
                {!isCheatRest && entry.completionStatus === 'completed' && (
                  <IconCheck size={18} color={colors.sage} />
                )}
                {/* incomplete, non-cheat/rest days render icon-less — DESIGN.md §4.2 */}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={typography.body}>{entry.dayLabel}</Text>
                <Text style={typography.bodySm}>{statusLabel(entry)}</Text>
              </View>
              <Text style={styles.kcal}>{kcalLabel(entry)}</Text>
            </View>
          );
        })}
      </View>
    </ScreenContainer>
  );
}
