import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatBubbleProps {
  text: string;
  sender: 'user' | 'ai';
  timestamp?: string;
  richContent?: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  sender,
  timestamp,
  richContent
}) => {
  const isUser = sender === 'user';

  return (
    <View style={[styles.bubbleWrapper, isUser ? styles.wrapperUser : styles.wrapperAi]}>
      
      {!isUser && (
         <View style={styles.aiAvatar}>
            <Ionicons name="hardware-chip" size={16} color="#FFF" />
         </View>
      )}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
        {text ? (
          <Text style={[styles.text, isUser ? styles.textUser : styles.textAi]}>
            {text}
          </Text>
        ) : null}

        {richContent && (
          <View style={styles.richContentContainer}>
            {richContent}
          </View>
        )}

        {timestamp && (
          <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAi]}>
            {timestamp}
          </Text>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperAi: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9333EA', // purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bubbleUser: {
    backgroundColor: '#4F46E5', // indigo
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: '#FFFFFF',
  },
  textAi: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  timestampAi: {
    color: '#9CA3AF',
  },
  richContentContainer: {
    marginTop: 8,
  }
});
