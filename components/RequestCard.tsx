import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RequestCardProps {
  subject: string;
  time: string;
  studentName: string;
  message?: string;
  onAccept: () => void;
  onReject: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  subject,
  time,
  studentName,
  message,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}) => {
  return (
    <View style={styles.card}>
       <View style={styles.iconBox}>
          <Ionicons name="person-outline" size={24} color="#4F46E5" />
       </View>
       
       <View style={styles.info}>
          <Text style={styles.studentName} numberOfLines={1}>{studentName}</Text>
          <Text style={styles.subjectText} numberOfLines={1}>{subject}</Text>
          <Text style={styles.timeText} numberOfLines={1}>{time}</Text>
          {message ? <Text style={styles.messageText} numberOfLines={1}>{message}</Text> : null}
       </View>
       
       <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.acceptBtn]} 
            onPress={onAccept}
            disabled={isRejecting || isAccepting}
          >
            {isAccepting ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.rejectBtn]} 
            onPress={onReject}
            disabled={isRejecting || isAccepting}
          >
            {isRejecting ? <ActivityIndicator size="small" color="#EF4444" /> : <Ionicons name="close" size={18} color="#EF4444" />}
          </TouchableOpacity>
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  subjectText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '700',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: '#10B981', // green primary
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2', // light red
    borderWidth: 1,
    borderColor: '#FEE2E2',
  }
});
