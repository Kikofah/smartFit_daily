import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** DESIGN.md §3.8 — neutral message + one action, never "no data" left dead-ended. */
export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && <Button label={actionLabel} variant="secondary" onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing[4], paddingVertical: spacing[16] },
  message: { ...typography.body, color: colors.inkMuted, textAlign: 'center' },
});
