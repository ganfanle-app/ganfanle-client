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
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useDialogScaleAnimation, useDialogOpacityAnimation, useOverlayAnimation } from '@/utils/dialogAnimation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Reminder {
  id: number | string;
  from_user_id?: string;
  from_user_nickname?: string;
  from_user_email?: string;
  from_users?: {
    name?: string;
    avatar?: string;
  };
  meal_type: string;
  date: string;
  is_read?: boolean;
  created_at?: string;
}

interface ReminderNotificationProps {
  visible: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onView?: () => void;
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

export const ReminderNotification: React.FC<ReminderNotificationProps> = ({
  visible,
  reminder,
  onClose,
  onView,
}) => {
  const { theme } = useTheme();

  // 使用优化的动画配置
  const { scale: dialogScale, show: showDialog, hide: hideDialog } = useDialogScaleAnimation();
  const { opacity: overlayOpacity, show: showOverlay, hide: hideOverlay } = useOverlayAnimation();

  // 铃铛缩放动画
  const bellScale = useSharedValue(0);

  // 内容淡入动画
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      // 弹窗缩放
      showDialog();
      showOverlay();

      // 内容延迟淡入
      contentTranslateY.value = withDelay(
        100,
        withSpring(0, {
          mass: 0.5,
          stiffness: 80,
          damping: 12,
        })
      );
      contentOpacity.value = withDelay(
        100,
        withSpring(1, {
          mass: 0.5,
          stiffness: 80,
          damping: 12,
        })
      );

      // 铃铛缩放出现
      bellScale.value = withSpring(1, {
        mass: 0.6,
        stiffness: 120,
        damping: 10,
      });
    } else {
      hideDialog();
      hideOverlay();
      bellScale.value = withSpring(0, { mass: 0.3, stiffness: 200, damping: 15 });
      contentOpacity.value = 0;
      contentTranslateY.value = 20;
    }
  }, [visible]);

  const bellAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bellScale.value }],
  }));

  const dialogAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dialogScale.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  if (!reminder) return null;

  const mealLabel = MEAL_TYPE_LABELS[reminder.meal_type] || reminder.meal_type;
  const mealEmoji = MEAL_EMOJIS[reminder.meal_type] || '🍽️';
  const mealIcon = MEAL_ICONS[reminder.meal_type] || MEAL_ICONS.lunch;
  const sender = reminder.from_users?.name || reminder.from_user_nickname || reminder.from_user_email || '好友';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialog,
            dialogAnimatedStyle,
          ]}
        >
          {/* 顶部渐变装饰 */}
          <LinearGradient
            colors={[theme.primary, `${theme.primary}dd`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topDecoration}
          >
            {/* 铃铛图标 - 浮在装饰条上方 */}
            <View style={styles.bellContainer}>
              <Animated.View style={[styles.bellIconContainer, bellAnimatedStyle]}>
                <FontAwesome6 name="bell" size={40} color="#FFF" />
              </Animated.View>
            </View>
          </LinearGradient>

          {/* 内容区域 */}
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            {/* 标题 */}
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              💝 收到关心
            </Text>

            {/* 温暖的副标题 */}
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              有人正在想你哦~
            </Text>

            {/* 提醒卡片 */}
            <View style={[styles.reminderCard, { backgroundColor: `${theme.primary}08` }]}>
              <View style={[styles.iconBadge, { backgroundColor: `${mealIcon.color}20` }]}>
                <FontAwesome6 name={mealIcon.name} size={28} color={mealIcon.color} />
              </View>
              <View style={styles.reminderTextContainer}>
                <Text style={[styles.senderText, { color: theme.textPrimary }]}>
                  {sender}
                </Text>
                <Text style={[styles.reminderText, { color: theme.textSecondary }]}>
                  提醒你记得吃{mealLabel}
                </Text>
              </View>
              <Text style={styles.emoji}>{mealEmoji}</Text>
            </View>
          </Animated.View>

          {/* 按钮组 */}
          <Animated.View style={[styles.buttonGroup, contentAnimatedStyle]}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: theme.borderLight },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                稍后
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
              ]}
              onPress={onView}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.primary, `${theme.primary}dd`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <FontAwesome6 name="heart" size={18} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>
                  去看看
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
    width: Math.min(360, SCREEN_WIDTH - 48),
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    opacity: 1,
  },
  topDecoration: {
    height: 100,
    width: '100%',
    paddingTop: 20,
  },
  bellContainer: {
    alignItems: 'center',
  },
  bellIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  content: {
    padding: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 24,
    opacity: 0.8,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    width: '100%',
    gap: 14,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderTextContainer: {
    flex: 1,
  },
  senderText: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  emoji: {
    fontSize: 36,
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  primaryButton: {
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    flex: 1.3,
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
