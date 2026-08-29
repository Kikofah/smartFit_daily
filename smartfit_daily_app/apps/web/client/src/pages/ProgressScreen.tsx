import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import type { WeightForecastSnapshot, WeightRecord } from '@smartfit/shared-types';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { StreakBadge } from '../components/StreakBadge';
import { EmptyState } from '../components/EmptyState';
import { api } from '../services/api';
import { colors, typography } from '../constants/theme';
import { progressScreenStyles as styles } from './styles';

/**
 * "ความคืบหน้า" tab — PLN-4, INT-1 · REQ-09/10, REQ-11 — mirrors v1/10-progress-insights.html.
 * Weight/calorie charts: DESIGN.md §4.4 — earth-tone palette only, real data line in
 * --color-clay (neutral, no up=bad/down=good coloring), target line/band in --color-sage
 * @ ~30% opacity, never a red/green traffic-light scheme for body data.
 */

// TODO(INT-1, api-spec.md §"ดูพยากรณ์เป้าหมายน้ำหนัก"): GET /api/insights/forecast only
// returns { forecastedGoalDate, averageDailyDeficitKcal } — there is no documented endpoint
// yet for the underlying WeightRecord history a trend chart needs, and the route itself
// (apps/web/server/routes/insights-forecast/index.ts) doesn't compute the snapshot yet either.
// Until both exist, the trend line below is a small realistic mock dataset; only the forecast
// date/deficit/current-weight numbers attempt the real endpoint first.
const MOCK_WEIGHT_HISTORY: WeightRecord[] = [
  { id: 'mock-1', userProfileId: 'mock', weightKg: 72.1, recordedAt: daysAgoIso(56), source: 'manual' },
  { id: 'mock-2', userProfileId: 'mock', weightKg: 71.6, recordedAt: daysAgoIso(46), source: 'manual' },
  { id: 'mock-3', userProfileId: 'mock', weightKg: 70.9, recordedAt: daysAgoIso(35), source: 'smart_scale_sync' },
  { id: 'mock-4', userProfileId: 'mock', weightKg: 71.3, recordedAt: daysAgoIso(25), source: 'manual' },
  { id: 'mock-5', userProfileId: 'mock', weightKg: 70.2, recordedAt: daysAgoIso(14), source: 'smart_scale_sync' },
  { id: 'mock-6', userProfileId: 'mock', weightKg: 69.1, recordedAt: daysAgoIso(6), source: 'manual' },
  { id: 'mock-7', userProfileId: 'mock', weightKg: 68.4, recordedAt: daysAgoIso(0), source: 'smart_scale_sync' },
];
const MOCK_TARGET_WEIGHT_KG = 64;

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function formatThaiDate(iso: string): string {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const d = new Date(iso);
  const buddhistYear = d.getFullYear() + 543;
  return `${d.getDate()} ${months[d.getMonth()]} ${buddhistYear}`;
}

const CHART_WIDTH = 340;
const CHART_HEIGHT = 180;
const CHART_PAD_X = 20;
const CHART_TOP = 40;
const CHART_BOTTOM = 100;

function buildChartGeometry(history: WeightRecord[], targetWeightKg: number) {
  const weights = history.map((r) => r.weightKg);
  const minW = Math.min(...weights, targetWeightKg);
  const maxW = Math.max(...weights, targetWeightKg);
  const span = Math.max(maxW - minW, 0.1);
  const toY = (w: number) => CHART_TOP + ((maxW - w) / span) * (CHART_BOTTOM - CHART_TOP);
  const stepX = (CHART_WIDTH - CHART_PAD_X * 2) / Math.max(history.length - 1, 1);
  const points = history.map((r, i) => ({ x: CHART_PAD_X + i * stepX, y: toY(r.weightKg) }));
  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const targetY = toY(targetWeightKg);
  const lastPoint = points[points.length - 1]!; // history is a non-empty const mock dataset
  return { points, polyline, targetY, lastPoint };
}

