import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  // Logo圆形背景 - 马卡龙粉色 #FFB3C6
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFB3C6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFB3C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  // 刀叉图标容器
  iconsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 文字容器 - 独立在logo下方
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  // 主标题
  title: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 4,
    marginBottom: 8,
  },
  // 副标题
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#999999',
    letterSpacing: 2,
  },
});
