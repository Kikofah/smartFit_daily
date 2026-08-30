import { ActivityIndicator, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  /** Shows a spinner in place of the label and forces disabled — for an in-flight action, to block repeat presses. */
  loading?: boolean;
}

/** DESIGN.md §3.1 — one primary action per screen; no bold/black weights, no drop shadow. */
export function Button({ label, onPress, variant = 'primary', disabled, loading }: ButtonProps) {
  const isDisabled = disabled || loading;
  const labelStyle = [
    styles.label,
    variant === 'primary' ? styles.labelOnClay : styles.labelOnPaper,
    variant === 'destructive' && styles.labelDestructive,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && variant === 'primary' && { backgroundColor: colors.clayStrong },
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.paper : colors.ink} />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
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
  labelDestructive: { color: colors.danger },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.clay },
  secondary: { backgroundColor: colors.paperAlt, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  /** DESIGN.md §3.1 — destructive: danger text/border on paper, never a full red fill. */
  destructive: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.danger },
});
