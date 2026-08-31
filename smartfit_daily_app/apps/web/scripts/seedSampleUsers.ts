/**
 * One-off dev seed script — creates 5 sample Firebase Auth users + their
 * Firestore data in the real "smartfit-daily" project, following the
 * collection/document mapping in docs/02-design/02-technical/database-schema.md
 * §8.2 (embedded fields on `users/{userId}`, subcollections for unbounded data).
 *
 * Uses the client SDK (not firebase-admin) on purpose: no service-account
 * credentials are configured on this machine (see apps/web/.env's
 * GOOGLE_APPLICATION_CREDENTIALS comment). Each sample user signs itself up,
 * then writes only its own documents while signed in as that user — this
 * satisfies firestore.rules' `isOwner(userId)` check with zero admin setup.
 *
 * Run from smartfit_daily_app/apps/web:
 *   npx tsx scripts/seedSampleUsers.ts
 *
 * Safe to re-run: existing sample accounts sign in instead of re-signing up,
 * and every write is a `setDoc` (idempotent overwrite), not an `add`.
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, collection, initializeFirestore } from 'firebase/firestore';
import type {
  ActivityLevel,
  ActivityType,
  ActivityPlanType,
  EquipmentType,
  GoalType,
  Intensity,
  LogCompletionStatus,
  Sex,
} from '@smartfit/shared-types';

config({ path: resolve(__dirname, '../client/.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing VITE_FIREBASE_* env vars — check apps/web/client/.env exists and is filled in.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// experimentalForceLongPolling: the web Firestore SDK's default WebChannel
// transport assumes a browser; this keeps it working under plain Node.
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

const SAMPLE_PASSWORD = 'SampleSeed#2026';

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mirrors GoalConfirmScreen.tsx's ONB-3 formula — weightKg-based, not TDEE-based (confirmed 2026-08-31).
const GOAL_KCAL_PER_KG: Record<GoalType, number> = { lose_weight: 4.5, tone_up: 3.0, build_endurance: 5.5 };

function computeTdeeKcal(sex: Sex, weightKg: number, heightCm: number, age: number, activityLevel: ActivityLevel) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
  return Math.round(bmr * ACTIVITY_FACTOR[activityLevel]);
}

function isoDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

type LogOutcome = 'completed' | 'incomplete' | 'cheatrest';

/** Consecutive completed/cheat-rest days counting back from the most recent entry — breaks on the first "incomplete". */
function computeStreak(pattern: LogOutcome[]): number {
  let streak = 0;
  for (let i = pattern.length - 1; i >= 0; i--) {
    if (pattern[i] === 'incomplete') break;
    streak++;
  }
  return streak;
}

interface SampleWorkout {
  dayOffset: number;
  activityType: ActivityType;
  intensity: Intensity;
  durationMinutes: number;
  calculatedKcal: number;
}

interface SampleWeightRecord {
  dayOffset: number;
  weightKg: number;
  source: 'manual' | 'smart_scale_sync';
}

interface SampleUser {
  email: string;
  name: string;
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  equipmentTypes: EquipmentType[];
  goalType: GoalType;
  targetWeightKg?: number;
  /** Oldest first; index 0 = (logPattern.length - 1) days ago, last index = today. */
  logPattern: LogOutcome[];
  minutesPerCompletedDay: number;
  kcalPerCompletedDay: number;
  workouts: SampleWorkout[];
  weightRecords: SampleWeightRecord[];
  smartScaleConnected: boolean;
  wearableConnected: boolean;
}

