import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { FontAwesome6 } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const router = useSafeRouter();

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <ThemedText variant="h2" color={theme.textPrimary} style={styles.title}>
          隐私政策
        </ThemedText>
        <ThemedText variant="caption" color={theme.textMuted} style={styles.updateTime}>
          最后更新时间：2025年1月15日
        </ThemedText>

        <View style={styles.importantNotice}>
          <FontAwesome6 name="shield-halved" size={24} color="#10B981" />
          <View style={styles.noticeContent}>
            <ThemedText variant="body" color={theme.textPrimary} style={styles.noticeTitle}>
              隐私保护承诺
            </ThemedText>
            <ThemedText variant="caption" color={theme.textSecondary}>
              我们非常重视您的隐私保护，严格遵守相关法律法规。请您仔细阅读本隐私政策，了解我们如何收集、使用、存储和保护您的个人信息。
            </ThemedText>
          </View>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            1. 引言
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.1 本隐私政策适用于&ldquo;干饭了&rdquo;应用（以下简称&ldquo;本应用&rdquo;）提供的服务。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.2 我们承诺严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            2. 我们收集的信息
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            为了向您提供更好的服务，我们会收集以下信息：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 账户信息：注册时提供的邮箱、昵称等账户信息。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 使用信息：您的用餐打卡记录、提醒设置、状态更新等使用数据。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 设备信息：设备型号、操作系统版本、网络类型等设备信息。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 日志信息：应用的使用日志、错误日志等技术信息。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            3. 信息的使用
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            我们收集的个人信息将用于以下用途：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 提供基本服务：实现用餐打卡、提醒设置、状态更新等功能。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 改善服务质量：分析使用数据，优化应用功能和用户体验。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 安全防护：防止欺诈、滥用行为，保障应用安全稳定运行。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            4. 信息的共享
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            除以下情况外，我们不会向任何第三方共享您的个人信息：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 获得您的明确同意。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 法律法规要求或政府部门强制要求。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 为维护我们的合法权益，如防止欺诈、滥用行为等。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            5. 信息的安全
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            我们采取合理的安全措施保护您的个人信息，包括：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 使用加密技术保护数据传输和存储安全。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 限制对个人信息的访问权限，仅授权人员可访问。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 定期进行安全审计和风险评估。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            但请注意，任何安全措施都无法做到绝对安全。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            6. 您的权利
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            您对自己的个人信息享有以下权利：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 访问权：有权查看我们收集的关于您的个人信息。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 更正权：有权要求更正不准确的个人信息。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 删除权：有权要求删除您的个人信息和账户。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            • 撤回同意：有权撤回之前同意的授权。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            7. 本隐私政策的更新
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            7.1 我们可能会根据法律法规变化或服务调整更新本隐私政策。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            7.2 更新后的隐私政策将通过应用内通知或公告形式告知您。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            7.3 您继续使用本应用即视为接受更新后的隐私政策。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            8. 联系我们
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            如您对本隐私政策有任何疑问、意见或建议，或需要行使您的个人信息权利，请通过以下方式联系我们：
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            邮箱：support@ssisemi.com
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.listItem}>
            官网：www.ssisemi.com
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}
