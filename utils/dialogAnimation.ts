import { useSharedValue, withSpring, withTiming, Easing } from 'react-native-reanimated';

/**
 * 弹窗动画配置工具函数
 * 提供流畅自然的弹窗动画效果
 */

/**
 * 获取弹窗缩放动画配置
 * 使用弹簧动画，让弹出效果更自然
 */
export const useDialogScaleAnimation = () => {
  const scale = useSharedValue(0.9);

  const show = () => {
    'worklet';
    scale.value = withSpring(1, {
      mass: 0.8,
      stiffness: 100,
      damping: 12,
    });
  };

  const hide = () => {
    'worklet';
    scale.value = withSpring(0.9, {
      mass: 0.5,
      stiffness: 200,
      damping: 15,
    });
  };

  return { scale, show, hide };
};

/**
 * 获取弹窗透明度动画配置
 * 使用缓动曲线，让淡入淡出更平滑
 */
export const useDialogOpacityAnimation = () => {
  const opacity = useSharedValue(0);

  const show = () => {
    'worklet';
    opacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
  };

  const hide = () => {
    'worklet';
    opacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.in(Easing.cubic),
    });
  };

  return { opacity, show, hide };
};

/**
 * 获取遮罩层动画配置
 * 更长的淡入时间，让背景渐变更自然
 */
export const useOverlayAnimation = () => {
  const opacity = useSharedValue(0);

  const show = () => {
    'worklet';
    opacity.value = withTiming(0.4, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  };

  const hide = () => {
    'worklet';
    opacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.in(Easing.quad),
    });
  };

  return { opacity, show, hide };
};