const SAMPLE_USERS: SampleUser[] = [
  {
    email: 'sample.somying@smartfit-daily.test',
    name: 'สมหญิง ใจดี',
    age: 29,
    sex: 'female',
    weightKg: 68,
    heightCm: 162,
    activityLevel: 'moderate',
    equipmentTypes: ['none'],
    goalType: 'lose_weight',
    targetWeightKg: 60,
    logPattern: ['completed', 'completed', 'incomplete', 'cheatrest', 'completed'],
    minutesPerCompletedDay: 25,
    kcalPerCompletedDay: 210,
    workouts: [
      { dayOffset: -4, activityType: 'cardio', intensity: 'medium', durationMinutes: 25, calculatedKcal: 210 },
      { dayOffset: 0, activityType: 'cardio', intensity: 'medium', durationMinutes: 25, calculatedKcal: 205 },
    ],
    weightRecords: [
      { dayOffset: -14, weightKg: 69.5, source: 'manual' },
      { dayOffset: -7, weightKg: 68.8, source: 'manual' },
      { dayOffset: 0, weightKg: 68, source: 'manual' },
    ],
    smartScaleConnected: false,
    wearableConnected: false,
  },
  {
    email: 'sample.somchai@smartfit-daily.test',
    name: 'สมชาย มั่นคง',
    age: 34,
    sex: 'male',
    weightKg: 78,
    heightCm: 175,
    activityLevel: 'active',
    equipmentTypes: ['dumbbell', 'full_gym'],
    goalType: 'build_endurance',
    logPattern: ['completed', 'incomplete', 'completed', 'completed'],
    minutesPerCompletedDay: 30,
    kcalPerCompletedDay: 230,
    workouts: [
      { dayOffset: -2, activityType: 'strength', intensity: 'medium', durationMinutes: 30, calculatedKcal: 230 },
      { dayOffset: -1, activityType: 'hiit', intensity: 'high', durationMinutes: 20, calculatedKcal: 240 },
    ],
    weightRecords: [
      { dayOffset: -14, weightKg: 78.5, source: 'manual' },
      { dayOffset: -7, weightKg: 78.2, source: 'smart_scale_sync' },
      { dayOffset: -1, weightKg: 78, source: 'smart_scale_sync' },
    ],
    smartScaleConnected: true,
    wearableConnected: true,
  },
  {
    email: 'sample.pimjai@smartfit-daily.test',
    name: 'พิมพ์ใจ สุขสันต์',
    age: 24,
    sex: 'female',
    weightKg: 55,
    heightCm: 158,
    activityLevel: 'light',
    equipmentTypes: ['full_gym'],
    goalType: 'tone_up',
    logPattern: ['completed', 'completed', 'completed', 'completed'],
    minutesPerCompletedDay: 30,
    kcalPerCompletedDay: 220,
    workouts: [{ dayOffset: 0, activityType: 'strength', intensity: 'medium', durationMinutes: 30, calculatedKcal: 220 }],
    weightRecords: [
      { dayOffset: -14, weightKg: 55.2, source: 'manual' },
      { dayOffset: 0, weightKg: 55, source: 'manual' },
    ],
    smartScaleConnected: false,
    wearableConnected: false,
  },
  {
    email: 'sample.thanakorn@smartfit-daily.test',
    name: 'ธนกร เพียรทำ',
    age: 45,
    sex: 'male',
    weightKg: 90,
    heightCm: 168,
    activityLevel: 'sedentary',
    equipmentTypes: ['none'],
    goalType: 'lose_weight',
    targetWeightKg: 78,
    logPattern: ['incomplete', 'completed', 'completed', 'cheatrest'],
    minutesPerCompletedDay: 20,
    kcalPerCompletedDay: 180,
    workouts: [{ dayOffset: -2, activityType: 'cardio', intensity: 'low', durationMinutes: 20, calculatedKcal: 180 }],
    weightRecords: [
      { dayOffset: -14, weightKg: 91, source: 'manual' },
      { dayOffset: -1, weightKg: 90, source: 'smart_scale_sync' },
    ],
    smartScaleConnected: true,
    wearableConnected: false,
  },
  {
    // Freshly onboarded, no activity yet — demonstrates the "not enough data
    // to forecast" empty state (INT-1) and a 0-day streak.
    email: 'sample.arunee@smartfit-daily.test',
    name: 'อรุณี เริ่มต้นใหม่',
    age: 27,
    sex: 'female',
    weightKg: 60,
    heightCm: 160,
    activityLevel: 'moderate',
    equipmentTypes: ['dumbbell'],
    goalType: 'lose_weight',
    targetWeightKg: 55,
    logPattern: [],
    minutesPerCompletedDay: 0,
    kcalPerCompletedDay: 0,
    workouts: [],
    weightRecords: [],
    smartScaleConnected: false,
    wearableConnected: false,
  },
];

function buildGoalSelection(user: SampleUser) {
  return {
    goalType: user.goalType,
    ...(user.targetWeightKg !== undefined ? { targetWeightKg: user.targetWeightKg } : {}),
    dailyCalorieTargetKcal: Math.round(user.weightKg * GOAL_KCAL_PER_KG[user.goalType]),
  };
}

