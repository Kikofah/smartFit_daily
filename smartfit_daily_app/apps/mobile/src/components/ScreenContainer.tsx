import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../constants/theme';

/** Common screen wrapper: paper background + the fixed 32px screen margin (DESIGN.md §2.3 rule). */
export function ScreenContainer({ style, ...props }: ViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, style]} {...props} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { flex: 1, paddingHorizontal: spacing[8] },
});
