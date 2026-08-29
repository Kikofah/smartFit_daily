import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { IconFlame } from './Icon';

/**
 * DESIGN.md §3.6 — clay flame + number when streak > 0, ink-faint when 0.
 * Never shows a red/negative state when a streak resets (§4.2 rule 4).
 */
export function StreakBadge({ days }: { days: number }) {
  const active = days > 0;
  const tone = active ? colors.clay : colors.inkFaint;

  return (
    <View style={styles.badge}>
      <IconFlame size={20} color={tone} />
      <Text style={[styles.count, { color: tone }]}>{days} วัน</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 44,
    backgroundColor: colors.paperAlt,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
  },
  count: { ...typography.bodySm, fontWeight: '600' },
});
