import React, { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { SuccessDialog } from '@/components/SuccessDialog';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

export default function ResetPasswordScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const router = useSafeRouter();
  const { token } = useSafeSearchParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert('错误', '重置链接无效');
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert('提示', '请输入新密码和确认密码');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('提示', '密码长度不能少于 6 位');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      /**
       * 服务端文件：server/src/routes/password-reset.ts
       * 接口：POST /api/v1/password-reset/reset-password
       * Body 参数：token: string, newPassword: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/password-reset/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const result = await response.json();

      if (result.error) {
        Alert.alert('错误', result.error);
        return;
      }

      setShowSuccessDialog(true);
    } catch (error) {
      console.error('重置密码失败:', error);
      Alert.alert('错误', '重置密码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    router.replace('/auth');
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* Logo 部分 */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <FontAwesome6 name="utensils" size={64} color={theme.primary} />
          </View>
          <ThemedText variant="h2" color={theme.textPrimary} style={styles.appName}>
            干饭了
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.appSlogan}>
            重置你的密码
          </ThemedText>
        </View>

        {/* 表单部分 */}
        <ThemedView level="default" style={styles.formSection}>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.formTitle}>
            设置新密码
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.formHint}>
            密码长度不能少于 6 位
          </ThemedText>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <FontAwesome6 name="lock" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="请输入新密码"
                placeholderTextColor={theme.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <FontAwesome6 name="lock" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="请确认新密码"
                placeholderTextColor={theme.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={!loading ? handleResetPassword : undefined}
            activeOpacity={0.8}
            disabled={loading}
          >
            <ThemedText
              variant="body"
              color={theme.buttonPrimaryText}
              style={styles.buttonText}
            >
              {loading ? '重置中...' : '重置密码'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* 提示信息 */}
        <ThemedText variant="caption" color={theme.textMuted} style={styles.footerHint}>
          重置成功后，请使用新密码登录
        </ThemedText>

        {/* 成功对话框 */}
        <SuccessDialog
          visible={showSuccessDialog}
          message="你的密码已重置成功，现在可以使用新密码登录了"
          onConfirm={handleSuccessConfirm}
        />
      </View>
    </Screen>
  );
}
