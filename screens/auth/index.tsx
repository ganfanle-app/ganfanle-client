import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Spacing } from '@/constants/theme';
import { createStyles } from './styles';

export default function AuthPage() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const router = useSafeRouter();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
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
    // 验证邮箱格式
    /* eslint-disable-next-line regexp/no-super-linear-backtracking */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('请先输入正确的邮箱地址');
      return;
    }

    setSendingCode(true);

    try {
      /**
       * 服务端文件：server/src/routes/auth.ts
       * 接口：POST /api/v1/auth/send-verification-code
       * Body 参数：email: string, type: 'register' | 'reset_password'
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'register' }),
      });

      const { data, error } = await response.json();

      if (error) {
        showError(error);
        setSendingCode(false);
        return;
      }

      // 开发环境下，在响应中返回验证码，显示给用户
      if (data.code) {
        console.log('验证码:', data.code);
        showError(`验证码已发送（开发环境）：${data.code}`);
      } else {
        showError('验证码已发送到您的邮箱');
      }

      // 开始倒计时
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('发送验证码失败，请重试');
    } finally {
      setSendingCode(false);
    }
  };

  const handleAuth = async () => {
    // 验证
    if (!email || !password) {
      showError('请填写邮箱和密码');
      return;
    }

    if (!isLogin && !name) {
      showError('请填写昵称');
      return;
    }

    // 注册时需要验证码
    if (!isLogin) {
      if (!verificationCode) {
        showError('请填写验证码');
        return;
      }
      // 验证码格式检查：必须是6位数字
      if (!/^\d{6}$/.test(verificationCode.trim())) {
        showError('验证码格式不正确，请输入6位数字');
        return;
      }
    }

    if (password.length < 6) {
      showError('密码长度不能少于6位');
      return;
    }

    // 验证邮箱格式
    /* eslint-disable-next-line regexp/no-super-linear-backtracking */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('邮箱格式不正确');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { name, email, password, verificationCode: verificationCode.trim() };

      /**
       * 服务端文件：server/src/routes/auth.ts
       * 接口：POST /api/v1/auth/login 或 POST /api/v1/auth/register
       * Body 参数：
       *   - 登录：email: string, password: string
       *   - 注册：name: string, email: string, password: string, verificationCode: string
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const { data, error } = await response.json();

      if (error) {
        // 如果是登录且提示账号尚未注册，显示确认对话框
        if (isLogin && error === '账号尚未注册') {
          setTempEmail(email);
          setTempPassword(password);
          setShowRegisterConfirm(true);
          setLoading(false);
          return;
        }
        showError(error);
        setLoading(false);
        return;
      }

      // 保存 token 和用户信息到 AuthContext
      await login(data.token, data.user);

      // 跳转到首页
      router.replace('/');
    } catch (error) {
      console.error('认证失败:', error);
      showError('操作失败，请重试');
      setLoading(false);
    }
  };

  const handleJumpToRegister = () => {
    // 保存当前输入的邮箱和密码
    setEmail(tempEmail);
    setPassword(tempPassword);
    // 切换到注册模式
    setIsLogin(false);
    // 关闭对话框
    setShowRegisterConfirm(false);
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: theme.primary }]}>
              <Ionicons name="restaurant" size={48} color={theme.buttonPrimaryText} />
            </View>
            <ThemedText variant="displayMedium" color={theme.textPrimary} style={styles.title}>
              干饭了
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary} style={styles.subtitle}>
              温暖的吃饭提醒工具
            </ThemedText>
          </View>

          {/* 表单 */}
          <ThemedView level="default" style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <ThemedText variant="label" color={theme.textSecondary} style={styles.inputLabel}>
                  昵称
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundTertiary,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="请输入昵称"
                  placeholderTextColor={theme.textMuted}
                  maxLength={20}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <ThemedText variant="label" color={theme.textSecondary} style={styles.inputLabel}>
                邮箱
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundTertiary,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="请输入邮箱"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText variant="label" color={theme.textSecondary} style={styles.inputLabel}>
                密码
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundTertiary,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="请输入密码（至少6位）"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />
              {/* 忘记密码链接 */}
              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => router.push('/forgot-password')}
                >
                  <ThemedText variant="caption" color={theme.primary}>
                    忘记密码？
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {/* 验证码输入框（仅注册时显示） */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <ThemedText variant="label" color={theme.textSecondary} style={styles.inputLabel}>
                  验证码
                </ThemedText>
                <View style={styles.verificationCodeContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.backgroundTertiary,
                        color: theme.textPrimary,
                        borderColor: theme.border,
                        flex: 1,
                        marginRight: Spacing.sm,
                      },
                    ]}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="请输入验证码"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendCodeButton,
                      {
                        backgroundColor: countdown > 0 ? theme.backgroundDefault : theme.primary,
                      },
                    ]}
                    onPress={handleSendVerificationCode}
                    disabled={sendingCode || countdown > 0}
                  >
                    <ThemedText
                      variant="smallMedium"
                      color={countdown > 0 ? theme.textMuted : theme.buttonPrimaryText}
                    >
                      {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒` : '获取验证码'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 提交按钮 */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleAuth}
              disabled={loading}
            >
              <ThemedText variant="title" color={theme.buttonPrimaryText}>
                {loading ? '处理中...' : isLogin ? '登录' : '注册'}
              </ThemedText>
            </TouchableOpacity>

            {/* 切换登录/注册 */}
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <ThemedText variant="body" color={theme.primary} style={styles.switchText}>
                {isLogin ? '还没有账号？去注册' : '已有账号？去登录'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 跳转注册确认对话框 */}
      <ConfirmDialog
        visible={showRegisterConfirm}
        title="账号尚未注册"
        message="检测到该邮箱尚未注册，是否前往注册页面？"
        confirmText="前往注册"
        cancelText="取消"
        onConfirm={handleJumpToRegister}
        onCancel={() => setShowRegisterConfirm(false)}
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
    </Screen>
  );
}
