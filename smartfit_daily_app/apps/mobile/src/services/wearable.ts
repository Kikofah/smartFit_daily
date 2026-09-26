import { Platform } from 'react-native';
import AppleHealthKit, { type HealthKitPermissions } from 'react-native-health';
import {
  getSdkStatus,
  initialize as initializeHealthConnect,
  readRecords,
  requestPermission as requestHealthConnectReadPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { api, ApiError } from './api';
import type { WearablePlatform, WorkoutSessionStatus } from '@smartfit/shared-types';

/**
 * INT-3 / REQ-13 — wearable calorie sync. Platform-branched per the brief:
 * HealthKit (`react-native-health`) on iOS, Health Connect
 * (`react-native-health-connect`) on Android. Both libraries are native-only
 * (no Expo Go support) — see this file's usage note in device-pairing.tsx.
 */
export class WearableError extends Error {}

export const wearablePlatform: WearablePlatform = Platform.OS === 'ios' ? 'apple_health' : 'google_health_connect';

const HEALTHKIT_PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.ActiveEnergyBurned],
    write: [],
  },
};

function requestHealthKitPermission(): Promise<void> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.isAvailable((availabilityError, isAvailable) => {
      if (availabilityError || !isAvailable) {
        reject(new WearableError('อุปกรณ์นี้ไม่รองรับ Apple Health'));
        return;
      }
      AppleHealthKit.initHealthKit(HEALTHKIT_PERMISSIONS, (initError) => {
        if (initError) {
          reject(new WearableError('ไม่ได้รับสิทธิ์เข้าถึงข้อมูล Apple Health กรุณาอนุญาตในการตั้งค่า'));
          return;
        }
        resolve();
      });
    });
  });
}

async function initHealthConnectAndRequestPermission(): Promise<void> {
  const status = await getSdkStatus();
  if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
    throw new WearableError('กรุณาติดตั้งหรืออัปเดตแอป Health Connect ก่อนเชื่อมต่อ');
  }
  await initializeHealthConnect();
  const granted = await requestHealthConnectReadPermission([{ accessType: 'read', recordType: 'ActiveCaloriesBurned' }]);
  if (granted.length === 0) {
    throw new WearableError('ไม่ได้รับสิทธิ์เข้าถึงข้อมูล Health Connect');
  }
}

/** Requests the OS-level read permission for active calories. Must run only after the consent step (NFR-05) — see device-pairing.tsx. */
export async function requestWearablePermission(): Promise<void> {
  if (Platform.OS === 'ios') {
    await requestHealthKitPermission();
  } else {
    await initHealthConnectAndRequestPermission();
  }
}

/** POST /integrations/wearable/connect — records the connection server-side, same as the smart scale's connect route. */
export function connectWearable(): Promise<void> {
  return api.post('/api/integrations/wearable/connect');
}

/** DELETE /integrations/wearable — lets the user withdraw consent (NFR-05). */
export function disconnectWearable(): Promise<void> {
  return api.delete('/api/integrations/wearable');
}

/** Reads total active calories burned in a time range from the platform's health store. */
export async function readActiveCaloriesBurnedKcal(startTimeIso: string, endTimeIso: string): Promise<number> {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned({ startDate: startTimeIso, endDate: endTimeIso }, (error, results) => {
        if (error) {
          reject(new WearableError('อ่านข้อมูลแคลอรี่จาก Apple Health ไม่สำเร็จ'));
          return;
        }
        const totalKcal = (results ?? []).reduce((sum, entry) => sum + entry.value, 0);
        resolve(Math.round(totalKcal));
      });
    });
  }

  const { records } = await readRecords('ActiveCaloriesBurned', {
    timeRangeFilter: { operator: 'between', startTime: startTimeIso, endTime: endTimeIso },
  });
  const totalKcal = records.reduce((sum, record) => sum + record.energy.inKilocalories, 0);
  return Math.round(totalKcal);
}

