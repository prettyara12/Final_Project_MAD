import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../convex/_generated/api';
import { getGeminiResponse } from '../../services/gemini';

const { width, height } = Dimensions.get('window');

// AI Chat Integration
const AI_BOT_ID = "ai_system_bot";

export default function AIChatScreen() {
  const { colors, isDark } = useTheme();
  const { profileData } = useProfile();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const messages = useQuery(api.messages.getMessages,
    currentUser ? { userA: currentUser._id, userB: AI_BOT_ID } : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteConversation = useMutation(api.messages.deleteConversation);

  const handleDeleteChat = () => {
    if (!currentUser || !messages || messages.length === 0) return;

    Alert.alert(
      "Hapus Chat",
      "Apakah Anda yakin ingin menghapus semua riwayat percakapan dengan EduPartner AI?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteConversation({ userA: currentUser._id, userB: AI_BOT_ID });
            } catch (error) {
              console.error("Failed to delete chat:", error);
              Alert.alert("Error", "Gagal menghapus chat. Silakan coba lagi.");
            }
          }
        }
      ]
    );
  };

  const handleSend = async () => {
    if (inputText.trim().length === 0 || !currentUser) {
      if (!currentUser && inputText.trim().length > 0) {
        Alert.alert("Info", "Silakan lengkapi profil Anda terlebih dahulu untuk menggunakan AI Chat.");
      }
      return;
    }

    const text = inputText.trim();
    setInputText('');

    try {
      // 1. Send user message to Convex
      await sendMessage({
        senderId: currentUser._id,
        receiverId: AI_BOT_ID,
        content: text,
      });

      // 2. Prepare Gemini history
      setIsTyping(true);

      const chatHistory = (messages || []).map(msg => ({
        role: msg.senderId === currentUser._id ? "user" : "model" as "user" | "model",
        parts: [{ text: msg.content }]
      }));

      // 3. Get AI Response
      const aiResponse = await getGeminiResponse(text, chatHistory);

      // 4. Send AI response to Convex
      await sendMessage({
        senderId: AI_BOT_ID,
        receiverId: currentUser._id,
        content: aiResponse,
      });

    } catch (error) {
      console.error("Failed to process chat:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderBubble = (msg: any, index: number) => {
    const isUser = msg.senderId === currentUser?._id;

    return (
      <Animated.View 
        key={msg._id} 
        entering={FadeInDown.delay(100).springify()}
        layout={Layout.springify()}
        style={[
          styles.messageWrapper, 
          isUser ? styles.userWrapper : styles.aiWrapper
        ]}
      >
        {!isUser && (
          <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={14} color="#FFF" />
          </View>
        )}

        <View style={[
          styles.bubble,
          isUser 
            ? [styles.bubbleUser, { backgroundColor: colors.primary }]
            : [styles.bubbleAI, { backgroundColor: isDark ? '#262626' : '#F3F4F6' }]
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.textUser : [styles.textAI, { color: colors.text }]
          ]}>
            {msg.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Modern Header */}
      <SafeAreaView style={{ backgroundColor: colors.background, zIndex: 10 }}>
        <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#EEE' }]}>
          <View style={styles.headerInfo}>
            <View
              style={[styles.headerIcon, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="sparkles" size={20} color="#FFF" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>EduPartner AI</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Gemini 2.5 Flash</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={handleDeleteChat}
          >
            <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentUser === undefined || (currentUser && messages === undefined) ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              {(!messages || messages.length === 0) && (
                <Animated.View entering={FadeIn.duration(600)} style={styles.welcomeContainer}>
                  <View style={[styles.welcomeIcon, { backgroundColor: colors.primary + '10' }]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.primary} />
                  </View>
                  <Text style={[styles.welcomeTitle, { color: colors.text }]}>Ada yang bisa dibantu?</Text>
                  <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                    Tanyakan apa saja seputar pelajaran, tugas, atau minta saran belajar pada EduPartner AI.
                  </Text>
                  
                  <View style={styles.suggestionGrid}>
                    {['Bantu kerjakan soal MTK', 'Jelaskan Hukum Newton', 'Tips belajar efektif'].map((item, i) => (
                      <TouchableOpacity 
                        key={i} 
                        style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => setInputText(item)}
                      >
                        <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>
              )}
              
              {messages?.map((msg, index) => renderBubble(msg, index))}

              {isTyping && (
                <View style={styles.typingIndicator}>
                  <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]}>
                    <Ionicons name="sparkles" size={14} color="#FFF" />
                  </View>
                  <View style={[styles.bubbleAI, styles.typingBubble, { backgroundColor: isDark ? '#262626' : '#F3F4F6' }]}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.typingText, { color: colors.textSecondary }]}>Sedang berpikir...</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Modern Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: isDark ? colors.background : '#FFF', borderTopWidth: 1, borderTopColor: colors.border }]}>
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#262626' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="happy-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Tanya sesuatu..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? colors.primary : colors.textSecondary + '20' }
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons name="arrow-up" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20, 
    flexGrow: 1,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: width * 0.78,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textAI: {
    fontWeight: '400',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: height * 0.1,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  typingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  attachmentButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
