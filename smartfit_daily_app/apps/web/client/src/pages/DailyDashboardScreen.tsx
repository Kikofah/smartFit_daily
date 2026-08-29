import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { CalorieRing } from '../components/CalorieRing';
import { VideoCard } from '../components/VideoCard';
import { StreakBadge } from '../components/StreakBadge';
import { IconDashedCircle } from '../components/Icon';
import { api } from '../services/api';
import { workoutDraft, type WorkoutVideoDraft } from '../store/workoutDraft';
import { colors, spacing, typography } from '../constants/theme';
import { dailyDashboardScreenStyles as styles } from './styles';
import type { UserProfile } from '@smartfit/shared-types';

/** Mock alternates for "เปลี่ยนวิดีโอ" — GET /workouts/today/recommendation/swap is still a 501 stub (YouTube Data API pending). */
const MOCK_RECOMMENDATIONS: WorkoutVideoDraft[] = [
  {
    title: 'คาร์ดิโอเผาผลาญเบา ๆ 25 นาที',
    durationMinutes: 25,
    activityType: 'cardio',
    activityTypeLabel: 'คาร์ดิโอ',
    intensity: 'medium',
    estimatedKcal: 210,
    includesWarmupCooldown: true,
  },
  {
    title: 'เวทเทรนนิ่งทั้งตัว 30 นาที',
    durationMinutes: 30,
    activityType: 'strength',
    activityTypeLabel: 'เวทเทรนนิ่ง',
    intensity: 'medium',
    estimatedKcal: 230,
    includesWarmupCooldown: false,
  },
  {
    title: 'HIIT เผาผลาญไว 20 นาที',
    durationMinutes: 20,
    activityType: 'hiit',
    activityTypeLabel: 'HIIT',
    intensity: 'high',
    estimatedKcal: 240,
    includesWarmupCooldown: true,
  },
];

const TODAY_CAPTION = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' });

/**
 * "วันนี้" tab — REC-1, REC-3, PLN-2, PLN-4 · REQ-04, REQ-06, REQ-09, REQ-10 —
 * mirrors v1/05-daily-dashboard.html. GET /workouts/today/recommendation is
 * still a 501 stub (YouTube Data API integration pending), so the video card
 * falls back to a realistic mock recommendation cycle; everything else
 * (profile/goal, today's log, streak, Cheat/Rest Day toggle) is wired to the
 * real endpoints.
 */
export default function DailyDashboardScreen() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [goalKcal, setGoalKcal] = useState(0);
  const [accumulatedKcal, setAccumulatedKcal] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [isCheatRest, setIsCheatRest] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const [weightKg, setWeightKg] = useState(60);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    api
      .get<UserProfile>('/profile')
      .then((profile) => {
        setDisplayName(profile.displayName);
        setGoalKcal(profile.goalSelection?.dailyCalorieTargetKcal ?? 0);
        setWeightKg(profile.weightKg);
      })
      .catch(() => {});

    api
      .get<{ accumulatedKcal: number }>(`/logs/${today}`)
      .then((log) => setAccumulatedKcal(log.accumulatedKcal))
      .catch(() => setAccumulatedKcal(0));

    api
      .get<{ currentStreakDays: number }>('/streak')
      .then((s) => setStreakDays(s.currentStreakDays))
      .catch(() => {});
  }, []);

  const video = MOCK_RECOMMENDATIONS[videoIdx]!;

  function swapVideo() {
    setVideoIdx((i) => (i + 1) % MOCK_RECOMMENDATIONS.length);
  }

  async function setMode(cheatRest: boolean) {
    const today = new Date().toISOString().slice(0, 10);
    setIsCheatRest(cheatRest); // optimistic — feedback within 250ms per DESIGN.md §4.6, no waiting on the round trip
    try {
      if (cheatRest) {
        await api.post(`/planner/days/${today}/cheat-rest`);
        setAccumulatedKcal(goalKcal);
      } else {
        await api.delete(`/planner/days/${today}/cheat-rest`);
      }
    } catch {
      setIsCheatRest(!cheatRest); // roll back the optimistic toggle on failure
    }
  }

  async function handleStart() {
    const { sessionId } = await api.post<{ sessionId: string }>('/workouts/sessions');
    Object.assign(workoutDraft, {
      sessionId,
      video,
      weightKg,
      goalKcal,
      accumulatedKcalBeforeSession: accumulatedKcal,
    });
    navigate('/workout/session');
  }

  return (
    <ScreenContainer style={{ paddingTop: spacing[6], gap: 0 }}>
      <View style={styles.topBar}>
        <View>
          <Text style={typography.caption}>{TODAY_CAPTION}</Text>
          <Text style={typography.h1}>สวัสดี {displayName ?? 'ผู้ใช้งาน'}</Text>
        </View>
        <StreakBadge days={streakDays} />
      </View>

      <View style={styles.modeToggle}>
        <Pressable style={[styles.modeBtn, !isCheatRest && styles.modeBtnActive]} onPress={() => setMode(false)}>
          <Text style={[styles.modeLabel, !isCheatRest && styles.modeLabelActive]}>โหมดปกติ</Text>
        </Pressable>
        <Pressable style={[styles.modeBtn, isCheatRest && styles.modeBtnActive]} onPress={() => setMode(true)}>
          <Text style={[styles.modeLabel, isCheatRest && styles.modeLabelActive]}>Cheat Day วันนี้</Text>
        </Pressable>
      </View>

      <View style={{ marginBottom: spacing[8] }}>
        <CalorieRing
          valueKcal={accumulatedKcal}
          goalKcal={goalKcal}
          caption={isCheatRest ? 'Cheat/Rest Day — ถือว่าครบเป้าหมายแล้ว' : 'เป้าหมายแคลอรี่วันนี้'}
        />
      </View>

      {isCheatRest ? (
        <View style={styles.cheatPanel}>
          <IconDashedCircle size={40} color={colors.sage} />
          <Text style={typography.h3}>ครบเป้าหมายวันนี้แล้ว (Cheat/Rest Day)</Text>
          <Text style={[typography.bodySm, { textAlign: 'center' }]}>
            วันนี้ตั้งเป็น Cheat Day/Rest Day ไม่ต้องออกกำลังกายก็ได้ สถานะวันนี้นับว่าครบเป้าหมาย และ streak ยังต่อเนื่อง
          </Text>
        </View>
      ) : (
        <View>
          <VideoCard
            title={video.title}
            durationLabel={`${video.durationMinutes} นาที`}
            activityTypeLabel={video.activityTypeLabel}
            kcalLabel={`≈ ${video.estimatedKcal} kcal`}
            includesWarmupCooldown={video.includesWarmupCooldown}
            onStart={handleStart}
            onChangeVideo={swapVideo}
          />
          <Text style={[typography.caption, { marginTop: spacing[8] }]}>
            แคลอรี่เป้าหมายของวันนี้จะไม่เปลี่ยน แม้เปลี่ยนวิดีโอ
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
