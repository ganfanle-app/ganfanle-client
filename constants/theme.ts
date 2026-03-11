export const Colors = {
  light: {
    textPrimary: "#1A1A1A", // 接近纯黑 - 更好的对比度
    textSecondary: "#5C5C5C", // 中灰 - 次要文本
    textMuted: "#999999", // 浅灰 - 辅助文本
    primary: "#FF6B8B", // 玫瑰粉 - 品牌主色，温暖
    accent: "#FF9EB5", // 柔和粉色 - 辅助色
    success: "#34C759", // iOS系统绿 - 成功色
    error: "#FF3B30", // iOS系统红 - 错误色
    backgroundRoot: "#F9FAFB", // iOS系统灰背景 - 更纯净
    backgroundDefault: "#FFFFFF", // 纯白
    backgroundTertiary: "#F5F5F7", // iOS系统浅灰 - 去线留白
    buttonPrimaryText: "#FFFFFF", // 按钮文字白色
    tabIconSelected: "#FF6B8B", // 选中图标
    border: "#E5E5EA", // iOS系统边框色
    borderLight: "#F0F0F5", // 浅边框
    shadow: "rgba(0, 0, 0, 0.08)", // 柔和阴影
  },
  dark: {
    textPrimary: "#FFFFFF",
    textSecondary: "#EBEBF5",
    textMuted: "#8E8E93",
    primary: "#FF6B8B",
    accent: "#FF9EB5",
    success: "#34C759",
    error: "#FF453A",
    backgroundRoot: "#000000", // 纯黑背景
    backgroundDefault: "#1C1C1E", // iOS暗色模式卡片背景
    backgroundTertiary: "#2C2C2E", // iOS暗色模式输入框背景
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#FF6B8B",
    border: "#38383A",
    borderLight: "#2C2C2E",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  "2xl": 28,
  "3xl": 32,
  "4xl": 36,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -4,
  },
  displayLarge: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -2,
  },
  displayMedium: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "300" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  labelTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
};

export type Theme = typeof Colors.light;
