import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { EmptyState } from '../components/EmptyState';
import { IconCheck, IconDashedCircle } from '../components/Icon';
import { api } from '../services/api';
import { useAuth } from '../store/AuthContext';
import { colors, spacing, typography } from '../constants/theme';
import type { DailyLog } from '@smartfit/shared-types';
import { logHistoryScreenStyles as styles } from './styles';

/**
 * PLN-3 · REQ-10 — mirrors v1/09-log-history.html.
 * Pushed from the "แผน" (Planner) tab; reverse-chronological list of DailyLog
 * entries. Status is conveyed with icon + color, never color alone
 * (DESIGN.md §4.2/§4.3) — an incomplete day is rendered icon-less and
 * neutral, never a red/negative mark.
 */
function dayLabel(logDate: string): string {
  return new Date(`${logDate}T00:00:00`).toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

function statusLabel(entry: DailyLog): string {
  const isCheatRest = entry.source === 'cheat_rest_override';
  if (isCheatRest) return 'Cheat Day / Rest Day · ครบเป้าหมาย';
  return entry.completionStatus === 'completed' ? 'ครบเป้าหมาย' : 'ไม่ครบเป้าหมาย';
}

function kcalLabel(entry: DailyLog): string {
  return entry.source === 'cheat_rest_override' ? '—' : `${entry.accumulatedKcal} kcal`;
}

export default function LogHistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    // Wait for Firebase Auth to finish restoring the session (see api.ts —
    // it reads auth.currentUser synchronously) before fetching.
    if (!user) return;
    api
      .get<DailyLog[]>('/logs')
      .then(setLogs)
      .catch(() => setLogs([]));
  }, [user]);

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

      {logs.length === 0 ? (
        <EmptyState message="ยังไม่มีประวัติการออกกำลังกาย" />
      ) : (
        <View style={{ gap: spacing[2] }}>
          {logs.map((entry) => {
            const isCheatRest = entry.source === 'cheat_rest_override';
            const isCompleted = !isCheatRest && entry.completionStatus === 'completed';
            return (
              <View
                key={entry.logDate}
                style={[
                  styles.logRow,
                  isCheatRest && styles.logRowCheatRest,
                  isCompleted && styles.logRowCompleted,
                ]}
              >
                <View style={styles.logStatusIcon}>
                  {isCheatRest && <IconDashedCircle size={18} color={colors.sand} />}
                  {!isCheatRest && entry.completionStatus === 'completed' && (
                    <IconCheck size={18} color={colors.sage} />
                  )}
                  {/* incomplete, non-cheat/rest days render icon-less — DESIGN.md §4.2 */}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={typography.body}>{dayLabel(entry.logDate)}</Text>
                  <Text style={typography.bodySm}>{statusLabel(entry)}</Text>
                </View>
                <Text style={styles.kcal}>{kcalLabel(entry)}</Text>
              </View>
            );
          })}
        </View>
      )}
    </ScreenContainer>
  );
}
