import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Alert, TouchableOpacity, Platform } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useFocusEffect } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Relationship {
  id: string;
  nickname?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function FriendsScreen() {
  const router = useSafeRouter();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const [friends, setFriends] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    visible: boolean;
    friendId: string;
    friendName: string;
  }>({ visible: false, friendId: '', friendName: '' });
  const [blockDialog, setBlockDialog] = useState<{
    visible: boolean;
    userId: string;
    userName: string;
  }>({ visible: false, userId: '', userName: '' });

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('错误', '请先登录');
        return;
      }

      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：GET /api/v1/relationships
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setFriends(result.data || []);
      } else {
        Alert.alert('失败', result.error || '获取好友列表失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '获取好友列表失败');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [])
  );

  const handleDeleteFriend = (friendId: string, friendName: string) => {
    console.log('点击删除按钮，friendId:', friendId, 'friendName:', friendName);
    setDeleteDialog({
      visible: true,
      friendId,
      friendName,
    });
  };

  const handleConfirmDelete = async () => {
    const { friendId, friendName } = deleteDialog;
    console.log('确认删除，开始执行删除操作:', friendId, friendName);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('错误', '请先登录');
        return;
      }

      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：DELETE /api/v1/relationships/:id
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships/${friendId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log('删除成功，准备返回上一页');
        setDeleteDialog({ visible: false, friendId: '', friendName: '' });
        router.back();
      } else {
        const result = await response.json();
        Alert.alert('失败', result.error || '删除失败');
      }
    } catch (error: any) {
      console.error('删除失败:', error);
      Alert.alert('错误', error.message || '删除失败');
    }
  };

  const handleCancelDelete = () => {
    console.log('用户取消删除');
    setDeleteDialog({ visible: false, friendId: '', friendName: '' });
  };

  const handleBlockFriend = (friendId: string, friendName: string) => {
    handleShowBlockDialog(friendId, friendName);
  };

  const handleShowBlockDialog = (userId: string, userName: string) => {
    console.log('点击拉黑按钮，userId:', userId, 'userName:', userName);
    setBlockDialog({
      visible: true,
      userId,
      userName,
    });
  };

  const handleConfirmBlock = async () => {
    const { userId, userName } = blockDialog;
    console.log('确认拉黑，开始执行拉黑操作:', userId, userName);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('错误', '请先登录');
        return;
      }

      /**
       * 服务端文件：server/src/routes/blocked-users.ts
       * 接口：POST /api/v1/blocked-users
       * Body 参数：targetUserId: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/blocked-users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId: userId }),
        }
      );

      if (response.ok) {
        console.log('拉黑成功');
        setBlockDialog({ visible: false, userId: '', userName: '' });
        Alert.alert('成功', '已拉黑该用户');
        fetchFriends();
      } else {
        const result = await response.json();
        Alert.alert('失败', result.error || '拉黑失败');
      }
    } catch (error: any) {
      console.error('拉黑失败:', error);
      Alert.alert('错误', error.message || '拉黑失败');
    }
  };

  const handleCancelBlock = () => {
    console.log('用户取消拉黑');
    setBlockDialog({ visible: false, userId: '', userName: '' });
  };

  const renderFriend = ({ item }: { item: Relationship }) => (
    <ThemedView level="default" style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <ThemedView level="tertiary" style={styles.avatar}>
          <FontAwesome6 name="user" size={24} color={theme.textMuted} />
        </ThemedView>
        <View style={styles.friendDetails}>
          <ThemedText variant="body" color={theme.textPrimary}>
            {item.nickname || item.user.name}
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted}>
            {item.user.email}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleBlockFriend(item.user.id, item.nickname || item.user.name)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome6 name="shield" size={20} color={theme.error} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteFriend(item.id, item.nickname || item.user.name)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome6 name="trash" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary}>
            关心的人
          </ThemedText>
          <View style={styles.navButton} /> {/* 占位，保持标题居中 */}
        </View>

        <ThemedView level="root" style={styles.header}>
          <ThemedText variant="body" color={theme.textSecondary}>
            共 {friends.length} 位好友
          </ThemedText>
        </ThemedView>

        {loading ? (
          <View style={styles.emptyContainer}>
            <ThemedText variant="body" color={theme.textMuted}>
              加载中...
            </ThemedText>
          </View>
        ) : friends.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="user-group" size={64} color={theme.textMuted} style={styles.emptyIcon} />
            <ThemedText variant="body" color={theme.textMuted}>
              还没有添加关心的人
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        visible={deleteDialog.visible}
        title="确认删除"
        message={`确定要删除"${deleteDialog.friendName}"吗？`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        destructive={true}
      />

      {/* 拉黑确认对话框 */}
      <ConfirmDialog
        visible={blockDialog.visible}
        title="确认拉黑"
        message={`确定要拉黑"${blockDialog.userName}"吗？拉黑后将自动解除关心关系。`}
        confirmText="拉黑"
        cancelText="取消"
        onConfirm={handleConfirmBlock}
        onCancel={handleCancelBlock}
        destructive={true}
      />
    </Screen>
  );
}
