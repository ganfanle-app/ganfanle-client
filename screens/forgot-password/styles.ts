import { StyleSheet, Platform } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: Spacing.lg,
    },
    backButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
      left: Spacing.lg,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.backgroundDefault,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoSection: {
      alignItems: 'center',
      marginTop: Spacing['5xl'],
      marginBottom: Spacing['3xl'],
    },
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    appName: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: Spacing.sm,
    },
    appSlogan: {
      fontSize: 16,
    },
    formSection: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.lg,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    formHint: {
      fontSize: 14,
      marginBottom: Spacing.lg,
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    // 验证码输入容器（横向排列）
    verificationCodeContainer: {
      flexDirection: 'row',
      marginBottom: Spacing.lg,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    input: {
      flex: 1,
      marginLeft: Spacing.sm,
      fontSize: 16,
      color: theme.textPrimary,
    },
    sendCodeButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.primary,
      marginLeft: Spacing.sm,
      minWidth: 90,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    footerHint: {
      textAlign: 'center',
      marginTop: Spacing.md,
    },
  });
};
