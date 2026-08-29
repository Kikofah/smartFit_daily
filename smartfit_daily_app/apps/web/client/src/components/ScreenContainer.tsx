import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, spacing } from '../constants/theme';

/**
 * Common page wrapper: paper background + the fixed 32px screen margin
 * (DESIGN.md §2.3 rule). No SafeAreaView here (unlike the mobile app's
 * version) — that's a native-notch concern the web doesn't have.
 */
export function ScreenContainer({ style, ...props }: ViewProps) {
  return (
    <View style={styles.page}>
      <View style={[styles.content, style]} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { minHeight: '100vh' as unknown as number, backgroundColor: colors.paper },
  content: { paddingHorizontal: spacing[8], paddingVertical: spacing[6]},
});
