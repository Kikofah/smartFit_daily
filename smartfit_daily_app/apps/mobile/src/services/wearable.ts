import { Platform } from 'react-native';
import AppleHealthKit, { type HealthKitPermissions } from 'react-native-health';
import {
  getSdkStatus,
  initialize as initializeHealthConnect,
  readRecords,
  requestPermission as requestHealthConnectReadPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { api } from './api';
import type { WearablePlatform } from '@smartfit/shared-types';

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

/**
 * POST /integrations/wearable/readings — attaches one calorie reading to an
 * existing workout session. Exposed for a future workout-session screen to
 * call; NOT wired to a button in this trimmed companion app (see
 * device-pairing.tsx) because the route requires a `sessionId` for an
 * already-logged session, and workout logging lives entirely in apps/web's
 * Planner — this app has no session to reference. Assumption flagged in the
 * task report.
 *
 * Open point (spec 20260823-04, "จุดที่ยังไม่ได้ระบุ"): wearable-vs-MET
 * discrepancies are not reconciled on this side either — every reading is
 * sent as-is, happy-path only; session-complete on the server decides
 * whether to prefer it over the MET estimate.
 */
export function postWearableReading(sessionId: string, calorieValueKcal: number): Promise<void> {
  return api.post('/api/integrations/wearable/readings', {
    sessionId,
    platform: wearablePlatform,
    calorieValueKcal,
  });
}
