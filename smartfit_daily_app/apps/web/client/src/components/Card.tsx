import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

/** DESIGN.md §2.4 — hairline border instead of drop shadow; §3 card surfaces reuse this. */
export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paperAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
  },
});
