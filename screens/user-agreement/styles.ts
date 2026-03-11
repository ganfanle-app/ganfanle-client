import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing["2xl"],
      paddingBottom: Spacing["5xl"],
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    title: {
      marginBottom: Spacing.sm,
    },
    updateTime: {
      marginBottom: Spacing.xl,
    },
    importantNotice: {
      flexDirection: 'row',
      gap: Spacing.md,
      backgroundColor: '#FEF3C7',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
    },
    noticeContent: {
      flex: 1,
    },
    noticeTitle: {
      fontWeight: '600',
      marginBottom: Spacing.xs,
    },
    contentSection: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontWeight: '600',
      marginBottom: Spacing.md,
    },
    paragraph: {
      lineHeight: 24,
      marginBottom: Spacing.sm,
    },
    listItem: {
      marginLeft: Spacing.lg,
      lineHeight: 24,
      marginBottom: Spacing.xs,
    },
  });
};
