import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { IconCheck } from './Icon';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

/** DESIGN.md §3.4 — pill filter/equipment chip. Selected = sand fill, not clay (keeps clay for primary action). */
export function Chip({ label, selected, onPress, disabled }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, selected && styles.selected, disabled && styles.disabled]}
    >
      {selected && <IconCheck size={14} color={colors.ink} />}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    minHeight: 44,
    paddingHorizontal: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: colors.paperAlt,
  },
  selected: { backgroundColor: colors.sand },
  disabled: { opacity: 0.6 },
  label: { ...typography.body, fontSize: 14, color: colors.ink },
});
