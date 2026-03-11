import { useEffect } from 'react';
import { useRootNavigationState, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ColorSchemeProvider } from '@/hooks/useColorScheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

function AuthGuard({ children }: { children: React.ReactNode }) {
  const rootState = useRootNavigationState();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useSafeRouter();

  useEffect(() => {
    // 1. 待机检测：导航未挂载 或 鉴权正在加载中，直接返回
    if (!rootState?.key || isLoading) return;

    // 2. 路径检测：确认当前不在登录页、splash页面、home页面、忘记密码或重置密码页面 (防止死循环)
    const inAuthRoute = segments[0] === 'auth';
    const inSplashRoute = segments[0] === 'splash';
    const inHomeRoute = segments[0] === 'home';
    const inForgotPasswordRoute = segments[0] === 'forgot-password';
    const inResetPasswordRoute = segments[0] === 'reset-password';

    // 3. Splash页面、Home页面、忘记密码、重置密码页面不进行认证检查
    if (inSplashRoute || inHomeRoute || inForgotPasswordRoute || inResetPasswordRoute) return;

    // 4. 未登录保护：未登录且不在登录页 → 跳转登录页
    if (!isAuthenticated && !inAuthRoute) {
      router.replace('/auth');
    }

    // 5. 已登录保护：已登录但在登录页 → 跳转首页
    if (isAuthenticated && inAuthRoute) {
      router.replace('/');
    }
  }, [rootState?.key, isAuthenticated, isLoading, segments]);
  // 移除 router 依赖，因为它每次渲染都是新的引用

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <ColorSchemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark"></StatusBar>
            <Stack screenOptions={{
              // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              // 隐藏自带的头部
              headerShown: false
            }}>
              <Stack.Screen name="splash" options={{ title: "" }} />
              <Stack.Screen name="auth" options={{ title: "" }} />
              <Stack.Screen name="home" options={{ title: "" }} />
              <Stack.Screen name="index" options={{ title: "" }} />
              <Stack.Screen name="add-friend" options={{ title: "" }} />
              <Stack.Screen name="friends" options={{ title: "" }} />
              <Stack.Screen name="settings" options={{ title: "" }} />
              <Stack.Screen name="reminder-settings" options={{ title: "" }} />
              <Stack.Screen name="blocked-users" options={{ title: "" }} />
              <Stack.Screen name="user-agreement" options={{ title: "" }} />
              <Stack.Screen name="disclaimer" options={{ title: "" }} />
              <Stack.Screen name="about" options={{ title: "" }} />
              <Stack.Screen name="privacy-policy" options={{ title: "" }} />
              <Stack.Screen name="forgot-password" options={{ title: "" }} />
              <Stack.Screen name="reset-password" options={{ title: "" }} />
            </Stack>
            <Toast />
          </GestureHandlerRootView>
        </ColorSchemeProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
