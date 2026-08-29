import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

/** DESIGN.md §4.1 — onboarding is a linear flow, always shows a step-progress dot row. */
export function ProgressDots({ total, currentIndex }: { total: number; currentIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i < currentIndex && styles.done, i === currentIndex && styles.active]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing[2] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.paperSunken },
  active: { backgroundColor: colors.clay },
  done: { backgroundColor: colors.sand },
});
