import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';

interface CalorieRingProps {
  valueKcal: number;
  goalKcal: number;
  caption?: string;
  size?: number;
}

/**
 * DESIGN.md §3.2 — thin flat-color ring, no gradient. Clay while in
 * progress, sage once the (all-or-nothing, PLN-3) goal is reached — no
 * intermediate warning color, since "not yet reached" isn't an error state
 * (DESIGN.md §4.2).
 */
export function CalorieRing({ valueKcal, goalKcal, caption, size = 160 }: CalorieRingProps) {
  const viewBoxSize = 120;
  const strokeWidth = 8;
  const r = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const center = viewBoxSize / 2;
  const ratio = goalKcal > 0 ? Math.min(1, valueKcal / goalKcal) : 0;
  const isComplete = goalKcal > 0 && valueKcal >= goalKcal;
  const dashoffset = circumference * (1 - ratio);

  return (
    <View style={styles.wrap}>
      <svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <circle cx={center} cy={center} r={r} fill="none" stroke={colors.paperSunken} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={isComplete ? colors.sage : colors.clay}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <View style={styles.labelOverlay} pointerEvents="none">
        <Text style={typography.display}>{valueKcal}</Text>
        <Text style={styles.ringLabel}>/ {goalKcal} kcal</Text>
      </View>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  labelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: { ...typography.caption, color: colors.inkMuted },
  caption: { ...typography.caption, color: colors.inkMuted },
});
