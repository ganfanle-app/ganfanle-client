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

export interface RelationshipRequest {
  id: string;
  from_user_id: string;
  from_nickname: string;
  status: 'pending' | 'accepted' | 'rejected';
  fromUser?: {
    name?: string;
    email?: string;
  };
}

interface RelationshipRequestDialogProps {
  visible: boolean;
  request: RelationshipRequest | null;
  onAccept: (type: 'single' | 'mutual') => void;
  onReject: () => void;
  onBlock: () => void;
}

export const RelationshipRequestDialog: React.FC<RelationshipRequestDialogProps> = ({
  visible,
  request,
  onAccept,
  onReject,
  onBlock,
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

  if (!request) return null;

  const senderName = request.fromUser?.name || request.from_nickname || '好友';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onReject}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialog,
            dialogAnimatedStyle,
          ]}
        >
          {/* 顶部图标区域 */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
              <FontAwesome6 name="heart" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              关心请求
            </Text>
          </View>

          {/* 内容区域 */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.textPrimary }]}>
              {senderName} 想关心你的用餐情况
            </Text>
            <Text style={[styles.subMessage, { color: theme.textSecondary }]}>
              你希望如何处理？
            </Text>
          </View>

          {/* 选项按钮 */}
          <View style={styles.optionsContainer}>
            {/* 选项1：允许单向 */}
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: theme.backgroundTertiary }]}
              onPress={() => onAccept('single')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <FontAwesome6 name="heart" size={20} color={theme.primary} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>
                  允许TA关心我
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>
                  单向，我可以提醒TA
                </Text>
              </View>
            </TouchableOpacity>

            {/* 选项2：互相关心 */}
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: theme.primary }]}
              onPress={() => onAccept('mutual')}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <FontAwesome6 name="handshake" size={20} color="#FFF" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: '#FFF' }]}>
                  互相关心
                </Text>
                <Text style={[styles.optionSubtitle, { color: '#FFFFFFDD' }]}>
                  双向，双方都能提醒
                </Text>
              </View>
            </TouchableOpacity>

            {/* 选项3：拒绝 */}
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: `${theme.error}15` }]}
              onPress={onReject}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <FontAwesome6 name="xmark" size={20} color={theme.error} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.error }]}>
                  拒绝
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>
                  不接受此次请求
                </Text>
              </View>
            </TouchableOpacity>

            {/* 选项4：拉黑 */}
            <TouchableOpacity
              style={[styles.optionButton, styles.blockButton]}
              onPress={onBlock}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <FontAwesome6 name="shield" size={20} color={theme.error} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.error }]}>
                  拉黑
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>
                  拉黑并拒绝请求
                </Text>
              </View>
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
    width: Math.min(340, SCREEN_WIDTH - 48),
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  blockButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
});
