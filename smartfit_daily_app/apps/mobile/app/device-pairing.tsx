import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Button } from '../src/components/Button';
import { ConsentModal } from '../src/components/ConsentModal';
import { logout } from '../src/services/authService';
import { getIntegrationConnections } from '../src/services/profile';
import {
  disconnectSmartScale,
  pairAndSyncSmartScale,
  scanForScales,
  type ScannedScale,
} from '../src/services/smartScale';
import {
  connectWearable,
  disconnectWearable,
  requestWearablePermission,
  syncLatestSessionWearableReading,
} from '../src/services/wearable';
import { colors, radius, spacing, typography } from '../src/constants/theme';

type DeviceStatus = 'not_connected' | 'connecting' | 'connected' | 'error';

/**
 * INT-2, INT-3 · REQ-12, REQ-13 — mirrors v1/12-device-pairing.html.
 * This companion app's main screen (see app/_layout.tsx — trimmed
 * 2026-08-29 when the rest of the product moved to apps/web). Shows an
 * explicit consent step before connecting either device (NFR-05) — no
 * auto-connect — and lets the user disconnect afterward.
 *
 * There is no dedicated status endpoint for either integration (only
 * connect/disconnect/sync/readings routes exist — see
 * apps/web/server/routes/integration-gateway/index.ts), so `scaleStatus`/
 * `wearableStatus` are seeded on mount from GET /api/profile's
 * `integrationConnections` field instead (see src/services/profile.ts).
 *
 * The manual weight-entry fallback (when Bluetooth fails) lives in
 * apps/web/client/src/pages/ProfileScreen.tsx instead, not here — it needs
 * no native capability, and testing/using it through this Expo app wasn't
 * practical, so it moved to the web app the rest of the product already
 * lives in.
 */
