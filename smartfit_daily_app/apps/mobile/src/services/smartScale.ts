import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager, type Device, State } from 'react-native-ble-plx';
import { api } from './api';
import type { WeightRecordSource } from '@smartfit/shared-types';

/**
 * INT-2 / REQ-12 — Bluetooth smart-scale sync. Reads weight from the
 * standard Bluetooth SIG "Weight Scale Service" (0x181D) / "Weight
 * Measurement" characteristic (0x2A9D) — this is a generic BLE profile most
 * consumer smart scales implement, not a vendor-specific SDK.
 */
const WEIGHT_SCALE_SERVICE_UUID = '181D';
const WEIGHT_MEASUREMENT_CHARACTERISTIC_UUID = '2A9D';

export class SmartScaleError extends Error {}

// Single shared manager instance — react-native-ble-plx docs recommend
// creating exactly one BleManager for the app's lifetime.
let manager: BleManager | null = null;
function getManager(): BleManager {
  if (!manager) manager = new BleManager();
  return manager;
}

/** Android 12+ (API 31+) requires runtime BLUETOOTH_SCAN/CONNECT grants; older Android needs location instead. iOS permission is handled by the system prompt from Info.plist (see app.json). */
async function requestAndroidBlePermissions(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);
  const denied = Object.values(granted).some((status) => status !== PermissionsAndroid.RESULTS.GRANTED);
  if (denied) {
    throw new SmartScaleError('แอปไม่ได้รับสิทธิ์ Bluetooth หรือตำแหน่งที่ตั้ง กรุณาอนุญาตในการตั้งค่าเครื่องแล้วลองใหม่');
  }
}

async function ensureBluetoothOn(bleManager: BleManager): Promise<void> {
  const state = await bleManager.state();
  if (state === State.PoweredOn) return;
  if (state === State.Unsupported || state === State.Unauthorized) {
    throw new SmartScaleError('อุปกรณ์นี้ไม่รองรับ Bluetooth หรือแอปไม่ได้รับอนุญาตให้ใช้งาน Bluetooth');
  }
  throw new SmartScaleError('กรุณาเปิด Bluetooth ก่อนเชื่อมต่อตาชั่งอัจฉริยะ');
}

export interface ScannedScale {
  id: string;
  name: string;
}

/**
 * Scans for BLE peripherals advertising the Weight Scale Service. Calls
 * `onFound` for each device seen (may repeat) and `onError` for scan/
 * permission/Bluetooth-state failures. Returns a function that stops the
 * scan — the caller must call it (screen unmount, device picked, or
 * timeout), the scan does not stop on its own.
 */
