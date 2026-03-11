import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from './ThemedText';

interface ConfirmDialogProps {
  visible: boolean;
  title?: string;
  message?: string; // 单行消息（可选，与 messageLines 二选一）
  messageLines?: string[]; // 多行消息（可选，与 message 二选一）
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean; // 是否为危险操作（删除等）
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  messageLines,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const { theme } = useTheme();

  // 如果提供了 messageLines，使用多行显示；否则使用单行 message
  // 如果 message 包含 \n，将其拆分成多行
  const displayLines = messageLines || (message ? message.split('\n') : []);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.overlay} onStartShouldSetResponder={() => true}>
          <View
            style={[
              styles.dialog,
              {
                backgroundColor: theme.backgroundDefault,
                borderRadius: 20,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* 标题 */}
            {title && (
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  {title}
                </Text>
              </View>
            )}

            {/* 内容 */}
            <View style={styles.content}>
              {displayLines.map((line, index) => (
                <Text
                  key={index}
                  style={[
                    styles.message,
                    {
                      color: theme.textSecondary,
                      marginBottom: index < displayLines.length - 1 ? 8 : 0,
                    },
                  ]}
                >
                  {line}
                </Text>
              ))}
            </View>

            {/* 按钮 */}
            <View style={[styles.footer, !cancelText && styles.singleButtonFooter]}>
              {cancelText && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    {
                      backgroundColor: theme.backgroundTertiary,
                      borderColor: theme.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  !cancelText && styles.singleButton,
                  destructive
                    ? styles.destructiveButton
                    : styles.confirmButton,
                  { backgroundColor: destructive ? theme.error : theme.primary },
                ]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: destructive ? '#FFFFFF' : theme.buttonPrimaryText },
                  ]}
                >
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    padding: 28,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    marginBottom: 28,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  singleButtonFooter: {
    gap: 0,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  singleButton: {
    flex: 0,
    minWidth: 140,
  },
  cancelButton: {},
  confirmButton: {},
  destructiveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
