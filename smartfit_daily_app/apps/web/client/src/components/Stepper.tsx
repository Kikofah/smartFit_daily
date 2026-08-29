import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  error?: boolean;
}

/**
 * DESIGN.md §3.7 — numeric fields (age/weight/height) use a +/- stepper
 * instead of a slider (hard to land on an exact value with a slider).
 */
export function Stepper({ label, value, onChange, step = 1, min = 0, max = 999, unit, error }: StepperProps) {
  function clamp(next: number) {
    return Math.min(max, Math.max(min, next));
  }

  return (
    <View style={{ gap: spacing[1] }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, error && styles.rowError]}>
        <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value - step))} accessibilityLabel={`ลด${label}`}>
          <Text style={styles.stepLabel}>−</Text>
        </Pressable>
        <TextInput
          style={styles.value}
          value={String(value)}
          keyboardType="numeric"
          inputMode="numeric"
          onChangeText={(t) => {
            const n = Number(t.replace(/[^0-9.]/g, ''));
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
        />
        {unit && <Text style={styles.unit}>{unit}</Text>}
        <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value + step))} accessibilityLabel={`เพิ่ม${label}`}>
          <Text style={styles.stepLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.inkMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.paperSunken,
    borderRadius: radius.md,
    padding: spacing[1],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowError: { borderColor: colors.danger },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperAlt,
  },
  stepLabel: { ...typography.h2, color: colors.ink },
  value: {
    flex: 1,
    textAlign: 'center',
    ...typography.h1,
    color: colors.ink,
    backgroundColor: 'transparent',
  },
  unit: { ...typography.bodySm, color: colors.inkMuted, paddingRight: spacing[2] },
});