export function scanForScales(onFound: (device: ScannedScale) => void, onError: (error: Error) => void): () => void {
  const bleManager = getManager();
  let stopped = false;

  void (async () => {
    try {
      await requestAndroidBlePermissions();
      await ensureBluetoothOn(bleManager);
      if (stopped) return;
      bleManager.startDeviceScan([WEIGHT_SCALE_SERVICE_UUID], null, (error, device) => {
        if (error) {
          onError(new SmartScaleError(`สแกนหาตาชั่งอัจฉริยะไม่สำเร็จ: ${error.message}`));
          return;
        }
        if (device) onFound({ id: device.id, name: device.name ?? device.localName ?? 'ตาชั่งอัจฉริยะ' });
      });
    } catch (e) {
      onError(e instanceof Error ? e : new SmartScaleError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการสแกน'));
    }
  })();

  return () => {
    stopped = true;
    bleManager.stopDeviceScan();
  };
}

/**
 * Decodes a base64 BLE characteristic value into raw bytes, with no
 * dependency on the `Buffer`/`atob` globals RN doesn't provide by default.
 */
function decodeBase64(base64: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = base64.replace(/=+$/, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bitsCollected = 0;
  for (const char of clean) {
    const value = alphabet.indexOf(char);
    if (value === -1) continue;
    buffer = (buffer << 6) | value;
    bitsCollected += 6;
    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      bytes.push((buffer >> bitsCollected) & 0xff);
    }
  }
  return Uint8Array.from(bytes);
}

/**
 * Parses the Weight Measurement characteristic (0x2A9D) per the Bluetooth
 * SIG Weight Scale Service spec: byte 0 is a flags bitfield (bit 0 = unit —
 * 0 kg/SI, 1 lb/Imperial; other bits indicate optional timestamp/user-id/
 * BMI fields we don't read), followed by a little-endian uint16 weight in
 * the unit's fixed resolution (0.005 kg, or 0.01 lb converted to kg here).
 */
export function parseWeightMeasurementKg(base64Value: string): number {
  const bytes = decodeBase64(base64Value);
  if (bytes.length < 3) {
    throw new SmartScaleError('รูปแบบข้อมูลน้ำหนักจากตาชั่งไม่ถูกต้อง');
  }
  const flags = bytes[0];
  const isImperial = (flags & 0x01) !== 0;
  const rawWeight = bytes[1] | (bytes[2] << 8); // little-endian uint16
  const weightKg = isImperial ? rawWeight * 0.01 * 0.45359237 : rawWeight * 0.005;
  return Math.round(weightKg * 100) / 100;
}

/**
 * Connects to the chosen scale, waits for one Weight Measurement
 * notification, then disconnects. Rejects with a `SmartScaleError`
 * (Thai message) on connect failure, read failure, or a mid-read
 * disconnect.
 */
export function connectAndReadWeightKg(deviceId: string): Promise<number> {
  const bleManager = getManager();

  return new Promise<number>((resolve, reject) => {
    let settled = false;
    let disconnectSubscription: { remove: () => void } | null = null;
    let monitorSubscription: { remove: () => void } | null = null;

    function settle(fn: () => void) {
      if (settled) return;
      settled = true;
      disconnectSubscription?.remove();
      monitorSubscription?.remove();
      bleManager.cancelDeviceConnection(deviceId).catch(() => {
        // Already disconnected — nothing to clean up.
      });
      fn();
    }

    (async () => {
      let device: Device;
      try {
        device = await bleManager.connectToDevice(deviceId, { timeout: 10000 });
        await device.discoverAllServicesAndCharacteristics();
      } catch {
        settle(() => reject(new SmartScaleError('เชื่อมต่อกับตาชั่งอัจฉริยะไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')));
        return;
      }

      disconnectSubscription = bleManager.onDeviceDisconnected(deviceId, () => {
        settle(() => reject(new SmartScaleError('การเชื่อมต่อกับตาชั่งอัจฉริยะหลุดก่อนอ่านค่าน้ำหนักเสร็จ')));
      });

      monitorSubscription = bleManager.monitorCharacteristicForDevice(
        deviceId,
        WEIGHT_SCALE_SERVICE_UUID,
        WEIGHT_MEASUREMENT_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            settle(() => reject(new SmartScaleError('อ่านค่าน้ำหนักจากตาชั่งไม่สำเร็จ')));
            return;
          }
          if (!characteristic?.value) return;
          try {
            const weightKg = parseWeightMeasurementKg(characteristic.value);
            settle(() => resolve(weightKg));
          } catch (parseError) {
            settle(() => reject(parseError instanceof Error ? parseError : new SmartScaleError('อ่านค่าน้ำหนักไม่สำเร็จ')));
          }
        },
      );
    })();
  });
}

/**
 * Full INT-2 flow: read one weight value from the paired scale, then tell
 * the server it's connected and sync that reading — same
 * POST /integrations/smart-scale/connect + /sync pair the manual
 * weight-entry fallback on the web Profile page would call, just with
 * `source: 'smart_scale_sync'` instead of `'manual'`.
 *
 * Open point (spec 20260823-04, "จุดที่ยังไม่ได้ระบุ"): multiple weigh-ins
 * on the same day are not reconciled here — every reading is sent as-is,
 * happy-path only. The server's /sync route already overwrites that day's
 * record on a second call, so this is a deliberate simplification, not an
 * oversight.
 */
export async function pairAndSyncSmartScale(deviceId: string): Promise<number> {
  const weightKg = await connectAndReadWeightKg(deviceId);
  await api.post('/api/integrations/smart-scale/connect');
  const source: WeightRecordSource = 'smart_scale_sync';
  await api.post('/api/integrations/smart-scale/sync', { weightKg, source });
  return weightKg;
}

/** DELETE /integrations/smart-scale — lets the user withdraw consent (NFR-05). */
export function disconnectSmartScale(): Promise<void> {
  return api.delete('/api/integrations/smart-scale');
}
