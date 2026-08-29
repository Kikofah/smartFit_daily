import { NavLink, Outlet } from 'react-router-dom';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';

/**
 * The 4 fixed bottom tabs from DESIGN.md §4.1 — never add a 5th; fold new
 * features into an existing tab instead. Web equivalent of the mobile
 * app's (tabs)/_layout.tsx (Expo's <Tabs>).
 */
const TABS = [
  { to: '/', label: 'วันนี้' },
  { to: '/planner', label: 'แผน' },
  { to: '/progress', label: 'ความคืบหน้า' },
  { to: '/profile', label: 'โปรไฟล์' },
];

export function TabsLayout() {
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Outlet />
      </View>
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.to === '/'} style={navLinkStyle}>
            <Text style={typography.caption}>{tab.label}</Text>
          </NavLink>
        ))}
      </View>
    </View>
  );
}

function navLinkStyle({ isActive }: { isActive: boolean }) {
  return {
    ...styles.tabLink,
    color: isActive ? colors.clay : colors.inkMuted,
  };
}

const styles = StyleSheet.create({
  page: { minHeight: '100vh' as unknown as number, display: 'flex', flexDirection: 'column' },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
    paddingVertical: 12,
  },
  tabLink: { textDecorationLine: 'none' as const, textAlign: 'center' as const },
});
