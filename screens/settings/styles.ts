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
    navTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    header: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: Spacing.md,
    },
    section: {
      marginBottom: Spacing['2xl'],
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.sm,
    },
    clickableItem: {
      backgroundColor: theme.backgroundDefault,
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    dangerItem: {
      borderWidth: 0,
      backgroundColor: '#FFF5F5',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingText: {
      fontSize: 16,
      fontWeight: '600',
    },
    switch: {
      width: 52,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.border,
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    switchOn: {
      backgroundColor: theme.primary,
    },
    switchOff: {
      backgroundColor: theme.border,
    },
    switchKnob: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    switchKnobOn: {
      marginLeft: 'auto',
    },
    switchKnobOff: {
      marginLeft: 0,
    },
    saveButton: {
      paddingVertical: Spacing.xl,
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      marginTop: Spacing.md,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
    },
    version: {
      textAlign: 'center',
      marginTop: Spacing.xl,
      marginBottom: Spacing.lg,
    },
  });
};
