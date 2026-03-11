import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xl,
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
      paddingHorizontal: Spacing.sm,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      marginBottom: Spacing['2xl'],
      alignItems: 'flex-start',
    },
    listContent: {
      gap: Spacing.md,
      paddingBottom: Spacing.xl,
    },
    friendCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
    },
    friendInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: Spacing.md,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    friendDetails: {
      flex: 1,
      gap: 4,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    actionButton: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.sm,
    },
    deleteButton: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.lg,
    },
    emptyIcon: {
      opacity: 0.3,
    },
  });
};
