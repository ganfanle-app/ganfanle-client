import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const router = useSafeRouter();

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.container}>
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
            关于我们
          </ThemedText>
          <View style={styles.navButton} /> {/* 占位，保持标题居中 */}
        </View>

        {/* Logo 和应用名称 */}
        <ThemedView level="tertiary" style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <FontAwesome6 name="utensils" size={48} color={theme.primary} />
          </View>
          <ThemedText variant="h2" color={theme.textPrimary} style={styles.appName}>
            干饭了
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.appSlogan}>
            用温暖的方式关心你吃饭
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.version}>
            版本 1.0.0
          </ThemedText>
        </ThemedView>

        {/* 应用介绍 */}
        <ThemedView level="tertiary" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            应用介绍
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            &ldquo;干饭了&rdquo;是一款专注于关心家人、朋友用餐情况的应用。通过三餐打卡、用餐提醒等功能，让你随时关心在乎的人是否按时吃饭，传递你的关爱。
          </ThemedText>
        </ThemedView>

        {/* 功能特色 */}
        <ThemedView level="tertiary" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            功能特色
          </ThemedText>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <FontAwesome6 name="clock" size={16} color={theme.primary} />
            </View>
            <ThemedText variant="body" color={theme.textSecondary}>
              个性化提醒时间
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <FontAwesome6 name="bell" size={16} color={theme.primary} />
            </View>
            <ThemedText variant="body" color={theme.textSecondary}>
              自动提醒功能
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <FontAwesome6 name="heart" size={16} color={theme.primary} />
            </View>
            <ThemedText variant="body" color={theme.textSecondary}>
              一键关心提醒
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <FontAwesome6 name="chart-line" size={16} color={theme.primary} />
            </View>
            <ThemedText variant="body" color={theme.textSecondary}>
              打卡记录查看
            </ThemedText>
          </View>
        </ThemedView>

        {/* 法律信息 */}
        <ThemedView level="tertiary" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            法律信息
          </ThemedText>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => router.push('/user-agreement')}
          >
            <ThemedText variant="body" color={theme.textSecondary} style={styles.linkText}>
              用户协议
            </ThemedText>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => router.push('/disclaimer')}
          >
            <ThemedText variant="body" color={theme.textSecondary} style={styles.linkText}>
              免责条款
            </ThemedText>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => router.push('/privacy-policy')}
          >
            <ThemedText variant="body" color={theme.textSecondary} style={styles.linkText}>
              隐私政策
            </ThemedText>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </ThemedView>

        {/* 联系我们 */}
        <ThemedView level="tertiary" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            联系我们
          </ThemedText>
          <View style={styles.contactItem}>
            <FontAwesome6 name="envelope" size={16} color={theme.textMuted} />
            <ThemedText variant="body" color={theme.textSecondary} style={styles.contactText}>
              support@ssisemi.com
            </ThemedText>
          </View>
          <View style={styles.contactItem}>
            <FontAwesome6 name="globe" size={16} color={theme.textMuted} />
            <ThemedText variant="body" color={theme.textSecondary} style={styles.contactText}>
              www.ssisemi.com
            </ThemedText>
          </View>
        </ThemedView>

        {/* 版权信息 */}
        <ThemedText variant="caption" color={theme.textMuted} style={styles.copyright}>
          © 2025 干饭了. All rights reserved.
        </ThemedText>
      </ScrollView>
    </Screen>
  );
}
