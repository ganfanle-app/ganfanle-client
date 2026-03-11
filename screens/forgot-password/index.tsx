import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SuccessDialog } from '@/components/SuccessDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Spacing } from '@/constants/theme';
import { createStyles } from './styles';

export default function ForgotPasswordScreen() {
  const { theme, isDark } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles(theme);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 显示错误弹窗
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorDialog(true);
  };

  // 发送验证码
  const handleSendVerificationCode = async () => {
    if (!email) {
      showError('请先输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('请输入有效的邮箱地址');
      return;
    }

    setSendingCode(true);

    try {
      /**
       * 服务端文件：server/src/routes/password-reset.ts
       * 接口：POST /api/v1/password-reset/forgot-password
       * Body 参数：email: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/password-reset/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (result.error) {
        showError(result.error);
        setSendingCode(false);
        return;
      }

      // 开发环境下，在响应中返回验证码
      if (result.code) {
        console.log('验证码:', result.code);
        showError(`验证码已发送（开发环境）：${result.code}`);
      } else {
        showError('验证码已发送到您的邮箱');
      }

      // 开始倒计时
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码失败:', error);
      showError('发送验证码失败，请重试');
    } finally {
      setSendingCode(false);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!email) {
      showError('请输入邮箱地址');
      return;
    }

    if (!verificationCode) {
      showError('请输入验证码');
      return;
    }

    if (!newPassword) {
      showError('请输入新密码');
      return;
    }

    if (newPassword.length < 6) {
      showError('密码长度不能少于6位');
      return;
    }

    setLoading(true);

    try {
      /**
       * 服务端文件：server/src/routes/password-reset.ts
       * 接口：POST /api/v1/password-reset/reset-password
       * Body 参数：email: string, verificationCode: string, newPassword: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/password-reset/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            verificationCode,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        showError(result.error);
        setLoading(false);
        return;
      }

      setShowSuccessDialog(true);
    } catch (error) {
      console.error('重置密码失败:', error);
      showError('重置密码失败，请重试');
      setLoading(false);
    }
  };

  const handleSuccessDialogConfirm = () => {
    setShowSuccessDialog(false);
    // 清空表单
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setCountdown(0);
    // 返回登录页面
    router.back();
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
            size={24}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        {/* Logo 部分 */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <FontAwesome6 name="utensils" size={64} color={theme.primary} />
          </View>
          <ThemedText variant="h2" color={theme.textPrimary} style={styles.appName}>
            干饭了
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.appSlogan}>
            忘记密码？找回你的账号
          </ThemedText>
        </View>

        {/* 表单部分 */}
        <ThemedView level="default" style={styles.formSection}>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.formTitle}>
            重置密码
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.formHint}>
            请输入注册时使用的邮箱地址，我们将向你发送验证码
          </ThemedText>

          {/* 邮箱输入 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <FontAwesome6 name="envelope" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="请输入邮箱"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* 验证码输入 */}
          <View style={styles.verificationCodeContainer}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <FontAwesome6 name="key" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="请输入验证码"
                placeholderTextColor={theme.textMuted}
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.sendCodeButton,
                countdown > 0 && { backgroundColor: theme.backgroundDefault },
              ]}
              onPress={handleSendVerificationCode}
              disabled={sendingCode || countdown > 0}
              activeOpacity={0.8}
            >
              <ThemedText
                variant="smallMedium"
                color={countdown > 0 ? theme.textMuted : theme.buttonPrimaryText}
              >
                {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒` : '获取验证码'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* 新密码输入 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <FontAwesome6 name="lock" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="请输入新密码（至少6位）"
                placeholderTextColor={theme.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
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
              {loading ? '处理中...' : '重置密码'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* 提示信息 */}
        <ThemedText variant="caption" color={theme.textMuted} style={styles.footerHint}>
          如果收不到邮件，请检查垃圾邮件文件夹
        </ThemedText>

        {/* 成功对话框 */}
        <SuccessDialog
          visible={showSuccessDialog}
          message="密码重置成功！请使用新密码登录"
          onConfirm={handleSuccessDialogConfirm}
        />

        {/* 错误提示对话框 */}
        <ConfirmDialog
          visible={showErrorDialog}
          title="提示"
          message={errorMessage}
          confirmText="确定"
          cancelText=""
          onConfirm={() => setShowErrorDialog(false)}
          onCancel={() => setShowErrorDialog(false)}
        />
      </View>
    </Screen>
  );
}
