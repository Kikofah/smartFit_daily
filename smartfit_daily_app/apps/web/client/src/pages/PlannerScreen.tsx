import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Switch } from '../components/Switch';
import { IconCheck, IconDashedCircle } from '../components/Icon';
import { colors, spacing, typography } from '../constants/theme';
import type { ActivityPlanType } from '@smartfit/shared-types';
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
 *
 * TODO: this screen is currently driven by local mock state matching the
 * canonical example week (Mon 24 Aug 2026 - Sun 30 Aug 2026, today = Thu 27
 * Aug 2026) used by test cases TC-PLN-1-001..003/TC-PLN-2-001..005/TC-PLN-4-001,
 * since GET /api/planner/week (apps/web/server/routes/planner-day-status/index.ts)
 * is still a stub that just dumps the raw weeklyPlanEntries collection without
 * merging in dailyLogs or the derived isReadOnly flag. Wire this screen to:
 *  - `GET /planner/week` to load the week (docs/02-design/02-technical/api-spec.md §3.5)
 *  - `PUT /planner/days/{date}` to save an activity-type choice
 *  - `POST /planner/days/{date}/cheat-rest` / `DELETE .../cheat-rest` for the toggle
 */

type DayStatusValue = 'completed' | 'cheatrest' | 'missed' | 'none';

interface DayPlan {
  date: string; // ISO-8601 date
  shortLabel: string; // single/double Thai letter used inside the day cell
  fullLabel: string; // full day name shown as the day-detail sheet title
  dayNum: number;
  isToday: boolean;
  isPast: boolean;
  status: DayStatusValue;
  activityType?: ActivityPlanType;
}

// Canonical example week, matching v1/08-weekly-planner.html exactly.
const INITIAL_WEEK: DayPlan[] = [
  {
    date: '2026-08-24',
    shortLabel: 'จ',
    fullLabel: 'จันทร์ 24 ส.ค.',
    dayNum: 24,
    isToday: false,
    isPast: true,
    status: 'missed', // has a log (260 kcal, ไม่ครบเป้าหมาย) -- see 09-log-history.html
    activityType: 'cardio',
  },
  {
    date: '2026-08-25',
    shortLabel: 'อ',
    fullLabel: 'อังคาร 25 ส.ค.',
    dayNum: 25,
    isToday: false,
    isPast: true,
    status: 'completed',
    activityType: 'strength',
  },
  {
    date: '2026-08-26',
    shortLabel: 'พ',
    fullLabel: 'พุธ 26 ส.ค.',
    dayNum: 26,
    isToday: false,
    isPast: true,
    status: 'cheatrest',
    activityType: undefined,
  },
  {
    date: '2026-08-27',
    shortLabel: 'พฤ',
    fullLabel: 'พฤหัสบดี 27 ส.ค. (วันนี้)',
    dayNum: 27,
    isToday: true,
    isPast: false,
    status: 'none',
    activityType: undefined,
  },
  {
    date: '2026-08-28',
    shortLabel: 'ศ',
    fullLabel: 'ศุกร์ 28 ส.ค.',
    dayNum: 28,
    isToday: false,
    isPast: false,
    status: 'none',
    activityType: undefined,
  },
  {
    date: '2026-08-29',
    shortLabel: 'ส',
    fullLabel: 'เสาร์ 29 ส.ค.',
    dayNum: 29,
    isToday: false,
    isPast: false,
    status: 'none',
    activityType: undefined,
  },
  {
    date: '2026-08-30',
    shortLabel: 'อา',
    fullLabel: 'อาทิตย์ 30 ส.ค.',
    dayNum: 30,
    isToday: false,
    isPast: false,
    status: 'none',
    activityType: undefined,
  },
];

const ACTIVITY_CHIPS: { label: string; value: ActivityPlanType | undefined }[] = [
  { label: 'คาร์ดิโอ', value: 'cardio' },
  { label: 'เวทเทรนนิ่ง', value: 'strength' },
  { label: 'HIIT', value: 'hiit' },
  { label: 'ปล่อยว่าง (แนะนำอัตโนมัติ)', value: undefined },
];

function isReadOnlyDay(day: DayPlan): boolean {
  return day.isPast && day.status !== 'none';
}

export default function PlannerScreen() {
  const navigate = useNavigate();
  const [days, setDays] = useState<DayPlan[]>(INITIAL_WEEK);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [draftActivity, setDraftActivity] = useState<ActivityPlanType | undefined>(undefined);
  const [draftCheat, setDraftCheat] = useState(false);

  const openDay = days.find((d) => d.date === openDate) ?? null;
  const readOnly = openDay ? isReadOnlyDay(openDay) : false;

  function openSheet(day: DayPlan) {
    setOpenDate(day.date);
    setDraftActivity(day.activityType);
    setDraftCheat(day.status === 'cheatrest');
  }

  function closeSheet() {
    setOpenDate(null);
  }

  function handleSave() {
    if (!openDate || readOnly) {
      closeSheet();
      return;
    }
    setDays((prev) =>
      prev.map((d) =>
        d.date === openDate
          ? { ...d, activityType: draftActivity, status: draftCheat ? 'cheatrest' : 'none' }
          : d,
      ),
    );
    closeSheet();
  }

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 24 }}>
      <View style={{ gap: 4 }}>
        <Text style={[typography.caption]}>แผนออกกำลังกาย</Text>
        <Text style={typography.h1}>24 - 30 ส.ค. 2026</Text>
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
                <Text style={typography.bodySm}>หยุดนับเป้าหมายแคลอรี่ของวันนี้ streak ไม่ขาด</Text>
              </View>
              <Switch value={draftCheat} onValueChange={setDraftCheat} disabled={readOnly} />
            </View>

            <Button
              label={readOnly ? 'บันทึก (ปิดใช้งาน)' : 'บันทึก'}
              onPress={handleSave}
              disabled={readOnly}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}
