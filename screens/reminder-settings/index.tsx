import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SuccessDialog } from '@/components/SuccessDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { TimePicker } from '@/components/TimePicker';

interface ReminderSettings {
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  reminder_enabled: boolean;
}

export default function ReminderSettingsScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ relationshipId: string; userName: string }>();
  
  const [settings, setSettings] = useState<ReminderSettings>({
    breakfast_time: '08:00',
    lunch_time: '12:00',
    dinner_time: '18:00',
    reminder_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !params?.relationshipId) {
        Alert.alert('错误', '参数错误');
        return;
      }

      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：GET /api/v1/relationships/:id/reminder-settings
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships/${params.relationshipId}/reminder-settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log('[ReminderSettings] 获取设置成功，原始数据:', result);

      if (response.ok) {
        // 转换驼峰格式到下划线格式
        const convertedSettings = {
          breakfast_time: result.data?.breakfastTime || settings.breakfast_time,
          lunch_time: result.data?.lunchTime || settings.lunch_time,
          dinner_time: result.data?.dinnerTime || settings.dinner_time,
          reminder_enabled: result.data?.reminderEnabled ?? settings.reminder_enabled,
        };
        console.log('[ReminderSettings] 转换后的设置:', convertedSettings);
        setSettings(convertedSettings);
      } else {
        Alert.alert('失败', result.error || '获取设置失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '获取设置失败');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSettings();
    }, [params?.relationshipId])
  );

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    router.back();
  };

  const handleSave = async () => {
    console.log('[ReminderSettings] 开始保存设置');
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !params?.relationshipId) {
        console.log('[ReminderSettings] 参数错误，token:', !!token, 'relationshipId:', params?.relationshipId);
        Alert.alert('错误', '参数错误');
        setSaving(false);
        return;
      }

      const requestData = {
        breakfastTime: settings.breakfast_time,
        lunchTime: settings.lunch_time,
        dinnerTime: settings.dinner_time,
        reminderEnabled: settings.reminder_enabled,
      };
      console.log('[ReminderSettings] 发送数据:', requestData);

      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：PUT /api/v1/relationships/:id/reminder-settings
       * Body 参数：breakfastTime: string, lunchTime: string, dinnerTime: string, reminderEnabled: boolean
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships/${params.relationshipId}/reminder-settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log('[ReminderSettings] 响应状态:', response.status);
      const result = await response.json();
      console.log('[ReminderSettings] 响应数据:', result);

      if (response.ok) {
        console.log('[ReminderSettings] 保存成功');
        setSaving(false);
        setShowSuccessDialog(true);
      } else {
        console.log('[ReminderSettings] 保存失败:', result);
        setSaving(false);
        Alert.alert('失败', result.error || '保存设置失败');
      }
    } catch (error: any) {
      console.error('[ReminderSettings] 保存异常:', error);
      setSaving(false);
      Alert.alert('错误', error.message || '保存设置失败');
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 顶部导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.title}>
            提醒设置
          </ThemedText>
          <View style={styles.navButton} />
        </View>

        {/* 用户信息 */}
        <ThemedView level="default" style={styles.userInfoCard}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <ThemedText variant="h3" color={theme.buttonPrimaryText}>
              {params?.userName?.charAt(0) || '?'}
            </ThemedText>
          </View>
          <View>
            <ThemedText variant="body" color={theme.textPrimary}>
              {params?.userName || '未知用户'}
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted}>
              设置该用户的用餐提醒时间
            </ThemedText>
          </View>
        </ThemedView>

        {/* 提醒时间 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            提醒时间
          </ThemedText>

          {/* 早餐 */}
          <View style={styles.mealRow}>
            <View style={styles.mealLeft}>
              <View style={[styles.mealIconContainer, { backgroundColor: '#FFF7ED' }]}>
                <FontAwesome6 name="sun" size={18} color="#F59E0B" />
              </View>
              <View style={styles.mealTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} style={styles.mealName}>
                  早餐
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.mealDesc}>
                  {settings.breakfast_time}
                </ThemedText>
              </View>
            </View>
            <TimePicker
              label=""
              value={settings.breakfast_time}
              onChange={(val) => setSettings({ ...settings, breakfast_time: val })}
              mealType="breakfast"
            />
          </View>

          {/* 午餐 */}
          <View style={styles.mealRow}>
            <View style={styles.mealLeft}>
              <View style={[styles.mealIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <FontAwesome6 name="utensils" size={18} color="#3B82F6" />
              </View>
              <View style={styles.mealTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} style={styles.mealName}>
                  午餐
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.mealDesc}>
                  {settings.lunch_time}
                </ThemedText>
              </View>
            </View>
            <TimePicker
              label=""
              value={settings.lunch_time}
              onChange={(val) => setSettings({ ...settings, lunch_time: val })}
              mealType="lunch"
            />
          </View>

          {/* 晚餐 */}
          <View style={styles.mealRowLast}>
            <View style={styles.mealLeft}>
              <View style={[styles.mealIconContainer, { backgroundColor: '#EEF2FF' }]}>
                <FontAwesome6 name="moon" size={18} color="#6366F1" />
              </View>
              <View style={styles.mealTextContainer}>
                <ThemedText variant="body" color={theme.textPrimary} style={styles.mealName}>
                  晚餐
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} style={styles.mealDesc}>
                  {settings.dinner_time}
                </ThemedText>
              </View>
            </View>
            <TimePicker
              label=""
              value={settings.dinner_time}
              onChange={(val) => setSettings({ ...settings, dinner_time: val })}
              mealType="dinner"
            />
          </View>
        </View>

        {/* 其他设置 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            其他设置
          </ThemedText>

          <ThemedView level="tertiary" style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome6 name="bell" size={18} color={theme.primary} style={styles.settingIcon} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                启用提醒
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.switch, settings.reminder_enabled && styles.switchActive]}
              onPress={() => setSettings({ ...settings, reminder_enabled: !settings.reminder_enabled })}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.switchKnob,
                  settings.reminder_enabled && { transform: [{ translateX: 20 }] }
                ]}
              />
            </TouchableOpacity>
          </ThemedView>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <ThemedText variant="body" color={theme.buttonPrimaryText} style={styles.saveButtonText}>
            {saving ? '保存中...' : '保存设置'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* 成功提示对话框 */}
      <SuccessDialog
        visible={showSuccessDialog}
        message="设置保存成功"
        onConfirm={handleSuccessConfirm}
      />
    </Screen>
  );
}
