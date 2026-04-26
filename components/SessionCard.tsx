import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SessionCardProps {
  title: string;
  time: string;
  tutor: string;
  onPress?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  time,
  tutor,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.sessionCard} onPress={onPress}>
       <View style={styles.sessionIconBox}>
          <Ionicons name="videocam" size={24} color="#FFF" />
       </View>
       <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{title}</Text>
          <Text style={styles.sessionTime}>{time}</Text>
          <Text style={styles.sessionTutor}>Tutor: {tutor}</Text>
       </View>
       <TouchableOpacity style={styles.joinBtn} onPress={() => require('expo-router').router.push('/chat/ChatListScreen')}>
          <Text style={styles.joinBtnText}>Chat</Text>
       </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sessionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#4F46E5', // indigo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionTutor: {
    fontSize: 11,
    color: '#6B7280',
  },
  joinBtn: {
    backgroundColor: '#EEF2FF', // light indigo
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  joinBtnText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  }
});
