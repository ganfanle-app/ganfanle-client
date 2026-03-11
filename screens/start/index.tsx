import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { styles } from './styles';

export default function StartScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // 检查是否是第一次启动
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        if (!hasLaunched) {
          // 第一次启动，标记为已启动
          await AsyncStorage.setItem('hasLaunched', 'true');
          // 显示开屏动画
          router.replace('/splash');
        } else {
          // 不是第一次启动，直接根据登录状态跳转
          const token = await AsyncStorage.getItem('token');
          if (token) {
            router.replace('/');
          } else {
            router.replace('/auth');
          }
        }
      } catch (error) {
        console.error('检查启动状态失败:', error);
        // 默认跳转到主页
        router.replace('/');
      }
    };

    checkFirstLaunch();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFB3C6" />
    </View>
  );
}
