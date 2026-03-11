import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { FontAwesome6 } from '@expo/vector-icons';

export default function UserAgreementScreen() {
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
          用户协议
        </ThemedText>
        <ThemedText variant="caption" color={theme.textMuted} style={styles.updateTime}>
          最后更新时间：2025年1月15日
        </ThemedText>

        <View style={styles.importantNotice}>
          <FontAwesome6 name="circle-exclamation" size={24} color="#F59E0B" />
          <View style={styles.noticeContent}>
            <ThemedText variant="body" color={theme.textPrimary} style={styles.noticeTitle}>
              重要提示
            </ThemedText>
            <ThemedText variant="caption" color={theme.textSecondary}>
              请您仔细阅读本用户协议的全部内容，特别是免除或限制责任的条款。如果您不同意本协议的任何内容，请立即停止使用本应用。
            </ThemedText>
          </View>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            1. 协议的接受与生效
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.1 本用户协议是您与&ldquo;干饭了&rdquo;应用运营方之间就使用本应用服务所订立的协议。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.2 您下载、安装、注册、登录、使用本应用服务，即视为您已充分理解、完全接受并同意本协议的全部内容。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.3 如果您未满18周岁，请在法定监护人的陪同下阅读本协议，并由法定监护人代为签署。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            2. 服务说明
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            2.1 &ldquo;干饭了&rdquo;是一款专注于关心家人、朋友用餐情况的应用，主要功能包括三餐打卡记录、关心的人管理、用餐提醒功能、实时状态更新、提醒通知等。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            2.2 本应用服务仅限于个人非商业用途使用，未经授权不得用于商业目的。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            3. 用户注册与账户管理
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            3.1 您在注册时必须提供真实、准确、完整的个人资料，并及时更新上述资料。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            3.2 您应妥善保管您的账户和密码，因您保管不善可能导致账户被盗用、密码泄露等风险，由此产生的损失由您自行承担。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            3.3 您有权申请注销账户，注销后将无法恢复账户内的任何信息。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            4. 用户行为规范
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            4.1 您在使用本应用服务时，必须遵守相关法律法规，不得利用本应用服务从事违法违规或侵害他人权益的活动。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            4.2 如您违反本协议约定，我们有权不经通知立即采取警告、删除违规内容、限制功能使用、暂停或终止向您提供服务、永久注销您的账户等措施。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            5. 免责声明
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            5.1 本应用按&ldquo;现状&rdquo;提供服务，不保证服务的连续性、及时性、安全性或无错误性。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            5.2 本应用的提醒功能仅用于提醒用户按时用餐，不构成任何医疗建议或健康指导。如有健康问题，请咨询专业医生或营养师。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            6. 争议解决
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            6.1 本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            6.2 如就本协议发生争议，双方应友好协商解决；协商不成的，任何一方均有权向我们所在地有管辖权的人民法院提起诉讼。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            7. 联系我们
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            如您对本协议有任何疑问，请通过以下方式联系我们：
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
