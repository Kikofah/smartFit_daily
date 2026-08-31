import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

export const equipmentScreenStyles = StyleSheet.create({
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  errorText: { ...typography.caption, color: colors.danger, marginTop: spacing[2] },
});

export const goalConfirmScreenStyles = StyleSheet.create({
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] },
  summaryCard: { backgroundColor: colors.paperAlt, borderRadius: radius.lg, padding: spacing[6], alignItems: 'center' },
  targetNumber: { fontSize: 44, lineHeight: 52, fontWeight: '600', color: colors.clay, marginVertical: spacing[2] },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  secondaryCard: {
    backgroundColor: colors.paperAlt,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorText: { ...typography.caption, color: colors.danger, marginTop: spacing[1] },
});

export const personalInfoScreenRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.paperAlt,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: { borderColor: colors.clay },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioOuterSelected: { borderColor: colors.clay },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.clay },
});

export const personalInfoScreenStyles = StyleSheet.create({
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] },
  groupLabel: { ...typography.h3, marginBottom: spacing[2] },
  errorText: { ...typography.caption, color: colors.danger, marginTop: spacing[1] },
});

export const goalSelectScreenStyles = StyleSheet.create({
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: colors.paperAlt,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  goalCardSelected: { borderColor: colors.clay },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    flexShrink: 0,
  },
  radioOuterSelected: { borderColor: colors.clay },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.clay },
});
