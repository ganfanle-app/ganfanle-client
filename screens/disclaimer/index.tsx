import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { createStyles } from './styles';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { FontAwesome6 } from '@expo/vector-icons';

export default function DisclaimerScreen() {
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
          免责条款
        </ThemedText>
        <ThemedText variant="caption" color={theme.textMuted} style={styles.updateTime}>
          最后更新时间：2025年1月15日
        </ThemedText>

        <View style={styles.importantNotice}>
          <FontAwesome6 name="triangle-exclamation" size={24} color="#EF4444" />
          <View style={styles.noticeContent}>
            <ThemedText variant="body" color={theme.textPrimary} style={styles.noticeTitle}>
              免责声明
            </ThemedText>
            <ThemedText variant="caption" color={theme.textSecondary}>
              请您仔细阅读以下免责条款。使用本应用即表示您已完全理解并接受以下所有免责声明。
            </ThemedText>
          </View>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            1. 健康建议免责
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.1 本应用的用餐提醒功能仅用于提醒用户按时用餐，不构成任何医疗建议、健康指导或营养治疗方案。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.2 如有健康问题、疾病或特殊饮食需求，请务必咨询专业医生、营养师或其他医疗专业人士的意见。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            1.3 本应用不对因依赖本应用的提醒功能而导致的任何健康问题或后果承担责任。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            2. 信息准确性免责
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            2.1 本应用中的所有信息、建议、提醒均仅供参考，我们不对信息的准确性、完整性、及时性或适用性做出任何保证。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            2.2 用户应根据自身实际情况和专业建议，独立判断和使用本应用提供的信息。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            3. 服务可用性免责
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            3.1 本应用可能会因系统维护、技术故障、网络问题等原因而暂时中断或停止服务。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            3.2 我们不对服务中断、延迟或停止造成的任何损失或影响承担责任。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            4. 责任限制
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            4.1 在法律允许的最大范围内，我们不对任何间接损失、附带损失、后果性损失或惩罚性损失承担责任。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            4.2 我们对您的累计赔偿责任总额不超过您使用本应用服务所支付的费用（如有）。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            5. 第三方内容免责
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            5.1 本应用可能包含或链接到第三方提供的内容或服务。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            5.2 我们不对第三方内容的准确性、合法性或适当性负责，也不对因使用第三方内容而产生的任何损失承担责任。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            6. 用户行为免责
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            6.1 用户应对自己的行为和通过本应用产生的所有活动负责。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            6.2 我们不对因用户违反法律法规或本协议而产生的任何损失或后果承担责任。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            7. 适用法律与争议解决
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            7.1 本免责条款的订立、执行、解释及争议解决均适用中华人民共和国法律。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            7.2 如发生争议，双方应友好协商解决；协商不成的，任何一方均有权向我们所在地有管辖权的人民法院提起诉讼。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            8. 条款修改
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            8.1 我们保留随时修改本免责条款的权利。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            8.2 修改后的条款将通过本应用公告或更新的形式通知您。
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            8.3 您继续使用本应用即视为接受修改后的条款。
          </ThemedText>
        </View>

        <View style={styles.contentSection}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            9. 联系我们
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.paragraph}>
            如您对本免责条款有任何疑问，请通过以下方式联系我们：
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