export default function DevicePairingScreen() {
  const router = useRouter();

  const [scaleStatus, setScaleStatus] = useState<DeviceStatus>('not_connected');
  const [scaleError, setScaleError] = useState<string | null>(null);
  const [scaleConsentVisible, setScaleConsentVisible] = useState(false);
  const [scalePickerVisible, setScalePickerVisible] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedScale[]>([]);
  const stopScanRef = useRef<(() => void) | null>(null);

  const [wearableStatus, setWearableStatus] = useState<DeviceStatus>('not_connected');
  const [wearableError, setWearableError] = useState<string | null>(null);
  const [wearableConsentVisible, setWearableConsentVisible] = useState(false);

  const [isSyncingSession, setIsSyncingSession] = useState(false);
  const [sessionSyncMessage, setSessionSyncMessage] = useState<string | null>(null);
  const [sessionSyncError, setSessionSyncError] = useState<string | null>(null);

  // Seed both cards' connected state from the profile doc on launch — see
  // this component's doc comment above for why there's no dedicated status
  // endpoint to call instead.
  useEffect(() => {
    getIntegrationConnections().then((connections) => {
      if (connections?.smartScale.connectionStatus === 'connected') setScaleStatus('connected');
      if (connections?.wearable.connectionStatus === 'connected') setWearableStatus('connected');
    });
  }, []);

  async function handleSignOut() {
    stopScanRef.current?.();
    await logout();
    router.replace('/pairing-code');
  }

  // ---- Smart scale (INT-2) --------------------------------------------

  function openScalePicker() {
    setScaleError(null);
    setScannedDevices([]);
    setScalePickerVisible(true);
    stopScanRef.current = scanForScales(
      (device) => setScannedDevices((prev) => (prev.some((d) => d.id === device.id) ? prev : [...prev, device])),
      (error) => {
        setScalePickerVisible(false);
        setScaleStatus('error');
        setScaleError(error.message);
      },
    );
  }

  function closeScalePicker() {
    stopScanRef.current?.();
    stopScanRef.current = null;
    setScalePickerVisible(false);
  }

  async function handlePickScale(device: ScannedScale) {
    closeScalePicker();
    setScaleStatus('connecting');
    setScaleError(null);
    try {
      await pairAndSyncSmartScale(device.id);
      setScaleStatus('connected');
    } catch (e) {
      setScaleStatus('error');
      setScaleError(e instanceof Error ? e.message : 'เชื่อมต่อตาชั่งอัจฉริยะไม่สำเร็จ กรุณาลองใหม่ หรือกรอกน้ำหนักด้วยตนเองที่หน้าเว็บโปรไฟล์');
    }
  }

  async function handleDisconnectScale() {
    try {
      await disconnectSmartScale();
    } finally {
      setScaleStatus('not_connected');
      setScaleError(null);
    }
  }

  // ---- Wearable (INT-3) -------------------------------------------------

  async function handleConfirmWearableConsent() {
    setWearableConsentVisible(false);
    setWearableStatus('connecting');
    setWearableError(null);
    try {
      await requestWearablePermission();
      await connectWearable();
      setWearableStatus('connected');
    } catch (e) {
      setWearableStatus('error');
      setWearableError(e instanceof Error ? e.message : 'เชื่อมต่อ Wearable ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  }

  async function handleDisconnectWearable() {
    try {
      await disconnectWearable();
    } finally {
      setWearableStatus('not_connected');
      setWearableError(null);
    }
  }

  async function handleSyncLatestSession() {
    setIsSyncingSession(true);
    setSessionSyncMessage(null);
    setSessionSyncError(null);
    try {
      const { calorieValueKcal, wasAlreadySynced, appliedToLog } = await syncLatestSessionWearableReading();
      const syncedLabel = wasAlreadySynced ? `ซิงค์ใหม่ทับค่าที่มีอยู่แล้ว: ${calorieValueKcal} kcal` : `ซิงค์แคลอรี่สำเร็จ: ${calorieValueKcal} kcal`;
      // appliedToLog is only true once the session is completed on the web
      // app — the server retroactively corrects that day's log/streak in
      // that case (see wearable.ts's postWearableReading comment); otherwise
      // the reading is just stored for session-complete to use later.
      setSessionSyncMessage(appliedToLog ? `${syncedLabel} — อัปเดตแคลอรี่ของวันนี้แล้ว` : syncedLabel);
    } catch (e) {
      setSessionSyncError(e instanceof Error ? e.message : 'ซิงค์แคลอรี่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSyncingSession(false);
    }
  }

  return (
    <ScreenContainer style={{ justifyContent: 'center', gap: spacing[6] }}>
      <Text style={typography.h1}>เชื่อมต่ออุปกรณ์</Text>

      <View style={{ gap: spacing[2] }}>
        <Button
          label={
            scaleStatus === 'connecting' ? 'กำลังเชื่อมต่อ...' : scaleStatus === 'connected' ? 'ตาชั่งเชื่อมต่อแล้ว' : 'เชื่อมต่อตาชั่งอัจฉริยะ'
          }
          disabled={scaleStatus === 'connecting' || scaleStatus === 'connected'}
          onPress={() => setScaleConsentVisible(true)}
        />
        {scaleStatus === 'connected' && <Button label="ยกเลิกการเชื่อมต่อตาชั่ง" variant="ghost" onPress={handleDisconnectScale} />}
        {scaleStatus === 'error' && scaleError && <Text style={styles.errorText}>{scaleError}</Text>}
      </View>

      <View style={{ gap: spacing[2] }}>
        <Button
          label={
            wearableStatus === 'connecting'
              ? 'กำลังเชื่อมต่อ...'
              : wearableStatus === 'connected'
                ? 'Wearable เชื่อมต่อแล้ว'
                : 'เชื่อมต่อ Wearable'
          }
          variant="secondary"
          disabled={wearableStatus === 'connecting' || wearableStatus === 'connected'}
          onPress={() => setWearableConsentVisible(true)}
        />
        {wearableStatus === 'connected' && (
          <>
            <Button
              label={isSyncingSession ? 'กำลังซิงค์...' : 'ซิงค์แคลอรี่จากการออกกำลังกายครั้งล่าสุด'}
              variant="secondary"
              disabled={isSyncingSession}
              onPress={handleSyncLatestSession}
            />
            {sessionSyncMessage && <Text style={[typography.bodySm, { color: colors.sageStrong }]}>{sessionSyncMessage}</Text>}
            {sessionSyncError && <Text style={styles.errorText}>{sessionSyncError}</Text>}
            <Button label="ยกเลิกการเชื่อมต่อ Wearable" variant="ghost" onPress={handleDisconnectWearable} />
          </>
        )}
        {wearableStatus === 'error' && wearableError && <Text style={styles.errorText}>{wearableError}</Text>}
      </View>

      <Button label="ออกจากระบบ" variant="ghost" onPress={handleSignOut} />

      <ConsentModal
        visible={scaleConsentVisible}
        title="อนุญาตให้เข้าถึงตาชั่งอัจฉริยะ"
        description="แอปจะอ่านค่าน้ำหนัก (และองค์ประกอบร่างกาย ถ้าอุปกรณ์รองรับ) จากตาชั่งอัจฉริยะของคุณผ่าน Bluetooth เพื่อบันทึกลงบัญชี smartFit_daily ของคุณ คุณสามารถยกเลิกการเชื่อมต่อได้ทุกเมื่อ"
        onConfirm={() => {
          setScaleConsentVisible(false);
          openScalePicker();
        }}
        onCancel={() => setScaleConsentVisible(false)}
      />

      <ConsentModal
        visible={wearableConsentVisible}
        title="อนุญาตให้เข้าถึงข้อมูล Wearable"
        description="แอปจะอ่านค่าแคลอรี่ที่เผาผลาญขณะออกกำลังกาย (Active Calories) จาก Apple Health หรือ Google Health Connect เพื่อใช้แทนค่าประมาณการณ์ MET เมื่อบันทึกการออกกำลังกาย คุณสามารถยกเลิกการเชื่อมต่อได้ทุกเมื่อ"
        onConfirm={handleConfirmWearableConsent}
        onCancel={() => setWearableConsentVisible(false)}
      />

      <Modal visible={scalePickerVisible} transparent animationType="slide" onRequestClose={closeScalePicker}>
        <View style={styles.backdrop}>
          <View style={styles.pickerCard}>
            <Text style={typography.h2}>เลือกตาชั่งอัจฉริยะ</Text>
            <View style={styles.scanningRow}>
              <ActivityIndicator color={colors.clay} />
              <Text style={[typography.bodySm, { color: colors.inkMuted }]}>กำลังค้นหาอุปกรณ์...</Text>
            </View>
            <FlatList
              data={scannedDevices}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 240 }}
              ListEmptyComponent={
                <Text style={[typography.bodySm, { color: colors.inkFaint }]}>ยังไม่พบตาชั่งอัจฉริยะในบริเวณใกล้เคียง</Text>
              }
              renderItem={({ item }) => (
                <Pressable style={styles.deviceRow} onPress={() => handlePickScale(item)}>
                  <Text style={typography.body}>{item.name}</Text>
                </Pressable>
              )}
            />
            <Button label="ยกเลิก" variant="ghost" onPress={closeScalePicker} />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorText: { ...typography.bodySm, color: colors.danger },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(51, 48, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing[6],
    gap: spacing[4],
  },
  scanningRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  deviceRow: {
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
