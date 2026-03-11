import React, { useEffect, useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { styles } from './styles';

export default function SplashScreen() {
  const router = useSafeRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  // Logo容器淡入
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);

  // 文字淡入
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  // 跳转逻辑
  const navigateToNextScreen = useCallback(() => {
    // 防止重复跳转
    if (isNavigating) return;
    setIsNavigating(true);

    console.log('=== 开始跳转 ===');
    console.log('token:', token ? '存在' : '不存在');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('authLoading:', authLoading);

    try {
      if (token && isAuthenticated) {
        console.log('已登录，跳转到主页');
        // 跳转到 home 路由，而不是 /index，避免循环
        router.replace('/home');
        console.log('跳转命令已发送');
      } else {
        console.log('未登录，跳转到登录页');
        router.replace('/auth');
        console.log('跳转命令已发送');
      }
    } catch (error) {
      console.error('跳转失败:', error);
      setIsNavigating(false);
    }
  }, [router, token, isAuthenticated, authLoading, isNavigating]);

  useEffect(() => {
    console.log('Splash useEffect 执行');
    console.log('authLoading:', authLoading);
    console.log('isNavigating:', isNavigating);

    // 防止重复执行
    if (isNavigating) return;

    // 1. Logo淡入和缩放
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });

    // 2. 文字延迟淡入（延迟300ms）
    textOpacity.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.ease }));
    textTranslateY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));

    // 3. 等待 AuthContext 初始化完成后，延迟3秒跳转
    if (!authLoading) {
      console.log('AuthContext 已就绪，3秒后跳转');
      const timer = setTimeout(() => {
        navigateToNextScreen();
      }, 3000);

      return () => {
        console.log('清理定时器');
        clearTimeout(timer);
      };
    }
  }, [authLoading, navigateToNextScreen, isNavigating]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Logo部分 */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.circle}>
          <View style={styles.iconsContainer}>
            <FontAwesome6 name="utensils" size={48} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>

      {/* 文字部分 - 独立在logo下方 */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Animated.Text style={styles.title}>干饭了</Animated.Text>
        <Animated.Text style={styles.subtitle}>温暖的吃饭提醒工具</Animated.Text>
      </Animated.View>
    </View>
  );
}
