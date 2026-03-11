import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';
import { createStyles } from './styles';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Ionicons } from '@expo/vector-icons';

export default function AddFriendScreen() {
  const router = useSafeRouter();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleErrorConfirm = () => {
    setShowErrorDialog(false);
    setErrorMessage('');
    router.back(); // 返回首页
  };

  const handleAddFriend = async () => {
    console.log('handleAddFriend called, email:', email, 'nickname:', nickname);

    if (!email) {
      Alert.alert('提示', '请输入对方邮箱');
      return;
    }
    if (!nickname) {
      Alert.alert('提示', '请输入对方昵称');
      return;
    }

    setLoading(true);
    console.log('开始添加好友...');

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token:', token ? '已获取' : '未获取');

      if (!token) {
        setLoading(false);
        Alert.alert('错误', '请先登录');
        return;
      }

      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：POST /api/v1/relationships
       * Body 参数：email: string, nickname: string
       */
      const apiUrl = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, nickname }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Response result:', result);
      console.log('Response error:', result.error);

      if (response.ok) {
        console.log('发送请求成功');
        setLoading(false);
        // 使用 ConfirmDialog 显示成功提示，然后返回首页
        // 首页会通过短轮询检测状态变化，并在对方确认时显示弹窗
        setErrorMessage('请求已发送，请耐心等待对方确认');
        setShowErrorDialog(true);
      } else {
        console.log('添加好友失败，进入错误处理分支');
        console.log('错误信息:', result.error);
        setLoading(false);

        // 使用 ConfirmDialog 显示错误信息
        setErrorMessage(result.error || '添加好友失败');
        setShowErrorDialog(true);
      }
    } catch (error: any) {
      console.error('添加好友异常:', error);
      setLoading(false);
      setErrorMessage(error.message || '添加好友失败');
      setShowErrorDialog(true);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.header}>
            <View style={[styles.headerIcon, { backgroundColor: `${theme.primary}20` }]}>
              <FontAwesome6 name="user-plus" size={36} color={theme.primary} />
            </View>
            <ThemedText variant="h2" color={theme.textPrimary} style={{ textAlign: 'center' }}>
              添加关心的人
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary} style={{ textAlign: 'center', marginTop: Spacing.sm }}>
              输入对方的邮箱和昵称来添加
            </ThemedText>
          </View>

          <View style={styles.form}>
            <ThemedView level="tertiary" style={styles.inputContainer}>
              <FontAwesome6 name="envelope" size={20} color={theme.textMuted} style={styles.inputIcon} />
              <View style={styles.inputWrapper}>
                <ThemedText variant="caption" color={theme.textMuted}>邮箱</ThemedText>
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="请输入邮箱"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </ThemedView>

            <ThemedView level="tertiary" style={styles.inputContainer}>
              <FontAwesome6 name="user" size={20} color={theme.textMuted} style={styles.inputIcon} />
              <View style={styles.inputWrapper}>
                <ThemedText variant="caption" color={theme.textMuted}>昵称</ThemedText>
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="请输入昵称"
                  placeholderTextColor={theme.textMuted}
                  value={nickname}
                  onChangeText={setNickname}
                />
              </View>
            </ThemedView>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border, borderWidth: 1 }]}
              onPress={() => router.back()}
              disabled={loading}
            >
              <ThemedText variant="smallMedium" color={theme.textPrimary}>取消</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleAddFriend}
              disabled={loading}
            >
              <ThemedText variant="smallMedium" color={theme.buttonPrimaryText}>
                {loading ? '添加中...' : '添加'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 错误提示对话框 */}
      <ConfirmDialog
        visible={showErrorDialog}
        title="提示"
        message={errorMessage}
        confirmText="知道了"
        cancelText=""
        onConfirm={handleErrorConfirm}
        onCancel={handleErrorConfirm}
        destructive={false}
      />
    </Screen>
  );
}
