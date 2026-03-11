import React, { useState } from 'react';
import { Platform, Modal, View, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';

interface CustomTimePickerProps {
  visible: boolean;
  value: string; // 格式: "HH:mm"
  onClose: () => void;
  onConfirm: (time: string) => void;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  visible,
  value,
  onClose,
  onConfirm,
}) => {
  const { theme } = useTheme();

  // 解析当前时间
  const parseTime = (timeStr: string): [number, number] => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return [hours || 8, minutes || 0];
  };

  const [selectedHour, setSelectedHour] = useState(parseTime(value)[0]);
  const [selectedMinute, setSelectedMinute] = useState(parseTime(value)[1]);

  // 生成小时选项（0-23）
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // 生成分钟选项（0-59，每5分钟一个选项）
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const hourStr = selectedHour.toString().padStart(2, '0');
    const minuteStr = selectedMinute.toString().padStart(2, '0');
    onConfirm(`${hourStr}:${minuteStr}`);
  };

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <ThemedView
          level="default"
          style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
          onStartShouldSetResponder={() => true}
        >
          {/* 顶部标题栏 */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <ThemedText variant="body" color={theme.textMuted}>
                取消
              </ThemedText>
            </TouchableOpacity>
            <ThemedText variant="h4" color={theme.textPrimary}>
              选择时间
            </ThemedText>
            <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
              <ThemedText variant="body" color={theme.primary} style={{ fontWeight: '600' }}>
                确定
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* 当前时间显示 */}
          <View style={styles.timeDisplay}>
            <ThemedText variant="h1" color={theme.textPrimary}>
              {formatTime(selectedHour, selectedMinute)}
            </ThemedText>
          </View>

          {/* 时间选择器 */}
          <View style={styles.pickerContainer}>
            {/* 小时选择器 */}
            <View style={styles.pickerColumn}>
              <ThemedText variant="caption" color={theme.textMuted} style={styles.pickerLabel}>
                小时
              </ThemedText>
              <ScrollView
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
              >
                {hours.map((hour) => {
                  const isSelected = hour === selectedHour;
                  return (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        isSelected && {
                          backgroundColor: theme.primary,
                        },
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <ThemedText
                        variant="h4"
                        color={isSelected ? theme.buttonPrimaryText : theme.textPrimary}
                        style={isSelected ? { fontWeight: '700' } : {}}
                      >
                        {hour.toString().padStart(2, '0')}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <ThemedText variant="h3" color={theme.textMuted} style={styles.colon}>
              :
            </ThemedText>

            {/* 分钟选择器 */}
            <View style={styles.pickerColumn}>
              <ThemedText variant="caption" color={theme.textMuted} style={styles.pickerLabel}>
                分钟
              </ThemedText>
              <ScrollView
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
              >
                {minutes.map((minute) => {
                  const isSelected = minute === selectedMinute;
                  return (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        isSelected && {
                          backgroundColor: theme.primary,
                        },
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <ThemedText
                        variant="h4"
                        color={isSelected ? theme.buttonPrimaryText : theme.textPrimary}
                        style={isSelected ? { fontWeight: '700' } : {}}
                      >
                        {minute.toString().padStart(2, '0')}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </ThemedView>
      </Pressable>
    </Modal>
  );
};

const ITEM_HEIGHT = 50;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
  },
  timeDisplay: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
    height: ITEM_HEIGHT * 5,
  },
  pickerLabel: {
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerScroll: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
  },
  pickerContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  colon: {
    marginHorizontal: 8,
  },
});
