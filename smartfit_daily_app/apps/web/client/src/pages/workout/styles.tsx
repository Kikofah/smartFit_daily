import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

export const workoutSessionScreenStyles = StyleSheet.create({
  closeBar: { alignItems: 'flex-start', marginBottom: spacing[4] },
  playerArea: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  stageTrack: { flexDirection: 'row', gap: spacing[2], marginBottom: spacing[6] },
  stageStep: { flex: 1, alignItems: 'center', gap: spacing[2] },
  stageDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.paperSunken, borderWidth: 1, borderColor: colors.borderStrong },
  stageDotDone: { backgroundColor: colors.sage, borderColor: colors.sage },
  stageDotCurrent: { backgroundColor: colors.clay, borderColor: colors.clay },
  stageLabel: { textAlign: 'center' },
  stageLabelCurrent: { color: colors.ink, fontWeight: '500' },
});

export const workoutResultScreenStyles = StyleSheet.create({
  statusPanel: {
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.paperAlt,
    borderRadius: radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  kcalDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[2],
  },
});
