import { NavLink, Outlet } from 'react-router-dom';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
import { IconHome, IconPlanner, IconProgress, IconProfile, type IconProps } from '../components/Icon';

/**
 * The 4 fixed bottom tabs from DESIGN.md §4.1 — never add a 5th; fold new
 * features into an existing tab instead. Web equivalent of the mobile
 * app's (tabs)/_layout.tsx (Expo's <Tabs>). Mirrors v1/05-daily-dashboard.html's
 * <nav class="bottom-nav">.
 */
const TABS: { to: string; label: string; Icon: (props: IconProps) => JSX.Element }[] = [
  { to: '/', label: 'วันนี้', Icon: IconHome },
  { to: '/planner', label: 'แผน', Icon: IconPlanner },
  { to: '/progress', label: 'ความคืบหน้า', Icon: IconProgress },
  { to: '/profile', label: 'โปรไฟล์', Icon: IconProfile },
];

export function TabsLayout() {
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Outlet />
      </View>
      <View style={styles.tabBar}>
        {TABS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} style={navLinkStyle}>
            {({ isActive }: { isActive: boolean }) => (
              <View style={styles.tabItem}>
                <Icon size={22} color={isActive ? colors.clay : colors.inkMuted} />
                <Text style={[typography.caption, { color: isActive ? colors.clay : colors.inkMuted }]}>{label}</Text>
              </View>
            )}
          </NavLink>
        ))}
      </View>
    </View>
  );
}

function navLinkStyle() {
  return styles.tabLink;
}

const styles = StyleSheet.create({
  page: { minHeight: '100vh' as unknown as number, backgroundColor: colors.paper },
  content: { paddingBottom: spacing[16] },
  tabBar: {
    position: 'fixed' as unknown as 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 720,
    marginHorizontal: 'auto' as unknown as number,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
    paddingVertical: spacing[2],
  } as unknown as import('react-native').ViewStyle,
  tabLink: { textDecorationLine: 'none' as const, flex: 1 },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: spacing[1], minHeight: 44 },
});
