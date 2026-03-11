import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { SuccessDialog } from '@/components/SuccessDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStyles } from './styles';

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { logout } = useAuth();

  // 状态管理
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [showFinalDeleteConfirmDialog, setShowFinalDeleteConfirmDialog] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // 加载设置
  const loadSettings = async () => {
    try {
      const storedNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
      const storedSoundEnabled = await AsyncStorage.getItem('soundEnabled');
      const storedVibrationEnabled = await AsyncStorage.getItem('vibrationEnabled');

      if (storedNotificationsEnabled !== null) {
        setNotificationsEnabled(storedNotificationsEnabled === 'true');
      }
      if (storedSoundEnabled !== null) {
        setSoundEnabled(storedSoundEnabled === 'true');
      }
      if (storedVibrationEnabled !== null) {
        setVibrationEnabled(storedVibrationEnabled === 'true');
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
  };

  // 保存设置
  const handleSave = async () => {
    console.log('[Settings] 开始保存设置');
    try {
      await AsyncStorage.setItem('notificationsEnabled', String(notificationsEnabled));
      await AsyncStorage.setItem('soundEnabled', String(soundEnabled));
      await AsyncStorage.setItem('vibrationEnabled', String(vibrationEnabled));
      console.log('[Settings] 保存成功');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('[Settings] 保存设置失败:', error);
      Alert.alert('保存失败', '设置保存失败，请重试');
    }
  };

  // 注销账号 - 显示第一次确认对话框
  const handleDeleteAccount = () => {
    console.log('[Settings] 注销账号按钮被点击');
    setShowDeleteConfirmDialog(true);
  };

  // 确认注销账号 - 显示第二次确认对话框
  const handleConfirmDeleteAccount = () => {
    console.log('[Settings] 用户第一次确认注销账号');
    setShowDeleteConfirmDialog(false);
    setShowFinalDeleteConfirmDialog(true);
  };

  // 最终确认注销账号 - 执行注销操作
  const handleFinalDeleteAccount = async () => {
    console.log('[Settings] 用户最终确认注销账号');
    setShowFinalDeleteConfirmDialog(false);
    setDeletingAccount(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('[Settings] 未找到 token');
        setDeletingAccount(false);
        return;
      }

      /**
       * 服务端文件：server/src/routes/settings.ts
       * 接口：DELETE /api/v1/settings/account
       * 说明：注销账号，删除用户及所有相关数据
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/settings/account`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log('[Settings] 注销账号响应:', result);

      if (result.error) {
        Alert.alert('注销失败', result.error);
        setDeletingAccount(false);
        return;
      }

      // 使用 AuthContext 的 logout 方法清除登录状态
      await logout();

      // 跳转到登录页
      router.replace('/auth');
    } catch (error) {
      console.error('[Settings] 注销账号失败:', error);
      Alert.alert('注销失败', '注销账号失败，请稍后重试');
      setDeletingAccount(false);
    }
  };

  // 取消第一次确认
  const handleCancelDeleteAccount = () => {
    console.log('[Settings] 用户取消注销账号');
    setShowDeleteConfirmDialog(false);
  };

  // 取消第二次确认
  const handleCancelFinalDeleteAccount = () => {
    console.log('[Settings] 用户取消最终确认');
    setShowFinalDeleteConfirmDialog(false);
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        scrollEnabled={true}
        removeClippedSubviews={false}
      >
        {/* 导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.navTitle}>
            设置
          </ThemedText>
          <View style={styles.navButton} /> {/* 占位，保持标题居中 */}
        </View>

        {/* 通知设置 */}
        <View style={styles.section}>
          <ThemedText variant="body" color={theme.textMuted} style={styles.sectionTitle}>
            通知设置
          </ThemedText>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome6 name="bell" size={20} color={theme.textPrimary} />
              <ThemedText variant="body" color={theme.textPrimary}>
                通知开关
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.switch, notificationsEnabled ? styles.switchOn : styles.switchOff]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <View style={[styles.switchKnob, notificationsEnabled ? styles.switchKnobOn : styles.switchKnobOff]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome6 name="volume-high" size={20} color={theme.textPrimary} />
              <ThemedText variant="body" color={theme.textPrimary}>
                提醒声音
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.switch, soundEnabled ? styles.switchOn : styles.switchOff]}
              onPress={() => setSoundEnabled(!soundEnabled)}
            >
              <View style={[styles.switchKnob, soundEnabled ? styles.switchKnobOn : styles.switchKnobOff]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome6 name="mobile-screen" size={20} color={theme.textPrimary} />
              <ThemedText variant="body" color={theme.textPrimary}>
                震动反馈
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.switch, vibrationEnabled ? styles.switchOn : styles.switchOff]}
              onPress={() => setVibrationEnabled(!vibrationEnabled)}
            >
              <View style={[styles.switchKnob, vibrationEnabled ? styles.switchKnobOn : styles.switchKnobOff]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 关于 */}
        <View style={styles.section}>
          <ThemedText variant="body" color={theme.textMuted} style={styles.sectionTitle}>
            关于
          </ThemedText>

          <TouchableOpacity
            style={[styles.clickableItem]}
            onPress={() => router.push('/about')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <FontAwesome6 name="circle-info" size={16} color={theme.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} pointerEvents="none">
                  关于我们
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} pointerEvents="none">
                  应用介绍与信息
                </ThemedText>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clickableItem]}
            onPress={() => router.push('/blocked-users')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <FontAwesome6 name="shield" size={16} color={theme.error} />
              </View>
              <View style={styles.settingTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} pointerEvents="none">
                  拉黑管理
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} pointerEvents="none">
                  管理已拉黑的用户
                </ThemedText>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clickableItem]}
            onPress={() => router.push('/user-agreement')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                <FontAwesome6 name="file-contract" size={16} color={theme.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} pointerEvents="none">
                  用户协议
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} pointerEvents="none">
                  查看服务协议
                </ThemedText>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clickableItem]}
            onPress={() => router.push('/disclaimer')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <FontAwesome6 name="triangle-exclamation" size={16} color={theme.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} pointerEvents="none">
                  免责条款
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} pointerEvents="none">
                  查看免责声明
                </ThemedText>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clickableItem]}
            onPress={() => router.push('/privacy-policy')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
                <FontAwesome6 name="user-shield" size={16} color={theme.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} pointerEvents="none">
                  隐私政策
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} pointerEvents="none">
                  查看隐私保护政策
                </ThemedText>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 危险操作 */}
        <View style={styles.section}>
          <ThemedText variant="body" color={theme.textMuted} style={styles.sectionTitle}>
            危险操作
          </ThemedText>

          <TouchableOpacity
            style={[styles.clickableItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <FontAwesome6 name="trash-can" size={16} color={theme.error} />
              </View>
              <View style={styles.settingTextContainer}>
                <ThemedText variant="body" color={theme.error} pointerEvents="none">
                  注销账号
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} pointerEvents="none">
                  永久删除账号及所有数据
                </ThemedText>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 版本信息 */}
        <ThemedText variant="caption" color={theme.textMuted} style={styles.version}>
          版本 1.0.0
        </ThemedText>

        {/* 保存按钮 */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <ThemedText variant="body" color={theme.buttonPrimaryText}>
            保存设置
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* 成功提示对话框 */}
      <SuccessDialog
        visible={showSuccessDialog}
        message="设置已保存"
        onConfirm={handleSuccessConfirm}
      />

      {/* 注销账号第一次确认对话框 */}
      <ConfirmDialog
        visible={showDeleteConfirmDialog}
        title="确认注销账号"
        messageLines={[
          '注销账号将永久删除以下数据：',
          '',
          '• 用户信息',
          '• 关系记录',
          '• 打卡记录',
          '• 提醒记录',
          '• 所有其他相关数据',
          '',
          '此操作不可恢复，确定要注销吗？'
        ]}
        confirmText="确定注销"
        cancelText="取消"
        onConfirm={handleConfirmDeleteAccount}
        onCancel={handleCancelDeleteAccount}
        destructive={true}
      />

      {/* 注销账号第二次确认对话框（最终警告） */}
      <ConfirmDialog
        visible={showFinalDeleteConfirmDialog}
        title="⚠️ 最后警告"
        messageLines={[
          '你即将永久注销账号！',
          '',
          '此操作将立即删除你的账号及所有数据，',
          '包括但不限于：',
          '',
          '• 所有打卡记录',
          '• 所有关系和好友',
          '• 所有提醒设置',
          '• 所有个人数据',
          '',
          '账号一旦注销将无法恢复！',
          '请再次确认是否继续？'
        ]}
        confirmText="我确认注销"
        cancelText="我再想想"
        onConfirm={handleFinalDeleteAccount}
        onCancel={handleCancelFinalDeleteAccount}
        destructive={true}
      />
    </Screen>
  );
}
