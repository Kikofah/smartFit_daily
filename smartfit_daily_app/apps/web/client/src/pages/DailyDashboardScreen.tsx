import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { CalorieRing } from '../components/CalorieRing';
import { VideoCard } from '../components/VideoCard';
import { StreakBadge } from '../components/StreakBadge';
import { EmptyState } from '../components/EmptyState';
import { IconDashedCircle } from '../components/Icon';
import { api } from '../services/api';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../store/AuthContext';
import { workoutDraft, type WorkoutVideoDraft } from '../store/workoutDraft';
import { colors, spacing, typography } from '../constants/theme';
import { dailyDashboardScreenStyles as styles } from './styles';
import type { ActivityType } from '@smartfit/shared-types';

/** GET /workouts/today/recommendation's response shape (apps/web/server/routes/content-recommendation/index.ts). */
interface RecommendedVideo {
  externalVideoId: string;
  title: string;
  durationMinutes: number;
  activityType: ActivityType;
  intensity: WorkoutVideoDraft['intensity'];
  estimatedKcal: number;
  includesWarmupCooldown: boolean;
}

const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  cardio: 'คาร์ดิโอ',
  strength: 'เวทเทรนนิ่ง',
  hiit: 'HIIT',
};

const TODAY_CAPTION = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' });

/**
 * "วันนี้" tab — REC-1, REC-3, PLN-2, PLN-4 · REQ-04, REQ-06, REQ-09, REQ-10 —
 * mirrors v1/05-daily-dashboard.html. The video recommendation is picked by
 * the YouTube Data API (candidates) + Claude (ranking/estimation) server-side
 * — see server/services/youtube.ts and server/services/videoRecommender.ts.
 */
export default function DailyDashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [accumulatedKcal, setAccumulatedKcal] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [isCheatRest, setIsCheatRest] = useState(false);
  const [video, setVideo] = useState<RecommendedVideo | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isSwappingVideo, setIsSwappingVideo] = useState(false);

  const displayName = profile?.displayName ?? 'ผู้ใช้งาน';
  const goalKcal = profile?.goalSelection?.dailyCalorieTargetKcal ?? 0;
  const weightKg = profile?.weightKg ?? 60;

  useEffect(() => {
    // Wait for Firebase Auth to finish restoring the session (matters on a
    // hard refresh — api.ts reads auth.currentUser synchronously, so firing
    // before it resolves would silently send these requests unauthenticated.
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);

    api
      .get<{ accumulatedKcal: number }>(`/logs/${today}`)
      .then((log) => setAccumulatedKcal(log.accumulatedKcal))
      .catch(() => setAccumulatedKcal(0));

    api
      .get<{ currentStreakDays: number }>('/streak')
      .then((s) => setStreakDays(s.currentStreakDays))
      .catch(() => {});

    api
      .get<RecommendedVideo | undefined>('/workouts/today/recommendation')
      .then((v) => {
        if (v === undefined) {
          setIsCheatRest(true); // 204 — today is already a Cheat/Rest Day
          setVideo(null);
        } else {
          setVideo(v);
        }
      })
      .catch((e) => setVideoError((e as Error).message));
  }, [user]);

  async function swapVideo() {
    if (isSwappingVideo) return;
    setVideoError(null);
    setIsSwappingVideo(true);
    try {
      const next = await api.post<RecommendedVideo>('/workouts/today/recommendation/swap');
      setVideo(next);
    } catch (e) {
      setVideoError((e as Error).message);
    } finally {
      setIsSwappingVideo(false);
    }
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
    if (!video) return;
    const { sessionId } = await api.post<{ sessionId: string }>('/workouts/sessions');
    const videoDraft: WorkoutVideoDraft = {
      externalVideoId: video.externalVideoId,
      title: video.title,
      durationMinutes: video.durationMinutes,
      activityType: video.activityType,
      activityTypeLabel: ACTIVITY_TYPE_LABEL[video.activityType],
      intensity: video.intensity,
      estimatedKcal: video.estimatedKcal,
      includesWarmupCooldown: video.includesWarmupCooldown,
    };
    Object.assign(workoutDraft, {
      sessionId,
      video: videoDraft,
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
          <Text style={typography.h1}>สวัสดี {displayName}</Text>
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
      ) : video ? (
        <View>
          <VideoCard
            externalVideoId={video.externalVideoId}
            title={video.title}
            durationLabel={`${video.durationMinutes} นาที`}
            activityTypeLabel={ACTIVITY_TYPE_LABEL[video.activityType]}
            kcalLabel={`≈ ${video.estimatedKcal} kcal`}
            includesWarmupCooldown={video.includesWarmupCooldown}
            isChangingVideo={isSwappingVideo}
            onStart={handleStart}
            onChangeVideo={swapVideo}
          />
          <Text style={[typography.caption, { marginTop: spacing[8] }]}>
            แคลอรี่เป้าหมายของวันนี้จะไม่เปลี่ยน แม้เปลี่ยนวิดีโอ
          </Text>
        </View>
      ) : (
        <EmptyState message={videoError ?? 'กำลังหาวิดีโอที่เหมาะกับคุณ...'} />
      )}
    </ScreenContainer>
  );
}
