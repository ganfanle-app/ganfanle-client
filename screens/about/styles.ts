import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: Spacing.xl,
      paddingTop: Spacing['3xl'],
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xl,
    },
    navButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
    },
    logoSection: {
      alignItems: 'center',
      padding: Spacing['2xl'],
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.xl,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: Spacing.sm,
    },
    appSlogan: {
      fontSize: 14,
      marginBottom: Spacing.sm,
    },
    version: {
      marginTop: Spacing.xs,
    },
    section: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: Spacing.md,
    },
    paragraph: {
      lineHeight: 24,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    featureIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.md,
      marginBottom: Spacing.xs,
    },
    linkText: {
      fontSize: 15,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    contactText: {
      marginLeft: Spacing.md,
      fontSize: 14,
    },
    copyright: {
      textAlign: 'center',
      marginTop: Spacing.xl,
      marginBottom: Spacing.lg,
    },
  });
};
