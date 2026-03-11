import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStyles } from './styles';

interface BlockedUser {
  id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BlockedUsersScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const router = useSafeRouter();

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);

  // 获取拉黑列表
  const fetchBlockedUsers = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      /**
       * 服务端文件：server/src/routes/blocked-users.ts
       * 接口：GET /api/v1/blocked-users
       * 说明：返回当前用户的拉黑列表
       * 该接口使用 authenticateToken 中间件，会自动从 token 中获取用户ID
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/blocked-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data, error } = await response.json();

      if (error) {
        console.error('获取拉黑列表失败:', error);
        Alert.alert('错误', error);
        return;
      }

      setBlockedUsers(data || []);
    } catch (error) {
      console.error('获取拉黑列表失败:', error);
      Alert.alert('错误', '获取拉黑列表失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 取消拉黑
  const handleUnblock = async (blockedUser: BlockedUser) => {
    setSelectedUser(blockedUser);
    setShowDeleteDialog(true);
  };

  // 确认取消拉黑
  const confirmUnblock = async () => {
    if (!selectedUser) return;

    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      /**
       * 服务端文件：server/src/routes/blocked-users.ts
       * 接口：DELETE /api/v1/blocked-users/:id
       * 路径参数：id: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/blocked-users/${selectedUser.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { error } = await response.json();

      if (error) {
        Alert.alert('错误', error);
        return;
      }

      Alert.alert('成功', '已取消拉黑');
      setShowDeleteDialog(false);
      setSelectedUser(null);
      await fetchBlockedUsers();
    } catch (error) {
      console.error('取消拉黑失败:', error);
      Alert.alert('错误', '取消拉黑失败');
    }
  };

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      fetchBlockedUsers();
    }, [fetchBlockedUsers])
  );

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText variant="body" color={theme.textSecondary} style={styles.loadingText}>
            加载中...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchBlockedUsers} tintColor={theme.primary} />
        }
      >
        {/* 顶部导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.title}>
            拉黑管理
          </ThemedText>
          <View style={styles.navButton} /> {/* 占位，保持标题居中 */}
        </View>

        {/* 头部信息 */}
        <ThemedView level="tertiary" style={styles.headerSection}>
          <View style={styles.headerContent}>
            <ThemedText variant="h2" color={theme.textPrimary} style={styles.headerTitle}>
              已拉黑用户
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary} style={styles.headerSubtitle}>
              共 {blockedUsers.length} 个用户
            </ThemedText>
          </View>
        </ThemedView>

        {/* 拉黑列表 */}
        {blockedUsers.length === 0 ? (
          <ThemedView level="tertiary" style={styles.section}>
            <View style={styles.emptyState}>
              <FontAwesome6 name="shield-halved" size={64} color={theme.textMuted} />
              <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
                暂无拉黑用户
              </ThemedText>
            </View>
          </ThemedView>
        ) : (
          blockedUsers.map((blockedUser) => (
            <ThemedView key={blockedUser.id} level="tertiary" style={styles.section}>
              <View style={styles.userItem}>
                <View style={styles.userInfo}>
                  <View style={[styles.avatar, { backgroundColor: theme.error }]}>
                    <ThemedText variant="h3" color="#FFF" style={styles.avatarText}>
                      {blockedUser.user.name.charAt(0)}
                    </ThemedText>
                  </View>
                  <View style={styles.userText}>
                    <ThemedText variant="body" color={theme.textPrimary} style={styles.userName}>
                      {blockedUser.user.name}
                    </ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted} style={styles.userEmail}>
                      {blockedUser.user.email}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unblockButton}
                  onPress={() => handleUnblock(blockedUser)}
                >
                  <FontAwesome6 name="lock-open" size={16} color={theme.buttonPrimaryText} />
                  <ThemedText variant="caption" color={theme.buttonPrimaryText} style={styles.unblockText}>
                    取消拉黑
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          ))
        )}

        {/* 确认取消拉黑对话框 */}
        <ConfirmDialog
          visible={showDeleteDialog}
          title="取消拉黑"
          message={`确定要取消拉黑 "${selectedUser?.user.name}" 吗？`}
          confirmText="取消拉黑"
          cancelText="再想想"
          onConfirm={confirmUnblock}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedUser(null);
          }}
          destructive={false}
        />
      </ScrollView>
    </Screen>
  );
}
