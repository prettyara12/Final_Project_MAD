import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  rightLinkText?: string;
  onRightLinkPress?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  rightLinkText,
  onRightLinkPress,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {rightLinkText && (
          <TouchableOpacity onPress={onRightLinkPress}>
            <Text style={styles.rightLink}>{rightLinkText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  rightLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5', // Indigo-600
  },
  input: {
    backgroundColor: '#E5E7EB', // Gray-200
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
});
