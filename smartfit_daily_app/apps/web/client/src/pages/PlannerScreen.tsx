import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Switch } from '../components/Switch';
import { IconCheck, IconDashedCircle } from '../components/Icon';
import { api } from '../services/api';
import { useAuth } from '../store/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { colors, spacing, typography } from '../constants/theme';
import type { ActivityPlanType, LogCompletionStatus } from '@smartfit/shared-types';
import { plannerScreenStyles as styles } from './styles';

/**
 * "แผน" tab — PLN-1, PLN-2 · REQ-08, REQ-09 — mirrors v1/08-weekly-planner.html
 * (see that file's header comment for the resolved product decisions this
 * screen must implement faithfully, in particular the read-only rule below).
 *
 * Day cell status (icon + color, never color alone — DESIGN.md §4.2/§4.3):
 *  - 'completed'  -> sage checkmark
 *  - 'cheatrest'  -> sand dashed circle
 *  - 'missed'/'none' -> no icon, plain neutral background (never a red/negative icon)
 *
 * Read-only rule (resolved 2026-08-27, see the prototype's header comment):
 * a day is read-only when `isPast && status !== 'none'` — any past day that
 * already has a log (completed, missed, or cheat/rest) is locked; only
 * today/future days, or a past day with genuinely no log yet, stay editable.
 * The Cheat/Rest toggle is stricter still (detailed-design/03-planner-logging.md's
 * PLN-2 algorithm step 1) — it rejects ANY past day outright, log or not.
 */

type DayStatusValue = 'completed' | 'cheatrest' | 'missed' | 'none';

interface DayPlan {
  date: string; // ISO-8601 date
  shortLabel: string; // single/double Thai letter used inside the day cell
  fullLabel: string; // full day name shown as the day-detail sheet title
  dayNum: number;
  isToday: boolean;
  isPast: boolean;
  isReadOnly: boolean; // server-derived (planDate < today AND a dailyLog exists)
  status: DayStatusValue;
  activityType?: ActivityPlanType;
}

/** GET /planner/week's response shape (apps/web/server/routes/planner-day-status/index.ts). */
interface PlannerDayEntry {
  planDate: string;
  plannedActivityType?: ActivityPlanType;
  isDefaultAuto: boolean;
  isReadOnly: boolean;
  isCheatRest: boolean;
  completionStatus?: LogCompletionStatus;
}

const THAI_DAY_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']; // index = Date.getDay()

function deriveStatus(entry: PlannerDayEntry): DayStatusValue {
  if (entry.isCheatRest) return 'cheatrest';
  if (entry.completionStatus === 'completed') return 'completed';
  if (entry.completionStatus === 'incomplete') return 'missed';
  return 'none';
}

function toDayPlan(entry: PlannerDayEntry, todayIso: string): DayPlan {
  const date = new Date(`${entry.planDate}T00:00:00`);
  const isToday = entry.planDate === todayIso;
  return {
    date: entry.planDate,
    shortLabel: THAI_DAY_SHORT[date.getDay()]!,
    fullLabel:
      date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' }) +
      (isToday ? ' (วันนี้)' : ''),
    dayNum: date.getDate(),
    isToday,
    isPast: entry.planDate < todayIso,
    isReadOnly: entry.isReadOnly,
    status: deriveStatus(entry),
    activityType: entry.plannedActivityType,
  };
}

function weekRangeCaption(days: DayPlan[]): string {
  if (days.length === 0) return '';
  const first = new Date(`${days[0]!.date}T00:00:00`);
  const last = new Date(`${days[days.length - 1]!.date}T00:00:00`);
  const endLabel = last.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  return `${first.getDate()} - ${endLabel} ${last.getFullYear()}`;
}

const ACTIVITY_CHIPS: { label: string; value: ActivityPlanType | undefined }[] = [
  { label: 'คาร์ดิโอ', value: 'cardio' },
  { label: 'เวทเทรนนิ่ง', value: 'strength' },
  { label: 'HIIT', value: 'hiit' },
  { label: 'ปล่อยว่าง (แนะนำอัตโนมัติ)', value: undefined },
];