async function seedUser(user: SampleUser) {
  let cred: UserCredential;
  try {
    cred = await createUserWithEmailAndPassword(auth, user.email, SAMPLE_PASSWORD);
    console.log(`  created auth user for ${user.email}`);
  } catch (e) {
    if ((e as { code?: string }).code === 'auth/email-already-in-use') {
      cred = await signInWithEmailAndPassword(auth, user.email, SAMPLE_PASSWORD);
      console.log(`  ${user.email} already exists, signed in instead`);
    } else {
      throw e;
    }
  }
  const userId = cred.user.uid;
  const tdeeKcal = computeTdeeKcal(user.sex, user.weightKg, user.heightCm, user.age, user.activityLevel);
  const streakDays = computeStreak(user.logPattern);

  // Root document: users/{userId} — User Profile + embedded Goal/Equipment/Streak/Forecast/Integrations
  // (database-schema.md §8.2).
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    displayName: user.name,
    age: user.age,
    sex: user.sex,
    weightKg: user.weightKg,
    heightCm: user.heightCm,
    activityLevel: user.activityLevel,
    tdeeKcal,
    equipmentTypes: user.equipmentTypes,
    goalSelection: buildGoalSelection(user),
    streakSnapshot: { currentStreakDays: streakDays, computedAt: new Date().toISOString() },
    ...(user.goalType === 'lose_weight' && user.weightRecords.length >= 2
      ? {
          weightForecastSnapshot: {
            forecastedGoalDate: isoDate(60),
            averageDailyDeficitKcal: 350,
            computedAt: new Date().toISOString(),
          },
        }
      : {}),
    integrationConnections: {
      smartScale: {
        integrationType: 'smart_scale',
        connectionStatus: user.smartScaleConnected ? 'connected' : 'not_connected',
        ...(user.smartScaleConnected ? { connectedAt: new Date().toISOString() } : {}),
      },
      wearable: {
        integrationType: 'wearable',
        connectionStatus: user.wearableConnected ? 'connected' : 'not_connected',
        ...(user.wearableConnected ? { connectedAt: new Date().toISOString() } : {}),
      },
    },
  });

  // dailyLogs/{date} + dayStatus/{date} — oldest entry is (logPattern.length - 1) days ago, last is today.
  for (let i = 0; i < user.logPattern.length; i++) {
    const dayOffset = i - (user.logPattern.length - 1);
    const outcome = user.logPattern[i]!;
    const date = isoDate(dayOffset);
    const completionStatus: LogCompletionStatus = outcome === 'incomplete' ? 'incomplete' : 'completed';

    await setDoc(doc(db, 'users', userId, 'dailyLogs', date), {
      minutesExercised: outcome === 'incomplete' ? 0 : user.minutesPerCompletedDay,
      accumulatedKcal: outcome === 'incomplete' ? Math.round(user.kcalPerCompletedDay * 0.6) : user.kcalPerCompletedDay,
      completionStatus,
      source: outcome === 'cheatrest' ? 'cheat_rest_override' : 'workout_session',
    });

    if (outcome === 'cheatrest') {
      await setDoc(doc(db, 'users', userId, 'dayStatus', date), {
        isCheatRest: true,
        setAt: new Date().toISOString(),
      });
    }
  }

  // weeklyPlanEntries/{date} — the current Mon-Sun week containing today.
  const today = new Date();
  const mondayOffset = -((today.getDay() + 6) % 7); // days back to this week's Monday
  const plannedByOffset: Partial<Record<number, ActivityPlanType>> = {};
  for (const w of user.workouts) plannedByOffset[w.dayOffset] = w.activityType as ActivityPlanType;
  for (let i = 0; i < 7; i++) {
    const dayOffset = mondayOffset + i;
    const date = isoDate(dayOffset);
    const plannedActivityType = plannedByOffset[dayOffset];
    await setDoc(doc(db, 'users', userId, 'weeklyPlanEntries', date), {
      ...(plannedActivityType ? { plannedActivityType } : {}),
      isDefaultAuto: plannedActivityType === undefined,
    });
  }

  // workoutSessions/{sessionId} — embeds sessionVideos + actualCalorieBurn per §8.2.
  for (const w of user.workouts) {
    const sessionRef = doc(collection(db, 'users', userId, 'workoutSessions'));
    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() + w.dayOffset);
    await setDoc(sessionRef, {
      startedAt: startedAt.toISOString(),
      status: 'completed',
      actualDurationMinutes: w.durationMinutes,
      sessionVideos: [
        {
          role: 'main',
          externalVideoId: `sample-${w.activityType}-${w.intensity}`,
          activityType: w.activityType,
          intensity: w.intensity,
          durationMinutes: w.durationMinutes,
        },
      ],
      actualCalorieBurn: {
        source: 'met_formula',
        metValue: w.intensity === 'high' ? 8 : w.intensity === 'medium' ? 6 : 4,
        calculatedKcal: w.calculatedKcal,
      },
    });
  }

  // weightRecords/{recordId}
  for (const wr of user.weightRecords) {
    const recordedAt = new Date();
    recordedAt.setDate(recordedAt.getDate() + wr.dayOffset);
    await setDoc(doc(collection(db, 'users', userId, 'weightRecords')), {
      weightKg: wr.weightKg,
      recordedAt: recordedAt.toISOString(),
      source: wr.source,
    });
  }

  await signOut(auth);
  console.log(`  seeded ${user.name} (${userId}): streak=${streakDays}d, ${user.workouts.length} session(s), ${user.weightRecords.length} weight record(s)`);
}

async function main() {
  console.log(`Seeding ${SAMPLE_USERS.length} sample users into Firebase project "${firebaseConfig.projectId}"...`);
  for (const user of SAMPLE_USERS) {
    console.log(`\n${user.name} <${user.email}>`);
    await seedUser(user);
  }
  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
