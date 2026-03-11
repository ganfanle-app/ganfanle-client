import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      padding: Spacing.xl,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: Spacing['6xl'],
    },
    logo: {
      width: 110,
      height: 110,
      borderRadius: 55,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    title: {
      marginBottom: Spacing.sm,
    },
    subtitle: {
      marginBottom: Spacing.xl,
    },
    formContainer: {
      padding: Spacing.xl,
      borderRadius: BorderRadius['2xl'],
      marginBottom: Spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
    },
    inputGroup: {
      marginBottom: Spacing.xl,
    },
    inputLabel: {
      marginBottom: Spacing.sm,
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      fontSize: 16,
      borderWidth: 0,
    },
    verificationCodeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sendCodeButton: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.xl,
      minWidth: 110,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: Spacing.md,
    },
    submitButton: {
      paddingVertical: Spacing.xl,
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      marginTop: Spacing.xl,
      marginBottom: Spacing.md,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    switchText: {
      textAlign: 'center',
    },
    tipContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipText: {
      marginLeft: Spacing.md,
    },
  });
};