export default function PlannerScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const goalKcal = profile?.goalSelection?.dailyCalorieTargetKcal;
  const [days, setDays] = useState<DayPlan[]>([]);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [draftActivity, setDraftActivity] = useState<ActivityPlanType | undefined>(undefined);
  const [draftCheat, setDraftCheat] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDay = days.find((d) => d.date === openDate) ?? null;
  const readOnly = openDay?.isReadOnly ?? false;
  const cheatRestReadOnly = openDay?.isPast ?? false;

  async function loadWeek() {
    const todayIso = new Date().toISOString().slice(0, 10);
    const entries = await api.get<PlannerDayEntry[]>('/planner/week');
    setDays(entries.map((entry) => toDayPlan(entry, todayIso)));
  }

  useEffect(() => {
    // Wait for Firebase Auth to finish restoring the session (see api.ts —
    // it reads auth.currentUser synchronously) before fetching.
    if (!user) return;
    loadWeek().catch(() => setDays([]));
  }, [user]);

  function openSheet(day: DayPlan) {
    setOpenDate(day.date);
    setDraftActivity(day.activityType);
    setDraftCheat(day.status === 'cheatrest');
    setError(null);
  }

  function closeSheet() {
    setOpenDate(null);
  }

  async function handleSave() {
    if (!openDate || !openDay || readOnly) {
      closeSheet();
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await api.put(`/planner/days/${openDate}`, { plannedActivityType: draftActivity });

      const wasCheatRest = openDay.status === 'cheatrest';
      if (draftCheat && !wasCheatRest) {
        await api.post(`/planner/days/${openDate}/cheat-rest`);
      } else if (!draftCheat && wasCheatRest) {
        await api.delete(`/planner/days/${openDate}/cheat-rest`);
      }

      await loadWeek();
      closeSheet();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 24 }}>
      <View style={{ gap: 4 }}>
        <Text style={[typography.caption]}>แผนออกกำลังกาย</Text>
        <Text style={typography.h1}>{weekRangeCaption(days) || 'กำลังโหลด...'}</Text>
      </View>

      <View style={styles.weekGrid}>
        {days.map((day) => (
          <Pressable
            key={day.date}
            onPress={() => openSheet(day)}
            style={[styles.dayCell, day.isToday && styles.dayCellToday]}
            accessibilityRole="button"
            accessibilityLabel={day.fullLabel}
          >
            <Text style={styles.dayLabel}>{day.shortLabel}</Text>
            <Text style={styles.dayNum}>{day.dayNum}</Text>
            <View style={styles.dayIcon}>
              {day.status === 'completed' && <IconCheck size={16} color={colors.sage} />}
              {day.status === 'cheatrest' && <IconDashedCircle size={16} color={colors.sand} />}
            </View>
            {goalKcal !== undefined && <Text style={styles.dayKcal}>{goalKcal}{'\n'}kcal</Text>}
          </Pressable>
        ))}
      </View>

      <View style={{ gap: spacing[2] }}>
        <View style={styles.legendRow}>
          <View style={styles.legendSwatch}>
            <IconCheck size={14} color={colors.sage} />
          </View>
          <Text style={typography.bodySm}>ครบเป้าหมาย</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendSwatch}>
            <IconDashedCircle size={14} color={colors.sand} />
          </View>
          <Text style={typography.bodySm}>Cheat Day / Rest Day</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendSwatch} />
          <Text style={typography.bodySm}>ยังไม่ถึงวัน / ยังไม่ครบเป้าหมาย</Text>
        </View>
      </View>

      <Text style={typography.caption}>แตะวันใดก็ได้เพื่อดูหรือกำหนดแผนของวันนั้น</Text>

      <Button label="ดูประวัติ log" variant="ghost" onPress={() => navigate('/log-history')} />

      {openDay && (
        <>
          <Pressable
            onPress={closeSheet}
            style={styles.scrim}
            accessibilityRole="button"
            accessibilityLabel="ปิด"
          />
          <View style={styles.sheet} accessibilityRole="none" aria-modal>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetTitleRow}>
              <Text style={typography.h2}>{openDay.fullLabel}</Text>
              <Button label="ปิด" variant="ghost" onPress={closeSheet} />
            </View>

            {readOnly && (
              <View style={styles.readonlyCaption}>
                <Text style={typography.body}>ผ่านมาแล้วและมี log อยู่แล้ว เปิดดูได้อย่างเดียว (read-only)</Text>
              </View>
            )}

            <Text style={typography.caption}>ประเภทกิจกรรม</Text>
            <View style={styles.activityOptions}>
              {ACTIVITY_CHIPS.map((chip) => (
                <Chip
                  key={chip.label}
                  label={chip.label}
                  selected={draftActivity === chip.value}
                  disabled={readOnly}
                  onPress={() => setDraftActivity(chip.value)}
                />
              ))}
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={typography.body}>Cheat Day / Rest Day</Text>
                <Text style={typography.bodySm}>
                  {cheatRestReadOnly
                    ? 'ตั้ง Cheat Day / Rest Day ย้อนหลังไม่ได้'
                    : 'หยุดนับเป้าหมายแคลอรี่ของวันนี้ streak ไม่ขาด'}
                </Text>
              </View>
              <Switch value={draftCheat} onValueChange={setDraftCheat} disabled={cheatRestReadOnly} />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              label={readOnly ? 'บันทึก (ปิดใช้งาน)' : isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
              onPress={handleSave}
              disabled={readOnly || isSaving}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}
