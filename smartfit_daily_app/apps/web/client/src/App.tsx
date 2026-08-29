import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { TabsLayout } from './layouts/TabsLayout';
import { OnboardingLayout } from './layouts/OnboardingLayout';

import WelcomeScreen from './pages/auth/WelcomeScreen';
import SignupScreen from './pages/auth/SignupScreen';
import LoginScreen from './pages/auth/LoginScreen';
import ForgotPasswordScreen from './pages/auth/ForgotPasswordScreen';
import PersonalInfoScreen from './pages/onboarding/PersonalInfoScreen';
import EquipmentScreen from './pages/onboarding/EquipmentScreen';
import GoalSelectScreen from './pages/onboarding/GoalSelectScreen';
import GoalConfirmScreen from './pages/onboarding/GoalConfirmScreen';
import DailyDashboardScreen from './pages/DailyDashboardScreen';
import PlannerScreen from './pages/PlannerScreen';
import ProgressScreen from './pages/ProgressScreen';
import ProfileScreen from './pages/ProfileScreen';
import WorkoutSessionScreen from './pages/workout/WorkoutSessionScreen';
import WorkoutResultScreen from './pages/workout/WorkoutResultScreen';
import LogHistoryScreen from './pages/LogHistoryScreen';

/**
 * Route tree mirrors what apps/mobile's Expo Router file structure used to
 * be: auth -> onboarding -> the 4-tab core loop, plus workout/log-history
 * pushed on top. See docs/02-design/01-prototypes/user-journeys.md.
 *
 * TODO (same gap as the old apps/mobile/app/_layout.tsx had): read
 * useAuth()/profile-completeness here and redirect between the three
 * phases instead of relying on the user to navigate correctly.
 */
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

          <Route element={<OnboardingLayout />}>
            <Route path="/onboarding/personal-info" element={<PersonalInfoScreen />} />
            <Route path="/onboarding/equipment" element={<EquipmentScreen />} />
            <Route path="/onboarding/goal-select" element={<GoalSelectScreen />} />
            <Route path="/onboarding/goal-confirm" element={<GoalConfirmScreen />} />
          </Route>

          <Route element={<TabsLayout />}>
            <Route path="/" element={<DailyDashboardScreen />} />
            <Route path="/planner" element={<PlannerScreen />} />
            <Route path="/progress" element={<ProgressScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          <Route path="/workout/session" element={<WorkoutSessionScreen />} />
          <Route path="/workout/result" element={<WorkoutResultScreen />} />
          <Route path="/log-history" element={<LogHistoryScreen />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
