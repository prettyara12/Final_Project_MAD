import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RequestCardProps {
  subject: string;
  time: string;
  studentName: string;
  onAccept: () => void;
  onReject: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  subject,
  time,
  studentName,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}) => {
  return (
    <View style={styles.card}>
       <View style={styles.header}>
         <View style={styles.iconBox}>
            <Ionicons name="person-add" size={20} color="#4F46E5" />
         </View>
         <View style={styles.info}>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.subjectText}>{subject}</Text>
            <Text style={styles.timeText}>{time}</Text>
         </View>
       </View>
       
       <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.rejectBtn]} 
            onPress={onReject}
            disabled={isRejecting || isAccepting}
          >
            {isRejecting ? <ActivityIndicator size="small" color="#EF4444" /> : <Text style={styles.rejectBtnText}>Tolak</Text>}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.acceptBtn]} 
            onPress={onAccept}
            disabled={isRejecting || isAccepting}
          >
            {isAccepting ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.acceptBtnText}>Terima</Text>}
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
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
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
    fontWeight: '600',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
  },
  rejectBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
  },
  acceptBtn: {
    backgroundColor: '#4F46E5',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  }
});
