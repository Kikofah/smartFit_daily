// Firebase Cloud Functions entry point — one export per Cloud Function.
// Grouped by High Level Architecture conceptual component
// (docs/02-design/02-technical/high-level-architecture.md §3), matching the
// operation-level mapping in tech-stack.md §6.3.
//
// Note: most Account & Session Management operations (sign-up/login/logout)
// are direct Firebase Authentication client SDK calls with no Cloud Function
// backing them — see tech-stack.md §6.3.1. forgotPassword is the exception.

export { forgotPassword } from './account-session/forgotPassword';

export { getProfile } from './personalization-profile/getProfile';
export { updatePersonalInfo } from './personalization-profile/updatePersonalInfo';
export { updateEquipment } from './personalization-profile/updateEquipment';
export { updateGoal } from './personalization-profile/updateGoal';

export { getTodayRecommendation } from './content-recommendation/getTodayRecommendation';
export { swapRecommendation } from './content-recommendation/swapRecommendation';
export { startWorkoutSession } from './content-recommendation/startWorkoutSession';

export { completeWorkoutSession } from './exertion-calorie/completeWorkoutSession';

export { getWeeklyPlan } from './planner-day-status/getWeeklyPlan';
export { updatePlanDay } from './planner-day-status/updatePlanDay';
export { setCheatRestDay } from './planner-day-status/setCheatRestDay';
export { clearCheatRestDay } from './planner-day-status/clearCheatRestDay';

export { getLogs } from './logging-streak/getLogs';
export { getLogByDate } from './logging-streak/getLogByDate';
export { getStreak } from './logging-streak/getStreak';
export { onDailyLogWrite } from './logging-streak/onDailyLogWrite';

export { getForecast } from './insights-forecast/getForecast';

export { connectSmartScale } from './integration-gateway/connectSmartScale';
export { disconnectSmartScale } from './integration-gateway/disconnectSmartScale';
export { syncSmartScale } from './integration-gateway/syncSmartScale';
export { connectWearable } from './integration-gateway/connectWearable';
export { disconnectWearable } from './integration-gateway/disconnectWearable';
export { submitWearableReading } from './integration-gateway/submitWearableReading';
