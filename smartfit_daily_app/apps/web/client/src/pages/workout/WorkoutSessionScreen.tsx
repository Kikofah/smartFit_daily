import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { IconPlay } from '../../components/Icon';
import { api } from '../../services/api';
import { workoutDraft } from '../../store/workoutDraft';
import { colors, spacing, typography } from '../../constants/theme';
import { workoutSessionScreenStyles as styles } from './styles';
import type { ActivityType, Intensity } from '@smartfit/shared-types';

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_PLAYER_ELEMENT_ID = 'workout-session-youtube-player';

/** Loads the YouTube IFrame Player API script once (no-op if already loaded/loading). */
function loadYouTubeIframeApi(): Promise<typeof YT> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT!);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }
  });
}

const INTENSITY_LABEL: Record<Intensity, string> = {
  low: 'ความเข้มข้นต่ำ',
  medium: 'ความเข้มข้นปานกลาง',
  high: 'ความเข้มข้นสูง',
};

/** kcal = MET × น้ำหนักตัว(kg) × เวลา(ชม.) per REQ-05. Illustrative MET table pending the real REC-2 reference. */
const MET_TABLE: Record<ActivityType, Record<Intensity, number>> = {
  cardio: { low: 4, medium: 6, high: 8 },
  strength: { low: 3, medium: 4.5, high: 6 },
  hiit: { low: 6, medium: 8, high: 10 },
};

type Stage = 'warmup' | 'main' | 'cooldown';
const STAGE_ORDER: Stage[] = ['warmup', 'main', 'cooldown'];
const WARMUP_MINUTES = 3;
const COOLDOWN_MINUTES = 3;

function formatElapsed(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * REC-1, REC-3 · REQ-04, REQ-06 — mirrors v1/06-workout-session.html.
 * Immersive screen (no bottom tab nav). Shows a warmup->main->cooldown stage
 * track only when the video's intensity is "high" (REC-4).
 */
export default function WorkoutSessionScreen() {
  const navigate = useNavigate();
  const video = workoutDraft.video;
  const [elapsedSec, setElapsedSec] = useState(0);
  const [warmupSkipped, setWarmupSkipped] = useState(false);
  // No real video (mock/fallback) still ticks like a plain timer; a real
  // YouTube video starts "not yet confirmed playing" until its first
  // onStateChange(PLAYING) event, so autoplay starting up doesn't fake time.
  const [isPlaying, setIsPlaying] = useState(!video?.externalVideoId);
  const playerRef = useRef<YT.Player | null>(null);

  // Elapsed time only ticks while the video is actually playing — pauses the
  // moment the user pauses the embedded YouTube player, resumes on play.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    if (!video?.externalVideoId) return;
    let cancelled = false;
    loadYouTubeIframeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(YOUTUBE_PLAYER_ELEMENT_ID, {
        width: '100%',
        height: '100%',
        videoId: video.externalVideoId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) setIsPlaying(false);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [video?.externalVideoId]);

  useEffect(() => {
    if (!video) navigate('/', { replace: true });
  }, [video, navigate]);

  if (!video) return null;

  const hasStages = video.intensity === 'high';
  const effectiveElapsedSec = warmupSkipped ? Math.max(elapsedSec, WARMUP_MINUTES * 60) : elapsedSec;
  const elapsedMin = effectiveElapsedSec / 60;

  let stage: Stage = 'main';
  if (hasStages) {
    if (elapsedMin < WARMUP_MINUTES) stage = 'warmup';
    else if (elapsedMin < WARMUP_MINUTES + video.durationMinutes) stage = 'main';
    else stage = 'cooldown';
  }
  const STAGE_LABEL: Record<Stage, string> = { warmup: 'วอร์มอัพ', main: 'หลัก', cooldown: 'คูลดาวน์' };
  const stageLabel = STAGE_LABEL[stage];

  function handleSkipWarmup() {
    setWarmupSkipped(true);
  }

  function handleFinish() {
    const actualDurationMinutes = Math.max(1, Math.round(effectiveElapsedSec / 60));
    const metValue = MET_TABLE[video!.activityType][video!.intensity]!;
    const calculatedKcal = Math.round(metValue * (workoutDraft.weightKg ?? 60) * (actualDurationMinutes / 60));

    if (workoutDraft.sessionId) {
      // Optimistic: feedback within 250ms (NFR-02) — don't block navigation on this round trip.
      api
        .post(`/workouts/sessions/${workoutDraft.sessionId}/complete`, { actualDurationMinutes, metValue, calculatedKcal })
        .catch(() => {});
    }
    navigate('/workout/result', { replace: true, state: { calculatedKcal } });
  }

  return (
    <ScreenContainer style={{ paddingTop: spacing[6], gap: 0 }}>
      <View style={styles.closeBar}>
        <Button label="✕  ปิด" variant="ghost" onPress={() => navigate(-1)} />
      </View>

      <Text style={[typography.caption, { textAlign: 'center', marginBottom: spacing[4] }]}>
        {video.title} · {INTENSITY_LABEL[video.intensity]}
      </Text>

      <View style={styles.playerArea}>
        {video.externalVideoId ? (
          <div id={YOUTUBE_PLAYER_ELEMENT_ID} style={{ width: '100%', height: '100%' }} />
        ) : (
          <IconPlay size={56} color={colors.paperAlt} />
        )}
      </View>

      {hasStages && (
        <View style={styles.stageTrack}>
          {STAGE_ORDER.map((s, i) => {
            const isDone = STAGE_ORDER.indexOf(stage) > i;
            const isCurrent = stage === s;
            const minutes = s === 'warmup' ? WARMUP_MINUTES : s === 'cooldown' ? COOLDOWN_MINUTES : video.durationMinutes;
            return (
              <View key={s} style={styles.stageStep}>
                <View style={[styles.stageDot, isDone && styles.stageDotDone, isCurrent && styles.stageDotCurrent]} />
                <Text style={[typography.caption, styles.stageLabel, isCurrent && styles.stageLabelCurrent]}>
                  {STAGE_LABEL[s]}
                  {'\n'}
                  {minutes} นาที
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={{ alignItems: 'center', marginBottom: spacing[8] }}>
        <Text style={typography.display}>{formatElapsed(effectiveElapsedSec)}</Text>
        <Text style={typography.bodySm}>เวลาที่ทำไปแล้ว · ช่วงปัจจุบัน: {stageLabel}</Text>
      </View>

      {hasStages && stage === 'warmup' && (
        <View style={{ alignItems: 'center', marginBottom: spacing[4] }}>
          <Button label="ข้ามวอร์มอัพ" variant="ghost" onPress={handleSkipWarmup} />
        </View>
      )}

      <Button label="จบเซสชัน" onPress={handleFinish} />
    </ScreenContainer>
  );
}
