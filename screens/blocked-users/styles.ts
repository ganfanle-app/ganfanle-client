import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.backgroundRoot,
    },
    // 顶部导航栏
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      paddingTop: Spacing.lg,
    },
    navButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontWeight: '600',
    },
    // 头部信息卡片
    headerSection: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.lg,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
    },
    headerContent: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: Spacing.sm,
    },
    headerSubtitle: {
      fontSize: 16,
    },
    // 卡片样式（与关于我们一致）
    section: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.lg,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    // 加载状态
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: Spacing.md,
    },
    // 空状态
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['4xl'],
    },
    emptyText: {
      marginTop: Spacing.md,
      fontSize: 16,
    },
    // 用户项
    userItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    avatarText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    userText: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
    },
    unblockButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.primary,
    },
    unblockText: {
      marginLeft: 4,
    },
  });
};
