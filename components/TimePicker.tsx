import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { CustomTimePicker } from './CustomTimePicker';

// Web 端使用原生 HTML 时间选择器
const WebTimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const { theme } = useTheme();

  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        borderWidth: '1px',
        borderColor: theme.borderLight,
        backgroundColor: theme.backgroundDefault,
        color: theme.textPrimary,
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        outline: 'none',
      }}
    />
  );
};

interface TimePickerProps {
  label: string;
  value: string; // 格式: "HH:mm"
  onChange: (value: string) => void;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  mealType = 'breakfast',
}) => {
  const { theme } = useTheme();
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Web 端使用原生 HTML 时间选择器
  if (Platform.OS === 'web') {
    return <WebTimePicker value={value} onChange={onChange} />;
  }

  // 移动端使用自定义时间选择器
  console.log('[TimePicker] Rendering custom picker, Platform:', Platform.OS, 'value:', value);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
        onPress={() => {
          console.log('[TimePicker] Opening custom picker');
          setShowCustomPicker(true);
        }}
        activeOpacity={0.7}
      >
        <ThemedText variant="h4" color={theme.textPrimary}>
          {value || '--:--'}
        </ThemedText>
        <FontAwesome6 name="chevron-right" size={14} color={theme.textMuted} />
      </TouchableOpacity>

      <CustomTimePicker
        visible={showCustomPicker}
        value={value}
        onClose={() => {
          console.log('[TimePicker] Closing custom picker');
          setShowCustomPicker(false);
        }}
        onConfirm={(time) => {
          console.log('[TimePicker] Time confirmed:', time);
          onChange(time);
          setShowCustomPicker(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
