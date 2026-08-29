import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

/** DESIGN.md §3.7 — paper-sunken fill, no border by default, clay border only on focus. */
export function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: spacing[1] }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.inkFaint}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.inkMuted },
  input: {
    minHeight: 44,
    backgroundColor: colors.paperSunken,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: spacing[3],
    color: colors.ink,
    ...typography.body,
  },
  inputFocused: { borderColor: colors.clay },
  inputError: { borderColor: colors.danger },
  error: { ...typography.bodySm, color: colors.danger },
});
