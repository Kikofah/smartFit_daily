import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

/** DESIGN.md §3.5 (Cheat/Rest Day toggle) — sand when on, no red/green traffic-light semantics. */
export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[styles.track, value && styles.trackOn, disabled && styles.disabled]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.borderStrong,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: colors.sand },
  disabled: { opacity: 0.6 },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.paper,
  },
  knobOn: { transform: [{ translateX: 18 }] },
});
