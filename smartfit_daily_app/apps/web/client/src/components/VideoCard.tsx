import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { Button } from './Button';
import { IconPlay } from './Icon';

interface VideoCardProps {
  /** YouTube video ID (REC-1/REC-4) — when present, shows the real YouTube thumbnail behind the play icon. */
  externalVideoId?: string;
  title: string;
  durationLabel: string;
  activityTypeLabel: string;
  kcalLabel: string;
  includesWarmupCooldown?: boolean;
  onStart: () => void;
  onChangeVideo: () => void;
  /** REC-3 — swap request in flight; shows a spinner and blocks repeat presses. */
  isChangingVideo?: boolean;
}

/** DESIGN.md §3.3 — Video Recommendation Card (REC-1/REC-3/REC-4). */
export function VideoCard({
  externalVideoId,
  title,
  durationLabel,
  activityTypeLabel,
  kcalLabel,
  includesWarmupCooldown,
  onStart,
  onChangeVideo,
  isChangingVideo,
}: VideoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        {externalVideoId && (
          <Image
            source={{ uri: `https://img.youtube.com/vi/${externalVideoId}/hqdefault.jpg` }}
            style={styles.thumbImage}
            resizeMode="cover"
          />
        )}
        {externalVideoId ? (
          <View style={styles.playBackdrop}>
            <IconPlay size={32} color={colors.paper} />
          </View>
        ) : (
          <IconPlay size={40} color={colors.inkFaint} />
        )}
        {includesWarmupCooldown && (
          <View style={styles.warmupTag}>
            <Text style={styles.warmupTagText}>รวมวอร์มอัพ-คูลดาวน์</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={typography.h3}>{title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{durationLabel}</Text>
          <Text style={styles.metaText}>·</Text>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>{activityTypeLabel}</Text>
          </View>
          <Text style={styles.metaText}>{kcalLabel}</Text>
        </View>
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <Button label="เริ่มออกกำลังกาย" onPress={onStart} />
          </View>
          <Button
            label="เปลี่ยนวิดีโอ"
            variant="secondary"
            onPress={onChangeVideo}
            loading={isChangingVideo}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paperAlt, borderRadius: radius.lg, overflow: 'hidden' },
  thumb: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.paperSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: { ...StyleSheet.absoluteFillObject },
  playBackdrop: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(51,48,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warmupTag: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    backgroundColor: 'rgba(51,48,42,0.55)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  warmupTagText: { fontSize: 11, color: '#fff' },
  body: { padding: spacing[4], gap: spacing[2] },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' },
  metaText: { ...typography.bodySm, color: colors.inkMuted },
  tagPill: { backgroundColor: colors.paperSunken, borderRadius: radius.lg, paddingHorizontal: spacing[2], paddingVertical: 2 },
  tagPillText: { fontSize: 12, color: colors.inkMuted },
  actions: { flexDirection: 'row', gap: spacing[2], alignItems: 'center', marginTop: spacing[2] },
});
