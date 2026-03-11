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
import { useDialogScaleAnimation, useDialogOpacityAnimation, useOverlayAnimation } from '@/utils/dialogAnimation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RelationshipStatusDialogProps {
  visible: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  onClose: () => void;
}

export const RelationshipStatusDialog: React.FC<RelationshipStatusDialogProps> = ({
  visible,
  status,
  onClose,
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

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: 'clock',
          iconColor: theme.primary,
          title: '等待对方确认...',
          message: '已发送关心请求，请耐心等待对方处理',
          bgColor: `${theme.primary}15`,
        };
      case 'accepted':
        return {
          icon: 'check-circle',
          iconColor: theme.success,
          title: '对方已通过',
          message: '现在可以关心TA的用餐情况了',
          bgColor: `${theme.success}15`,
        };
      case 'rejected':
        return {
          icon: 'times-circle',
          iconColor: theme.error,
          title: '对方已拒绝',
          message: '对方拒绝了你的关心请求',
          bgColor: `${theme.error}15`,
        };
      default:
        return {
          icon: 'clock',
          iconColor: theme.primary,
          title: '等待对方确认...',
          message: '已发送关心请求，请耐心等待对方处理',
          bgColor: `${theme.primary}15`,
        };
    }
  };

  const config = getStatusConfig();

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
          {/* 顶部图标区域 */}
          <View style={[styles.header, { backgroundColor: config.bgColor }]}>
            <View style={styles.iconContainer}>
              <FontAwesome6 name={config.icon as any} size={40} color={config.iconColor} />
            </View>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              {config.title}
            </Text>
          </View>

          {/* 内容区域 */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.textPrimary }]}>
              {config.message}
            </Text>
          </View>

          {/* 确认按钮 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>知道了</Text>
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
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    opacity: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