/** POST /integrations/wearable/readings's response shape (INT-3 / REQ-13). */
export interface PostWearableReadingResult {
  /** True if the session was already completed, so this call retroactively corrected that day's dailyLogs entry (see the route's own comment) — false just means the reading was stored for session-complete to prefer later, not an error. */
  appliedToLog: boolean;
  calculatedKcal: number;
}

/**
 * POST /integrations/wearable/readings — attaches one calorie reading to an
 * existing workout session. The server overwrites any previous reading for
 * the same session (merge write — see the route's own comment), so calling
 * this again for an already-synced session is a deliberate re-sync, not an
 * error.
 *
 * Open point (spec 20260823-04, "จุดที่ยังไม่ได้ระบุ"): wearable-vs-MET
 * discrepancies are not reconciled on this side either — every reading is
 * sent as-is, happy-path only; session-complete (or this route's own
 * retroactive correction) on the server decides whether to prefer it over
 * the MET estimate.
 */
export function postWearableReading(sessionId: string, calorieValueKcal: number): Promise<PostWearableReadingResult> {
  return api.post<PostWearableReadingResult>('/api/integrations/wearable/readings', {
    sessionId,
    platform: wearablePlatform,
    calorieValueKcal,
  });
}

/** GET /integrations/wearable/latest-session's response shape (INT-3 / REQ-13). */
export interface LatestWearableSession {
  sessionId: string;
  startedAt: string; // ISO-8601 datetime
  actualDurationMinutes?: number;
  status: WorkoutSessionStatus;
  hasWearableReading: boolean;
}

/**
 * GET /integrations/wearable/latest-session — finds which workout session
 * (logged on apps/web's Planner, since this companion app has no workout
 * logging of its own) to sync a wearable reading against. Returns `null`
 * on a 404 (no session in the last 24h) rather than throwing — that's an
 * expected, unremarkable state here, not an error.
 */
export async function getLatestWearableSession(): Promise<LatestWearableSession | null> {
  try {
    return await api.get<LatestWearableSession>('/api/integrations/wearable/latest-session');
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export interface WearableSyncResult {
  sessionId: string;
  calorieValueKcal: number;
  /** True if this session already had a synced reading before this call — the server overwrites it (re-sync), it doesn't reject. */
  wasAlreadySynced: boolean;
  /** True if the session was already completed, so the server retroactively corrected today's dailyLogs entry with this reading (see postWearableReading's comment) — lets the screen say "today's calories were updated" only when that actually happened. */
  appliedToLog: boolean;
}

/**
 * Full INT-3 "sync now" flow: find the latest session, compute its
 * [startedAt, startedAt + actualDurationMinutes] window, read active
 * calories for that window from the platform health store, then post the
 * reading (overwriting any existing one for the session — see
 * `postWearableReading`'s comment). Throws a `WearableError` (Thai message)
 * for every guard case (no session, session not finished yet) so the screen
 * can show it the same way as a permission/connect failure.
 */
export async function syncLatestSessionWearableReading(): Promise<WearableSyncResult> {
  const session = await getLatestWearableSession();
  if (!session) {
    throw new WearableError('ไม่พบการออกกำลังกายในช่วง 24 ชั่วโมงที่ผ่านมา กรุณาเริ่มออกกำลังกายที่หน้าเว็บก่อน');
  }
  if (session.status === 'in_progress' || !session.actualDurationMinutes) {
    throw new WearableError('กรุณาจบการออกกำลังกายที่หน้าเว็บให้เสร็จก่อน แล้วค่อยซิงค์แคลอรี่');
  }

  const startTimeIso = session.startedAt;
  const endTimeIso = new Date(new Date(session.startedAt).getTime() + session.actualDurationMinutes * 60 * 1000).toISOString();
  const calorieValueKcal = await readActiveCaloriesBurnedKcal(startTimeIso, endTimeIso);
  const { appliedToLog } = await postWearableReading(session.sessionId, calorieValueKcal);
  return { sessionId: session.sessionId, calorieValueKcal, wasAlreadySynced: session.hasWearableReading, appliedToLog };
}
