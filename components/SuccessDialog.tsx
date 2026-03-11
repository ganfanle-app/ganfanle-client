import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';

interface SuccessDialogProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  visible,
  message,
  onConfirm,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: theme.backgroundDefault,
              borderRadius: 20,
            },
          ]}
        >
          {/* 成功图标 */}
          <View style={[styles.iconContainer, { backgroundColor: `${theme.success}15` }]}>
            <FontAwesome6 name="circle-check" size={64} color={theme.success} />
          </View>

          {/* 成功消息 - 使用 ScrollView 支持长文本 */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            成功
          </Text>
          <ScrollView
            style={styles.messageScroll}
            contentContainerStyle={styles.messageContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={[styles.message, { color: theme.textSecondary }]}>
              {message}
            </Text>
          </ScrollView>

          {/* 确定按钮 */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: theme.buttonPrimaryText }]}>
              确定
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    maxHeight: SCREEN_HEIGHT * 0.7, // 最大高度为屏幕的 70%
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  messageScroll: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.35, // 消息区域最大高度
    marginBottom: 20,
  },
  messageContent: {
    flexGrow: 1,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
