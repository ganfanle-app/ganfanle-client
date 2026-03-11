import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReminderNotification, Reminder } from '@/components/ReminderNotification';
import { SendReminderConfirmDialog } from '@/components/SendReminderConfirmDialog';
import { RelationshipRequestDialog, RelationshipRequest } from '@/components/RelationshipRequestDialog';
import { RelationshipStatusDialog } from '@/components/RelationshipStatusDialog';

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */

import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { createStyles } from './styles';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Relationship {
  id: string;
  user_id: string;
  target_user_id: string;
  user: User;
  nickname?: string; // 我给对方设置的昵称
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  reminder_enabled: boolean;
}

interface MealStatus {
  meal_type: string;
  is_checked: boolean;
  checkin_time: string | null;
}

interface MealStatusWithExpired extends MealStatus {
  is_expired: boolean;
}

interface UserCheckinStatus {
  user_id: string;
  meals: MealStatus[];
}

const MEAL_LABELS: Record<string, { label: string; icon: any }> = {
  breakfast: { label: '早餐', icon: 'sunny' },
  lunch: { label: '午餐', icon: 'restaurant' },
  dinner: { label: '晚餐', icon: 'moon' },
};

const mealTypes = ['breakfast', 'lunch', 'dinner'];

export default function HomePage() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { user: currentUser, token, logout } = useAuth();

  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [todayStatus, setTodayStatus] = useState<MealStatus[]>([]);
  const [relationshipsStatus, setRelationshipsStatus] = useState<UserCheckinStatus[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showReminderNotification, setShowReminderNotification] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [showSendReminderDialog, setShowSendReminderDialog] = useState(false);
  const [pendingReminder, setPendingReminder] = useState<{ userId: string; userName: string; mealType: string } | null>(null);
  const [pendingRequests, setPendingRequests] = useState<RelationshipRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<RelationshipRequest | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [sentRequests, setSentRequests] = useState<RelationshipRequest[]>([]);
  const [showTooEarlyDialog, setShowTooEarlyDialog] = useState(false);
  const [showReminderTooEarlyDialog, setShowReminderTooEarlyDialog] = useState(false);
  const [reminderTimeError, setReminderTimeError] = useState<{ mealType: string; isTooEarly: boolean } | null>(null);

  // 获取关心的人列表
  const getRelationships = useCallback(async () => {
    if (!currentUser?.id || !token) return;

    try {
      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：GET /api/v1/relationships
       * Query 参数：userId: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships?userId=${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data, error } = await response.json();
      if (error) {
        console.error('获取关心的人列表失败:', error);
        return;
      }

      setRelationships(data);
    } catch (error) {
      console.error('获取关心的人列表失败:', error);
    }
  }, [currentUser?.id, token]);

  // 获取今日打卡状态
  const getTodayStatus = useCallback(async () => {
    if (!currentUser?.id || !token) return;

    try {
      /**
       * 服务端文件：server/src/routes/checkins.ts
       * 接口：GET /api/v1/checkins/today-status
       * Query 参数：userId: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/checkins/today-status?userId=${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data, error } = await response.json();
      if (error) {
        console.error('获取今日打卡状态失败:', error);
        return;
      }

      setTodayStatus(data);
    } catch (error) {
      console.error('获取今日打卡状态失败:', error);
    }
  }, [currentUser?.id, token]);

  // 获取关心的人的打卡状态
  const getRelationshipsStatus = useCallback(async () => {
    if (!currentUser?.id || !token || relationships.length === 0) {
      console.log('获取关心的人打卡状态：条件不满足', {
        hasUserId: !!currentUser?.id,
        hasToken: !!token,
        relationshipsCount: relationships.length,
      });
      return;
    }

    const userIds = relationships.map((r) => r.target_user_id).join(',');
    const today = new Date().toISOString().split('T')[0];
    console.log('获取关心的人打卡状态:', { userIds, today, relationshipsCount: relationships.length });

    try {
      /**
       * 服务端文件：server/src/routes/checkins.ts
       * 接口：GET /api/v1/checkins/multi-users
       * Query 参数：userIds: string, date?: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/checkins/multi-users?userIds=${userIds}&date=${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log('关心的人打卡状态响应:', result);

      if (result.error) {
        console.error('获取关心的人打卡状态失败:', result.error);
        return;
      }

      setRelationshipsStatus(result.data || []);
    } catch (error) {
      console.error('获取关心的人打卡状态失败:', error);
    }
  }, [currentUser?.id, token, relationships]);

  // 获取提醒列表
  const getReminders = useCallback(async () => {
    if (!currentUser?.id || !token) return;

    try {
      /**
       * 服务端文件：server/src/routes/reminders.ts
       * 接口：GET /api/v1/reminders
       * 说明：返回最近的50条提醒记录（包括已读和未读）
       * 该接口使用 authenticateToken 中间件，会自动从 token 中获取用户ID
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reminders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log('获取提醒列表响应:', result);

      if (result.error) {
        console.error('获取提醒列表失败:', result.error);
        return;
      }

      const reminders = result.data || [];
      setReminders(prev => {
        console.log('提醒数量:', reminders.length, '上次数量:', prev.length);
        // 检查是否有新的未读提醒
        const unreadReminders = reminders.filter((r: Reminder) => !r.is_read);
        if (unreadReminders.length > 0 && unreadReminders.length > prev.filter((r: Reminder) => !r.is_read).length) {
          console.log('有新的提醒，弹出通知');
          const latestReminder = unreadReminders[0];
          setCurrentReminder(latestReminder);

          // 关闭其他弹窗
          setShowSendReminderDialog(false);
          setShowRequestDialog(false);
          setShowStatusDialog(false);

          setShowReminderNotification(true);
        }
        return reminders;
      });
    } catch (error) {
      console.error('获取提醒列表失败:', error);
    }
  }, [currentUser?.id, token]);

  // 获取待确认的关系请求
  const getPendingRequests = useCallback(async () => {
    if (!currentUser?.id || !token) return;

    try {
      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：GET /api/v1/relationships/requests/pending
       * 说明：返回当前用户待确认的关系请求列表
       * 该接口使用 authenticateToken 中间件，会自动从 token 中获取用户ID
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships/requests/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log('获取待确认请求响应:', result);

      if (result.error) {
        console.error('获取待确认请求失败:', result.error);
        return;
      }

      const requests = result.data || [];
      console.log('待确认请求数量:', requests.length, '上次数量:', pendingRequests.length);

      // 检查是否有新的请求（通过ID比较）
      const newRequests = requests.filter((req: RelationshipRequest) =>
        !pendingRequests.some(pending => pending.id === req.id)
      );

      if (newRequests.length > 0) {
        console.log('有新的待确认请求，弹出对话框');
        setCurrentRequest(newRequests[0]);

        // 关闭其他弹窗
        setShowReminderNotification(false);
        setShowSendReminderDialog(false);
        setShowStatusDialog(false);

        setShowRequestDialog(true);
      }

      setPendingRequests(requests);
    } catch (error) {
      console.error('获取待确认请求失败:', error);
    }
  }, [currentUser?.id, token, pendingRequests]);

  // 获取已发送的请求（用于检测状态变化）
  const getSentRequests = useCallback(async () => {
    if (!currentUser?.id || !token) return;

    try {
      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：GET /api/v1/relationships/requests/sent
       * 说明：返回当前用户发送的所有请求（包括 pending/accepted/rejected）
       * 该接口使用 authenticateToken 中间件，会自动从 token 中获取用户ID
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships/requests/sent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log('获取已发送请求响应:', result);

      if (result.error) {
        console.error('获取已发送请求失败:', result.error);
        return;
      }

      const requests = result.data || [];
      console.log('已发送请求数量:', requests.length, '上次数量:', sentRequests.length);

      // 检查是否有状态变化的请求（从 pending 变为 accepted 或 rejected）
      const statusChangedRequests = requests.filter((req: RelationshipRequest) => {
        const oldRequest = sentRequests.find(r => r.id === req.id);
        return oldRequest && oldRequest.status === 'pending' && req.status !== 'pending';
      });

      if (statusChangedRequests.length > 0) {
        const changedRequest = statusChangedRequests[0];
        console.log('有请求状态变化:', changedRequest.status);
        setRequestStatus(changedRequest.status);

        // 关闭其他弹窗
        setShowReminderNotification(false);
        setShowSendReminderDialog(false);
        setShowRequestDialog(false);

        setShowStatusDialog(true);

        // 刷新关心的人列表
        await getRelationships();
      }

      setSentRequests(requests);
    } catch (error) {
      console.error('获取已发送请求失败:', error);
    }
  }, [currentUser?.id, token, sentRequests, getRelationships]);

  // 处理关系请求（接受或拒绝）
  const handleRelationshipRequest = async (requestId: string, action: 'accept' | 'reject', relationshipType: 'single' | 'mutual' = 'single') => {
    if (!token) return;

    try {
      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：POST /api/v1/relationships/requests/:id/respond
       * Body 参数：action: 'accept' | 'reject', relationshipType: 'single' | 'mutual'
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships/requests/${requestId}/respond`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
            relationshipType,
          }),
        }
      );

      const result = await response.json();
      console.log('处理关系请求响应:', result);

      if (result.error) {
        Alert.alert('提示', result.error);
        return;
      }

      // 从待确认列表中移除该请求
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      setShowRequestDialog(false);
      setCurrentRequest(null);

      // 刷新关心的人列表
      await getRelationships();
    } catch (error) {
      console.error('处理关系请求失败:', error);
      Alert.alert('提示', '操作失败，请重试');
    }
  };

  const handleBlockRequest = async (request: RelationshipRequest) => {
    if (!token) return;

    try {
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
          body: JSON.stringify({ targetUserId: request.from_user_id }),
        }
      );

      const result = await response.json();
      console.log('拉黑用户响应:', result);

      if (result.error) {
        Alert.alert('提示', result.error);
        return;
      }

      Alert.alert('成功', '已拉黑该用户');

      // 从待确认列表中移除该请求
      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
      setShowRequestDialog(false);
      setCurrentRequest(null);

      // 刷新关心的人列表（因为拉黑会自动删除关系）
      await getRelationships();
    } catch (error) {
      console.error('拉黑用户失败:', error);
      Alert.alert('提示', '操作失败，请重试');
    }
  };

  // 短轮询：每5秒检查一次关心的人打卡状态（用于实时更新）
  useEffect(() => {
    if (!currentUser?.id || !token) return;

    // 每5秒检查一次
    const interval = setInterval(() => {
      console.log('[短轮询] 检查关心的人打卡状态');
      getRelationshipsStatus();
    }, 5000); // 5秒

    return () => clearInterval(interval);
  }, [currentUser?.id, token, relationships, getRelationshipsStatus]);

  // 短轮询：每5秒检查一次提醒记录（用于实时接收新提醒）
  useEffect(() => {
    if (!currentUser?.id || !token) return;

    // 每5秒检查一次
    const interval = setInterval(() => {
      console.log('[短轮询] 检查提醒记录');
      getReminders();
    }, 5000); // 5秒

    return () => clearInterval(interval);
  }, [currentUser?.id, token, getReminders]);

  // 短轮询：每5秒检查一次待确认的关系请求（用于实时接收新请求）
  useEffect(() => {
    if (!currentUser?.id || !token) return;

    // 每5秒检查一次
    const interval = setInterval(() => {
      console.log('[短轮询] 检查待确认关系请求');
      getPendingRequests();
    }, 5000); // 5秒

    return () => clearInterval(interval);
  }, [currentUser?.id, token, getPendingRequests]);

  // 短轮询：每5秒检查一次已发送的请求（用于接收对方反馈）
  useEffect(() => {
    if (!currentUser?.id || !token) return;

    // 每5秒检查一次
    const interval = setInterval(() => {
      console.log('[短轮询] 检查已发送请求状态');
      getSentRequests();
    }, 5000); // 5秒

    return () => clearInterval(interval);
  }, [currentUser?.id, token, getSentRequests]);

  // SSE 实时推送连接（暂时禁用，因为 HTTPS 页面不能连接 HTTP 的 SSE）

  // 刷新数据
  const refreshData = useCallback(async () => {
    console.log('[refreshData] 开始刷新数据...');
    setRefreshing(true);
    try {
      // 先获取关心的人列表
      console.log('[refreshData] 步骤1：获取关心的人列表');
      /**
       * 服务端文件：server/src/routes/relationships.ts
       * 接口：GET /api/v1/relationships
       * Query 参数：userId: string
       */
      const relationshipsRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/relationships?userId=${currentUser?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: relationshipsData, error: relationshipsError } = await relationshipsRes.json();

      if (relationshipsError) {
        throw new Error(relationshipsError);
      }

      setRelationships(relationshipsData || []);
      console.log('[refreshData] 步骤2：关心的人列表已获取，数量:', relationshipsData?.length);

      // 如果没有关心的人，跳过后续请求
      if (!relationshipsData || relationshipsData.length === 0) {
        console.log('[refreshData] 没有关心的人，跳过其他请求');
        setInitialLoading(false);
        setRefreshing(false);
        return;
      }

      // 并行获取其他数据
      console.log('[refreshData] 步骤3：并行获取其他数据');
      const today = new Date().toISOString().split('T')[0];
      const userIds = relationshipsData.map((r: any) => r.target_user_id).join(',');

      await Promise.all([
        // 获取自己的打卡状态
        fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/checkins/today-status?userId=${currentUser?.id}&date=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(res => res.json()).then(result => {
          if (!result.error) {
            setTodayStatus(result.data || []);
          }
        }),

        // 获取关心的人打卡状态
        fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/checkins/multi-users?userIds=${userIds}&date=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(res => res.json()).then(result => {
          if (!result.error) {
            setRelationshipsStatus(result.data || []);
          }
        }),

        // 获取提醒列表
        fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reminders?userId=${currentUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(res => res.json()).then(result => {
          if (!result.error) {
            const unreadReminders = (result.data || []).filter((r: Reminder) => !r.is_read);
            setReminders(unreadReminders);
          }
        }),

        // 获取提醒列表
        fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reminders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(res => res.json()).then(result => {
          if (!result.error) {
            // 显示最近50条提醒
            setReminders(result.data || []);
          }
        }),
      ]);

      console.log('[refreshData] 所有数据加载完成');
    } catch (error) {
      console.error('[refreshData] 刷新数据失败:', error);
    }
    setRefreshing(false);
    setInitialLoading(false);
  }, [currentUser?.id, token]);

  // 打卡
  const handleCheckin = async (mealType: string) => {
    if (!currentUser?.id || !token) return;

    // 检查是否超过最早打卡时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // 定义最早打卡时间（分钟数）
    const earliestTimes: Record<string, number> = {
      breakfast: 4 * 60,   // 4:00
      lunch: 10 * 60,     // 10:00
      dinner: 16 * 60,    // 16:00
    };

    const earliestTime = earliestTimes[mealType];

    // 如果早于最早打卡时间，显示提示对话框
    if (earliestTime && currentTime < earliestTime) {
      setShowTooEarlyDialog(true);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      /**
       * 服务端文件：server/src/routes/checkins.ts
       * 接口：POST /api/v1/checkins
       * Body 参数：userId: string, mealType: string, date: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/checkins`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: currentUser.id,
            mealType,
            date: today,
          }),
        }
      );

      const { data, error } = await response.json();
      if (error) {
        Alert.alert('提示', error);
        return;
      }

      Alert.alert('成功', '打卡成功！');
      getTodayStatus();
    } catch (error) {
      console.error('打卡失败:', error);
      Alert.alert('提示', '打卡失败，请重试');
    }
  };

  // 发送提醒
  const handleRemind = async (targetUserId: string, mealType: string, targetUserName: string) => {
    if (!currentUser?.id || !token) return;

    // 检查提醒时间是否在允许范围内
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // 定义提醒时间范围（分钟数）
    const reminderTimeRanges: Record<string, { start: number; end: number; startStr: string; endStr: string }> = {
      breakfast: { start: 3 * 60 + 45, end: 10 * 60 + 30, startStr: '3:45', endStr: '10:30' },
      lunch: { start: 10 * 60, end: 14 * 60 + 30, startStr: '10:00', endStr: '14:30' },
      dinner: { start: 16 * 60, end: 21 * 60 + 30, startStr: '16:00', endStr: '21:30' },
    };

    const timeRange = reminderTimeRanges[mealType];

    // 检查是否在时间范围内
    if (currentTime < timeRange.start) {
      // 时间太早
      setReminderTimeError({ mealType, isTooEarly: true });
      setShowReminderTooEarlyDialog(true);
      return;
    }

    if (currentTime > timeRange.end) {
      // 时间太晚
      setReminderTimeError({ mealType, isTooEarly: false });
      setShowReminderTooEarlyDialog(true);
      return;
    }

    // 关闭其他弹窗
    setShowReminderNotification(false);
    setShowRequestDialog(false);
    setShowStatusDialog(false);

    // 显示确认弹窗
    setPendingReminder({ userId: targetUserId, userName: targetUserName, mealType });
    setShowSendReminderDialog(true);
  };

  // 确认发送提醒
  const confirmSendReminder = async () => {
    if (!pendingReminder || !currentUser?.id || !token) return;

    const { userId: targetUserId, userName: targetUserName, mealType } = pendingReminder;
    const mealLabel = MEAL_LABELS[mealType].label;

    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('发送提醒:', { targetUserId, mealType, date: today });

      /**
       * 服务端文件：server/src/routes/reminders.ts
       * 接口：POST /api/v1/reminders
       * Body 参数：toUserId: string, mealType: string, date: string
       * 注意：fromUserId 会通过 authenticateToken 中间件自动从 token 获取
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reminders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            toUserId: targetUserId,
            mealType,
            date: today,
          }),
        }
      );

      const result = await response.json();
      console.log('发送提醒响应:', result);

      if (result.error) {
        Alert.alert('提示', result.error);
        return;
      }

      Alert.alert('成功', '提醒已发送！');
    } catch (error) {
      console.error('发送提醒失败:', error);
      Alert.alert('提示', '发送提醒失败，请重试');
    } finally {
      setShowSendReminderDialog(false);
      setPendingReminder(null);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    console.log('退出登录按钮被点击');

    // 关闭其他弹窗
    setShowReminderNotification(false);
    setShowSendReminderDialog(false);
    setShowRequestDialog(false);
    setShowStatusDialog(false);

    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    router.replace('/auth');
  };

  const handleCloseReminderNotification = async () => {
    if (currentReminder && token) {
      try {
        // 点击"稍后"也标记为已读，避免重复弹出
        /**
         * 服务端文件：server/src/routes/reminders.ts
         * 接口：PATCH /api/v1/reminders/:id/read
         * 路径参数：id: number | string
         */
        await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reminders/${currentReminder.id}/read`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 刷新提醒列表
        await getReminders();
      } catch (error) {
        console.error('标记提醒为已读失败:', error);
      }
    }

    setShowReminderNotification(false);
    setCurrentReminder(null);
  };

  const handleViewReminder = async () => {
    if (currentReminder && token) {
      try {
        // 标记提醒为已读
        /**
         * 服务端文件：server/src/routes/reminders.ts
         * 接口：PATCH /api/v1/reminders/:id/read
         * 路径参数：id: number | string
         */
        await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/reminders/${currentReminder.id}/read`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 刷新提醒列表
        await getReminders();
      } catch (error) {
        console.error('标记提醒为已读失败:', error);
      }
    }

    setShowReminderNotification(false);
    setCurrentReminder(null);
    // 可以滚动到提醒列表区域
    console.log('查看提醒列表');
  };

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      if (currentUser?.id) {
        console.log('[useFocusEffect] 页面聚焦，刷新数据');
        refreshData();
      }
    }, [currentUser?.id, refreshData])
  );

  // 初始化（移除，与 useFocusEffect 重复）
  // useEffect(() => {
  //   if (currentUser?.id) {
  //     refreshData();
  //   }
  // }, [currentUser]);

  // 获取某个用户的打卡状态
  const getUserMealStatus = (userId: string, mealType: string): MealStatusWithExpired | null => {
    const userStatus = relationshipsStatus.find((s) => s.user_id === userId);
    if (!userStatus) return null;

    const mealStatus = userStatus.meals.find((m) => m.meal_type === mealType);
    if (!mealStatus) return null;

    // 检查是否超过截止时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // 定义截止时间（分钟数）
    const deadlineTimes: Record<string, number> = {
      breakfast: 10 * 60 + 30,  // 10:30
      lunch: 14 * 60 + 30,      // 14:30
      dinner: 21 * 60 + 30,     // 21:30
    };

    const deadlineTime = deadlineTimes[mealType];

    // 如果超过截止时间，强制返回未打卡状态，并标记为过期
    if (deadlineTime && currentTime >= deadlineTime) {
      return {
        ...mealStatus,
        is_checked: false, // 强制为未打卡
        is_expired: true,  // 标记为已过期
      };
    }

    return {
      ...mealStatus,
      is_expired: false,  // 未过期
    };
  };

  // 获取自己的打卡状态（带过期检查）
  const getMyMealStatus = (mealType: string): MealStatusWithExpired => {
    const mealStatus = todayStatus.find((s) => s.meal_type === mealType);
    
    // 检查是否超过截止时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // 定义截止时间（分钟数）
    const deadlineTimes: Record<string, number> = {
      breakfast: 10 * 60 + 30,  // 10:30
      lunch: 14 * 60 + 30,      // 14:30
      dinner: 21 * 60 + 30,     // 21:30
    };

    const deadlineTime = deadlineTimes[mealType];

    // 如果超过截止时间，强制返回未打卡状态，并标记为过期
    if (deadlineTime && currentTime >= deadlineTime) {
      return {
        meal_type: mealType,
        is_checked: false,      // 强制为未打卡
        checkin_time: null,
        is_expired: true,       // 标记为已过期
      };
    }

    // 未过期，返回原始状态
    return {
      meal_type: mealType,
      is_checked: mealStatus?.is_checked || false,
      checkin_time: mealStatus?.checkin_time || null,
      is_expired: false,
    };
  };

  // 检查是否有未打卡的餐次
  const hasUncheckedMeals = (userId: string): boolean => {
    const status = relationshipsStatus.find((s) => s.user_id === userId)?.meals;
    if (!status) return false;
    return status.some((m: MealStatus) => !m.is_checked);
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      {/* 初始化加载状态 */}
      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText variant="body" color={theme.textSecondary} style={styles.loadingText}>
            加载中...
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} tintColor={theme.primary} />
          }
        >
        {/* 头部 */}
        <ThemedView level="default" style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <ThemedText variant="h3" color={theme.buttonPrimaryText}>
                  {currentUser?.name?.charAt(0) || '我'}
                </ThemedText>
              </View>
              <View>
                <ThemedText variant="h3" color={theme.textPrimary}>
                  {currentUser?.name || '用户'}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textSecondary}>
                  今天吃饭了吗？
                </ThemedText>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/friends')}>
                <Ionicons name="people-outline" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
                <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 今日打卡状态 */}
          <View style={styles.todaySection}>
            <ThemedText variant="body" color={theme.textSecondary} style={styles.sectionTitle}>
              今日打卡
            </ThemedText>
            <View style={styles.mealButtons}>
              {mealTypes.map((mealType) => {
                const status = getMyMealStatus(mealType);
                const isChecked = status.is_checked;
                const isExpired = status.is_expired;
                const { label, icon } = MEAL_LABELS[mealType];
                
                // 判断按钮状态
                const isDisabled = isChecked || isExpired;
                
                // 背景颜色：已吃使用灰色背景，过期使用深粉色背景，否则使用主色调
                const backgroundColor = isChecked
                  ? theme.backgroundTertiary
                  : (isExpired ? `${theme.primary}4D` : theme.primary); // 4D = 30% 透明度（十六进制）
                
                // 文字和图标颜色：已吃使用灰色，过期和未过期未打卡使用白色
                const textColor = isChecked
                  ? theme.textMuted
                  : theme.buttonPrimaryText;
                
                // 按钮透明度：已吃半透明，过期和未过期未打卡不透明
                const opacity = isChecked ? 0.5 : 1;
                
                // 显示文字
                const displayText = isChecked ? '已吃' : (isExpired ? '未吃' : label);
                
                return (
                  <TouchableOpacity
                    key={mealType}
                    style={[
                      styles.mealButton,
                      {
                        backgroundColor,
                        opacity,
                      },
                    ]}
                    onPress={() => {
                      // 如果已经吃过或已过期，不允许打卡
                      if (isDisabled) {
                        return;
                      }
                      handleCheckin(mealType);
                    }}
                    disabled={isDisabled}
                  >
                    <Ionicons
                      name={icon}
                      size={24}
                      color={textColor}
                    />
                    <ThemedText
                      variant="caption"
                      color={textColor}
                      style={styles.mealButtonText}
                    >
                      {displayText}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ThemedView>

        {/* 提醒列表 */}
        {reminders.length > 0 && (
          <View style={styles.remindersSection}>
            <ThemedText variant="body" color={theme.textSecondary} style={styles.sectionTitle}>
              收到的提醒 ({reminders.length})
            </ThemedText>
            <ScrollView style={styles.remindersScrollContainer} showsVerticalScrollIndicator={true}>
              {reminders.map((reminder) => {
                const mealLabel = MEAL_LABELS[reminder.meal_type].label;
                // 格式化时间：如果有 created_at 则使用，否则使用 date
                const displayTime = reminder.created_at || reminder.date;
                const timeStr = displayTime.includes('T')
                  ? displayTime.substring(0, 19).replace('T', ' ') // 去掉T，替换为空格
                  : displayTime;

                return (
                  <ThemedView key={reminder.id} level="default" style={styles.reminderItem}>
                    <View style={styles.reminderIconContainer}>
                      <Ionicons
                        name="heart"
                        size={20}
                        color={theme.error}
                      />
                    </View>
                    <View style={styles.reminderContent}>
                      <ThemedText variant="body" color={theme.textPrimary}>
                        {reminder.from_users?.name} 提醒你吃{mealLabel}
                      </ThemedText>
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {timeStr}
                      </ThemedText>
                    </View>
                  </ThemedView>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 关心的人 */}
        <ThemedView level="default" style={styles.relationshipsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="body" color={theme.textSecondary} style={styles.sectionTitle}>
              关心的人
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/add-friend')}>
              <Ionicons name="add-circle" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {relationships.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people" size={48} color={theme.textMuted} />
              <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
                添加关心的人，互相提醒吃饭
              </ThemedText>
            </View>
          ) : (
            relationships
              .filter((relationship) => relationship.user !== undefined)
              .map((relationship) => {
              const user = relationship.user!;
              const uncheckedMealsCount = mealTypes.filter(
                (mealType) => !getUserMealStatus(user.id, mealType)?.is_checked
              ).length;

              console.log(`渲染关心的人: ${user.name}, 未打卡数量: ${uncheckedMealsCount}`);

              return (
                <ThemedView key={relationship.id} level="tertiary" style={styles.relationshipItem}>
                  <View style={styles.relationshipUserInfo}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                      <ThemedText variant="h3" color={theme.buttonPrimaryText}>
                        {relationship.nickname?.charAt(0) || user.name.charAt(0)}
                      </ThemedText>
                    </View>
                    <View style={styles.relationshipUserTextContainer}>
                      <ThemedText variant="body" color={theme.textPrimary} style={styles.userName}>
                        {relationship.nickname || user.name}
                      </ThemedText>
                      {relationship.nickname && relationship.nickname !== user.name ? (
                        <ThemedText variant="caption" color={theme.textMuted} style={styles.userOriginalName}>
                          {user.name}
                        </ThemedText>
                      ) : null}
                      {uncheckedMealsCount > 0 ? (
                        <ThemedText variant="caption" color={theme.error} style={styles.statusText}>
                          还有{uncheckedMealsCount}餐未吃
                        </ThemedText>
                      ) : (
                        <ThemedText variant="caption" color={theme.success} style={styles.statusText}>
                          今日已全部打卡
                        </ThemedText>
                      )}
                    </View>
                  </View>

                  <View style={styles.relationshipActions}>
                    {/* 提醒设置按钮 */}
                    <TouchableOpacity
                      style={styles.reminderSettingsButton}
                      onPress={() => router.push('/reminder-settings', { relationshipId: relationship.id, userName: user.name })}
                    >
                      <Ionicons name="time" size={14} color={theme.buttonPrimaryText} />
                      <ThemedText variant="caption" color={theme.buttonPrimaryText} style={styles.reminderSettingsText}>
                        提醒设置
                      </ThemedText>
                    </TouchableOpacity>

                    {/* 餐次提醒按钮 */}
                    <View style={styles.miniMealButtons}>
                      {mealTypes.map((mealType) => {
                        const status = getUserMealStatus(user.id, mealType);
                        const isChecked = status?.is_checked;
                        const isExpired = status?.is_expired;
                        const { label, icon } = MEAL_LABELS[mealType];
                        
                        // 判断按钮状态
                        const isDisabled = isChecked || isExpired;
                        
                        // 背景颜色：已吃使用灰色背景，过期使用深粉色背景，否则使用主色调
                        const backgroundColor = isChecked
                          ? theme.backgroundTertiary
                          : (isExpired ? `${theme.primary}4D` : theme.primary); // 4D = 30% 透明度（十六进制）
                        
                        // 文字和图标颜色：已吃使用灰色，过期和未过期未打卡使用白色
                        const textColor = isChecked
                          ? theme.textMuted
                          : theme.buttonPrimaryText;
                        
                        // 按钮透明度：已吃半透明，过期和未过期未打卡不透明
                        const opacity = isChecked ? 0.5 : 1;
                        
                        // 显示文字
                        const displayText = isChecked ? '已吃' : (isExpired ? '未吃' : label);
                        
                        return (
                          <TouchableOpacity
                            key={mealType}
                            style={[
                              styles.miniMealButton,
                              {
                                backgroundColor,
                                opacity,
                              },
                            ]}
                            onPress={() => {
                              // 如果对方已经吃过或已过期，不允许提醒
                              if (isDisabled) {
                                return;
                              }
                              handleRemind(user.id, mealType, user.name);
                            }}
                            disabled={isDisabled}
                          >
                            <Ionicons
                              name={icon}
                              size={16}
                              color={textColor}
                            />
                            <ThemedText
                              variant="caption"
                              color={textColor}
                              style={styles.miniMealButtonText}
                            >
                              {displayText}
                            </ThemedText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </ThemedView>
              );
            })
          )}
        </ThemedView>
        </ScrollView>
      )}


      {/* 退出登录确认对话框 */}
      <ConfirmDialog
        visible={showLogoutDialog}
        title="退出登录"
        message="确定要退出登录吗？"
        confirmText="退出"
        cancelText="取消"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
        destructive={false}
      />

      {/* 打卡太早提示对话框 */}
      <ConfirmDialog
        visible={showTooEarlyDialog}
        title="打卡太早了"
        messageLines={[
          '现在还不是打卡时间哦！',
          '',
          '最早打卡时间：',
          '- 早餐：4:00',
          '- 午餐：10:00',
          '- 晚餐：16:00',
        ]}
        confirmText="知道了"
        cancelText=""
        onConfirm={() => setShowTooEarlyDialog(false)}
        onCancel={() => {}}
        destructive={false}
      />

      {/* 提醒时间限制对话框 */}
      {reminderTimeError && (
        <ConfirmDialog
          visible={showReminderTooEarlyDialog}
          title={reminderTimeError.isTooEarly ? '提醒太早了' : '提醒时间已过'}
          messageLines={
            reminderTimeError.isTooEarly
              ? [
                  '现在还太早，不能发送提醒哦！',
                  '',
                  '提醒时间范围：',
                  '- 早餐：3:45 - 10:30',
                  '- 午餐：10:00 - 14:30',
                  '- 晚餐：16:00 - 21:30',
                ]
              : [
                  '提醒时间已过，无法发送提醒！',
                  '',
                  '提醒时间范围：',
                  '- 早餐：3:45 - 10:30',
                  '- 午餐：10:00 - 14:30',
                  '- 晚餐：16:00 - 21:30',
                ]
          }
          confirmText="知道了"
          cancelText=""
          onConfirm={() => {
            setShowReminderTooEarlyDialog(false);
            setReminderTimeError(null);
          }}
          onCancel={() => {
            setShowReminderTooEarlyDialog(false);
            setReminderTimeError(null);
          }}
          destructive={false}
        />
      )}

      {/* 提醒通知弹窗 */}
      <ReminderNotification
        visible={showReminderNotification}
        reminder={currentReminder}
        onClose={handleCloseReminderNotification}
        onView={handleViewReminder}
      />

      {/* 发送提醒确认弹窗 */}
      <SendReminderConfirmDialog
        visible={showSendReminderDialog}
        userName={pendingReminder?.userName}
        mealType={pendingReminder?.mealType}
        onConfirm={confirmSendReminder}
        onCancel={() => {
          setShowSendReminderDialog(false);
          setPendingReminder(null);
        }}
      />

      {/* 关系请求确认弹窗 */}
      <RelationshipRequestDialog
        visible={showRequestDialog}
        request={currentRequest}
        onAccept={(type) => {
          if (currentRequest) {
            handleRelationshipRequest(currentRequest.id, 'accept', type);
          }
        }}
        onReject={() => {
          if (currentRequest) {
            handleRelationshipRequest(currentRequest.id, 'reject');
          }
        }}
        onBlock={() => {
          if (currentRequest) {
            handleBlockRequest(currentRequest);
          }
        }}
      />

      {/* 关系请求状态弹窗 */}
      <RelationshipStatusDialog
        visible={showStatusDialog}
        status={requestStatus}
        onClose={() => setShowStatusDialog(false)}
      />
    </Screen>
  );
}
