import { Modal, Text, View, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors, radius, spacing, typography } from '../constants/theme';

interface ConsentModalProps {
  visible: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * NFR-05 consent step shared by both device flows — must be shown, and
 * explicitly confirmed, before any Bluetooth/HealthKit/Health Connect
 * permission request or `connect` call. No auto-connect.
 */
export function ConsentModal({ visible, title, description, onConfirm, onCancel }: ConsentModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={typography.h2}>{title}</Text>
          <Text style={[typography.body, { color: colors.inkMuted }]}>{description}</Text>
          <View style={styles.actions}>
            <Button label="ยกเลิก" variant="ghost" onPress={onCancel} />
            <Button label="ยินยอมและเชื่อมต่อ" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(51, 48, 42, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: spacing[6],
    gap: spacing[4],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3],
  },
});
