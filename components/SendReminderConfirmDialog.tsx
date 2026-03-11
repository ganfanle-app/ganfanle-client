import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useDialogScaleAnimation, useOverlayAnimation } from '@/utils/dialogAnimation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SendReminderConfirmDialogProps {
  visible: boolean;
  userName?: string;
  mealType?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

const MEAL_EMOJIS: Record<string, string> = {
  breakfast: '🌞',
  lunch: '🍱',
  dinner: '🌙',
};

const MEAL_ICONS: Record<string, { name: any; color: string }> = {
  breakfast: { name: 'sun', color: '#FBBF24' },
  lunch: { name: 'utensils', color: '#F87171' },
  dinner: { name: 'moon', color: '#60A5FA' },
};

export const SendReminderConfirmDialog: React.FC<SendReminderConfirmDialogProps> = ({
  visible,
  userName,
  mealType,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();

  // 使用优化的动画配置
  const { scale: dialogScale, show: showDialog, hide: hideDialog } = useDialogScaleAnimation();
  const { opacity: overlayOpacity, show: showOverlay, hide: hideOverlay } = useOverlayAnimation();

  useEffect(() => {
    if (visible) {
      showDialog();
      showOverlay();
    } else {
      hideDialog();
      hideOverlay();
    }
  }, [visible]);

  const dialogAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dialogScale.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const mealLabel = MEAL_TYPE_LABELS[mealType || 'lunch'] || '午餐';
  const mealEmoji = MEAL_EMOJIS[mealType || 'lunch'] || '🍱';
  const mealIcon = MEAL_ICONS[mealType || 'lunch'] || MEAL_ICONS.lunch;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialog,
            dialogAnimatedStyle,
          ]}
        >
          {/* 顶部图标区域 */}
          <View style={[styles.iconContainer, { backgroundColor: `${mealIcon.color}20` }]}>
            <FontAwesome6 name={mealIcon.name} size={48} color={mealIcon.color} />
            <Text style={styles.iconEmoji}>{mealEmoji}</Text>
          </View>

          {/* 标题 */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            提醒{userName}吃{mealLabel}
          </Text>

          {/* 描述 */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            让TA知道你在关心TA
          </Text>

          {/* 底部按钮组 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: theme.backgroundTertiary }]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                取消
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sendButton, { backgroundColor: theme.primary }]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="paper-plane" size={18} color="#FFF" />
              <Text style={[styles.buttonText, { color: '#FFFFFF', marginLeft: 8 }]}>
                发送提醒
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    width: Math.min(320, SCREEN_WIDTH - 48),
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    opacity: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  iconEmoji: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 48,
  },
  cancelButton: {
    // 样式通过 theme 传入
  },
  sendButton: {
    // 样式通过 theme 传入
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
