import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

export const plannerScreenStyles = StyleSheet.create({
  weekGrid: { flexDirection: 'row', gap: spacing[2] },
  dayCell: {
    flex: 1,
    minHeight: 76,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    backgroundColor: colors.paperAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: spacing[2],
  },
  // DESIGN.md §3.5 — the one exception where a border is thicker than 1px.
  dayCellToday: { borderWidth: 2, borderColor: colors.clay },
  dayLabel: { ...typography.caption, color: colors.inkMuted },
  dayNum: { ...typography.body, fontWeight: '500' },
  dayIcon: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  legendSwatch: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colors.paperAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrim: {
    position: 'fixed' as unknown as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(51,48,42,0.32)',
    zIndex: 20,
  },
  sheet: {
    position: 'fixed' as unknown as 'absolute',
    left: 0,
    right: 0,
    // TabsLayout's fixed bottom tab bar reserves this same spacing[16] (see
    // its own `content: {paddingBottom: spacing[16]}`) — floating the sheet
    // by the same amount keeps its Save button from landing underneath the
    // tab bar instead of overlapping it.
    bottom: spacing[16],
    maxWidth: 480,
    marginHorizontal: 'auto',
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    // DESIGN.md §2.4 — the one allowed use of --shadow-float, since a bottom
    // sheet genuinely floats above content.
    boxShadow: '0 2px 8px rgba(51,48,42,0.06)',
    zIndex: 21,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[3],
  } as unknown as import('react-native').ViewStyle,
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginHorizontal: 'auto',
    marginBottom: spacing[2],
  },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  readonlyCaption: {
    backgroundColor: colors.paperAlt,
    borderRadius: radius.md,
    padding: spacing[3],
  },
  activityOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  errorText: { ...typography.caption, color: colors.danger },
});

export const logHistoryScreenStyles = StyleSheet.create({
  subtabs: {
    flexDirection: 'row',
    gap: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subtab: {
    ...typography.body,
    fontWeight: '500',
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
    minHeight: 44,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subtabInactive: { color: colors.inkMuted },
  subtabActive: { color: colors.clay, borderBottomColor: colors.clay },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: 44,
    padding: spacing[3],
    backgroundColor: colors.paperAlt,
    borderRadius: radius.md,
  },
  // Status is still conveyed with icon + color together, never color alone
  // (DESIGN.md §4.2/§4.3) — these are a subtle tint layered on top of the
  // same icon/label, not a replacement for it. "ยังไม่ถึงวัน / ยังไม่ครบเป้าหมาย"
  // intentionally has no variant here and stays the plain neutral `logRow`
  // background, never a red/negative tint.
  logRowCompleted: { backgroundColor: 'rgba(126,143,108,0.14)' }, // colors.sage tint
  logRowCheatRest: { backgroundColor: 'rgba(201,162,107,0.16)' }, // colors.sand tint
  logStatusIcon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  kcal: { ...typography.body, fontWeight: '500', color: colors.ink },
});

export const profileScreenStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.paperSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { marginBottom: spacing[3] },
  accountMethod: { marginTop: 2 },
  logoutButton: { marginTop: spacing[3] },
  pairingCard: { gap: spacing[3] },
  pairingCode: { textAlign: 'center', letterSpacing: 8, color: colors.clay },
  center: { textAlign: 'center' },
  deviceNote: { marginTop: spacing[3] },
  linksCard: { padding: 0 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  linkRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
});

export const dailyDashboardScreenStyles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing[2],
    backgroundColor: colors.paperSunken,
    borderRadius: radius.md,
    padding: spacing[1],
    marginBottom: spacing[6],
  },
  modeBtn: { flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  modeBtnActive: { backgroundColor: colors.paper },
  modeLabel: { ...typography.bodySm, color: colors.inkMuted },
  modeLabelActive: { color: colors.ink },
  cheatPanel: {
    backgroundColor: colors.paperAlt,
    borderRadius: radius.lg,
    padding: spacing[6],
    alignItems: 'center',
    gap: spacing[3],
  },
});

export const progressScreenStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subTabs: {
    flexDirection: 'row',
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subTab: { minHeight: 44, paddingHorizontal: spacing[1], justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  subTabActive: { borderBottomColor: colors.clay },
  subTabLabel: { color: colors.inkMuted },
  subTabLabelActive: { color: colors.clay },
  center: { textAlign: 'center' },
  forecastCard: { alignItems: 'center', paddingVertical: spacing[6] },
  forecastDate: { marginVertical: spacing[2] },
  forecastStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[8],
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%',
  },
  forecastStat: { alignItems: 'center', gap: 2 },
  chartTitle: { marginBottom: spacing[3] },
  legendRow: { flexDirection: 'row', gap: spacing[4], marginTop: spacing[3] },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  legendSwatch: { width: 16, height: 3, borderRadius: 2 },
});
