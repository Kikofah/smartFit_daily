import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

/** DESIGN.md §3.1 — one primary action per screen; no bold/black weights, no drop shadow. */
export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && variant === 'primary' && { backgroundColor: colors.clayStrong },
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.labelOnClay : styles.labelOnPaper]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44, // NFR-09 touch target
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  label: { ...typography.body },
  labelOnClay: { color: colors.paper },
  labelOnPaper: { color: colors.ink },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.clay },
  secondary: { backgroundColor: colors.paperAlt, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
});
