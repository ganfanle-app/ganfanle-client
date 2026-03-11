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
      fontSize: 24,
      fontWeight: '700',
    },
    userInfoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: Spacing.lg,
    },
    section: {
      marginBottom: Spacing['2xl'],
    },
    mealRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
    },
    mealRowLast: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.lg,
      borderBottomWidth: 0,
    },
    mealLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    mealIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    mealTextContainer: {
      flex: 1,
    },
    mealName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    mealDesc: {
      fontSize: 13,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.md,
      backgroundColor: theme.backgroundDefault,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.md,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: Spacing.md,
    },
    settingText: {
      fontSize: 15,
      fontWeight: '500',
    },
    switch: {
      width: 48,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.border,
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    switchActive: {
      backgroundColor: theme.primary,
    },
    switchKnob: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    saveButton: {
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
};