export default function ProgressScreen() {
  const navigate = useNavigate();
  const [forecast, setForecast] = useState<WeightForecastSnapshot | null>(null);
  const [currentWeightKg, setCurrentWeightKg] = useState<number | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get<{ currentStreakDays: number }>('/streak')
      .then((snapshot) => {
        if (!cancelled) setStreakDays(snapshot?.currentStreakDays ?? 0);
      })
      .catch(() => {
        /* streak stays 0 — neutral default per DESIGN.md §3.6 */
      });

    // Real endpoint per api-spec.md; returns 422 when there's no target weight yet or not
    // enough accumulated daily_log history (minimum day count is an open point — see
    // api-spec.md §4, item 3). Either case is treated as the "insufficient data" state below.
    api
      .get<WeightForecastSnapshot | null>('/insights/forecast')
      .then((snapshot) => {
        if (cancelled) return;
        if (snapshot?.forecastedGoalDate) {
          setForecast(snapshot);
          setHasEnoughData(true);
          setCurrentWeightKg(MOCK_WEIGHT_HISTORY[MOCK_WEIGHT_HISTORY.length - 1]!.weightKg);
        }
      })
      .catch(() => {
        /* 422 (no target weight / not enough logs) -> stays the insufficient-data state */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const geometry = useMemo(
    () => buildChartGeometry(MOCK_WEIGHT_HISTORY, MOCK_TARGET_WEIGHT_KG),
    [],
  );

  return (
    <ScreenContainer style={{ paddingTop: 24, gap: 24 }}>
      <View style={styles.headerRow}>
        <Text style={typography.h1}>ความคืบหน้า</Text>
        <StreakBadge days={streakDays} />
      </View>

      {/* Sub-tabs within this tab: ภาพรวม (this screen) / ประวัติ (pushed route). */}
      <View style={styles.subTabs}>
        <View style={[styles.subTab, styles.subTabActive]}>
          <Text style={[typography.body, styles.subTabLabelActive]}>ภาพรวม</Text>
        </View>
        <Pressable style={styles.subTab} onPress={() => navigate('/log-history')}>
          <Text style={[typography.body, styles.subTabLabel]}>ประวัติ</Text>
        </Pressable>
      </View>

      {hasEnoughData && forecast ? (
        <>
          <Card style={styles.forecastCard}>
            <Text style={[typography.caption, styles.center]}>คาดว่าจะถึงเป้าหมายน้ำหนัก</Text>
            <Text style={[typography.display, styles.center, styles.forecastDate]}>
              {formatThaiDate(forecast.forecastedGoalDate)}
            </Text>
            <Text style={[typography.bodySm, styles.center]}>
              คำนวณจากอัตราขาดดุลแคลอรี่เฉลี่ยที่บันทึกจริงย้อนหลัง
            </Text>
            <View style={styles.forecastStats}>
              <View style={styles.forecastStat}>
                <Text style={typography.caption}>อัตราขาดดุลเฉลี่ย</Text>
                <Text style={typography.h3}>≈ {Math.round(forecast.averageDailyDeficitKcal)} kcal/วัน</Text>
              </View>
              <View style={styles.forecastStat}>
                <Text style={typography.caption}>น้ำหนักปัจจุบัน</Text>
                <Text style={typography.h3}>{currentWeightKg?.toFixed(1)} กก.</Text>
              </View>
            </View>
          </Card>

          <View>
            <Text style={[typography.h2, styles.chartTitle]}>แนวโน้มน้ำหนัก</Text>
            <svg
              width="100%"
              height={CHART_HEIGHT}
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* target band + line, sage @ ~30% opacity — DESIGN.md §4.4 */}
              <polygon
                points={`${CHART_PAD_X},${geometry.targetY - 15} ${CHART_WIDTH - CHART_PAD_X},${geometry.targetY - 25} ${CHART_WIDTH - CHART_PAD_X},${geometry.targetY + 15} ${CHART_PAD_X},${geometry.targetY + 25}`}
                fill={colors.sage}
                fillOpacity={0.3}
              />
              <line
                x1={CHART_PAD_X}
                y1={geometry.targetY}
                x2={CHART_WIDTH - CHART_PAD_X}
                y2={geometry.targetY}
                stroke={colors.sage}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              {/* actual data line: neutral clay, no red/green value judgment on ups/downs */}
              <polyline
                points={geometry.polyline}
                fill="none"
                stroke={colors.clay}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={geometry.lastPoint.x} cy={geometry.lastPoint.y} r={4} fill={colors.clay} />
              <line
                x1={CHART_PAD_X}
                y1={160}
                x2={CHART_WIDTH - CHART_PAD_X}
                y2={160}
                stroke={colors.border}
                strokeWidth={1}
              />
              <text x={CHART_PAD_X} y={176} fontSize={11} fill={colors.inkFaint}>
                8 สัปดาห์ก่อน
              </text>
              <text x={CHART_WIDTH - CHART_PAD_X - 50} y={176} fontSize={11} fill={colors.inkFaint}>
                วันนี้
              </text>
            </svg>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: colors.clay }]} />
                <Text style={typography.caption}>น้ำหนักจริง</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: colors.sage, opacity: 0.6 }]} />
                <Text style={typography.caption}>แนวโน้มเป้าหมาย</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <EmptyState
          message="ยังต้องบันทึกผลอีกสักระยะก่อนเริ่มพยากรณ์ได้ — ระบบต้องมีประวัติการบันทึกผลรายวันสะสมพอสมควรก่อนจึงจะคำนวณวันที่คาดว่าจะถึงเป้าหมายได้แม่นยำ"
          actionLabel="ไปบันทึกผลวันนี้"
          onAction={() => navigate('/planner')}
        />
      )}
    </ScreenContainer>
  );
}
