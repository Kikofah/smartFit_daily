import { Tabs } from 'expo-router';
import { colors } from '../../src/constants/theme';

/**
 * The 4 fixed bottom tabs from DESIGN.md §4.1 — never add a 5th; fold new
 * features into an existing tab instead.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.clay,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'วันนี้' }} />
      <Tabs.Screen name="planner" options={{ title: 'แผน' }} />
      <Tabs.Screen name="progress" options={{ title: 'ความคืบหน้า' }} />
      <Tabs.Screen name="profile" options={{ title: 'โปรไฟล์' }} />
    </Tabs>
  );
}
