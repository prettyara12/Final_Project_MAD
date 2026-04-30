import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeOutLeft, Layout, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../convex/_generated/api';
import { getGeminiResponse } from '../../services/gemini';

const { width, height } = Dimensions.get('window');

// AI Chat Integration
const AI_BOT_ID = "ai_system_bot";

export default function AIChatScreen() {
  const { colors, isDark } = useTheme();
  const { profileData } = useProfile();
  const { language, t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{ startTime: number, endTime: number } | null>(null);
  const [selectedModel, setSelectedModel] = useState({
    id: "gemma-3-27b-it",
    name: "Gemma 3 (27B)",
    label: t('model_balanced_label')
  });
  const scrollViewRef = useRef<ScrollView>(null);

  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const messages = useQuery(api.messages.getMessages,
    currentUser ? { userA: currentUser._id, userB: AI_BOT_ID } : "skip"
  );
  const aiSessions = useQuery(api.messages.getAIChatSessions, 
    currentUser ? { userId: currentUser._id } : "skip"
  );
  
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteConversation = useMutation(api.messages.deleteConversation);
  const deleteSession = useMutation(api.messages.deleteMessagesInRange);

  // Filter messages based on selected session
  const filteredMessages = React.useMemo(() => {
    if (!messages) return [];
    if (!selectedSession) return messages; // Show all if no session selected (or we can show only latest)
    
    return messages.filter(msg => 
      msg.timestamp >= selectedSession.startTime && 
      msg.timestamp <= selectedSession.endTime
    );
  }, [messages, selectedSession]);

  const handleDeleteChat = () => {
    if (!currentUser || !messages || messages.length === 0) return;

    Alert.alert(
      t('delete_chat'),
      t('delete_chat_confirm'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('delete'), 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteConversation({ userA: currentUser._id, userB: AI_BOT_ID });
            } catch (error) {
              console.error("Failed to delete chat:", error);
              Alert.alert("Error", t('failed_delete'));
            }
          }
        }
      ]
    );
  };

  const handleSend = async () => {
    if (inputText.trim().length === 0 || !currentUser) {
      if (!currentUser && inputText.trim().length > 0) {
        Alert.alert(t('info'), t('complete_profile_chat'));
      }
      return;
    }

    // If we were viewing an old session, clear it to start "new" or continue in latest
    if (selectedSession) {
      setSelectedSession(null);
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

      // We use ALL messages for context, or just the current "session" context
      // For now, let's use the last 10 messages for context
      const contextMessages = (messages || []).slice(-10).map(msg => ({
        role: msg.senderId === currentUser._id ? "user" : "model" as "user" | "model",
        parts: [{ text: msg.content }]
      }));

      // 3. Get AI Response
      const aiResponse = await getGeminiResponse(text, contextMessages, selectedModel.id, language);

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

  const handleDeleteSession = (session: any) => {
    if (!currentUser) return;

    Alert.alert(
      t('delete_session_title'),
      t('delete_session_confirm'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('delete'), 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSession({ 
                userId: currentUser._id, 
                startTime: session.startTime, 
                endTime: session.lastTimestamp 
              });
              if (selectedSession?.startTime === session.startTime) {
                setSelectedSession(null);
              }
            } catch (error) {
              console.error("Failed to delete session:", error);
            }
          }
        }
      ]
    );
  };

  const formatSessionDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay && date.getDate() === now.getDate()) {
      return t('today') + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 2 * oneDay) {
      return t('yesterday') + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <View style={[styles.headerIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="sparkles" size={18} color="#FFF" />
            </View>
            <TouchableOpacity 
              style={styles.headerTitleContainer}
              onPress={() => setIsModelModalOpen(true)}
            >
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {selectedSession ? t('history') : "EduPartner AI"}
              </Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                  {selectedSession ? formatSessionDate(selectedSession.startTime) : selectedModel.name}
                </Text>
                {!selectedSession && <Ionicons name="chevron-down" size={12} color={colors.textSecondary} style={{ marginLeft: 4 }} />}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              onPress={() => setIsHistoryOpen(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {selectedSession && (
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.card }]}
                onPress={() => setSelectedSession(null)}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              onPress={handleDeleteChat}
            >
              <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
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
              {(!filteredMessages || filteredMessages.length === 0) && (
                <Animated.View entering={FadeIn.duration(600)} style={styles.welcomeContainer}>
                  <View style={[styles.welcomeIcon, { backgroundColor: colors.primary + '10' }]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.primary} />
                  </View>
                  <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                    {selectedSession ? t('history') : t('welcome')}
                  </Text>
                  <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                    {selectedSession 
                      ? t('old_chat_history')
                      : t('ask_anything_ai')
                    }
                  </Text>
                  
                  {!selectedSession && (
                    <View style={styles.suggestionGrid}>
                      {[t('suggestion_math'), t('suggestion_newton'), t('suggestion_study')].map((item, i) => (
                        <TouchableOpacity 
                          key={i} 
                          style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                          onPress={() => setInputText(item)}
                        >
                          <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </Animated.View>
              )}
              
              {filteredMessages?.map((msg, index) => renderBubble(msg, index))}

              {isTyping && !selectedSession && (
                <View style={styles.typingIndicator}>
                  <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]}>
                    <Ionicons name="sparkles" size={14} color="#FFF" />
                  </View>
                  <View style={[styles.bubbleAI, styles.typingBubble, { backgroundColor: isDark ? '#262626' : '#F3F4F6' }]}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.typingText, { color: colors.textSecondary }]}>{t('thinking')}</Text>
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
              placeholder={t('ask_something')}
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

      {/* History Drawer Modal */}
      <Modal
        visible={isHistoryOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsHistoryOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={() => setIsHistoryOpen(false)} 
          />
          <Animated.View 
            entering={SlideInLeft.duration(300)}
            exiting={SlideOutLeft.duration(200)}
            style={[styles.historyDrawer, { backgroundColor: colors.background }]}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.drawerTitle, { color: colors.text }]}>{t('history')}</Text>
                <TouchableOpacity onPress={() => setIsHistoryOpen(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.newChatButton, { backgroundColor: colors.primary + '15' }]}
                onPress={() => {
                  setSelectedSession(null);
                  setIsHistoryOpen(false);
                }}
              >
                <Ionicons name="add-circle" size={20} color={colors.primary} />
                <Text style={[styles.newChatText, { color: colors.primary }]}>{t('new_chat')}</Text>
              </TouchableOpacity>

              {aiSessions === undefined ? (
                <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
              ) : aiSessions.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Ionicons name="calendar-outline" size={40} color={colors.textSecondary} />
                  <Text style={[styles.emptyHistoryText, { color: colors.textSecondary }]}>{t('no_history')}</Text>
                </View>
              ) : (
                <FlatList
                  data={aiSessions}
                  keyExtractor={(item) => item.startTime.toString()}
                  contentContainerStyle={styles.historyList}
                  renderItem={({ item }) => (
                    <View style={styles.sessionItemContainer}>
                      <TouchableOpacity 
                        style={[
                          styles.sessionItem, 
                          selectedSession?.startTime === item.startTime && { backgroundColor: colors.primary + '10', borderColor: colors.primary }
                        ]}
                        onPress={() => {
                          setSelectedSession({ startTime: item.startTime, endTime: item.lastTimestamp });
                          setIsHistoryOpen(false);
                        }}
                      >
                        <View style={styles.sessionInfo}>
                          <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                            {formatSessionDate(item.startTime)}
                          </Text>
                          <Text 
                            style={[styles.sessionPreview, { color: colors.text }]} 
                            numberOfLines={1}
                          >
                            {item.preview}
                          </Text>
                          <Text style={[styles.sessionStats, { color: colors.textSecondary }]}>
                            {t('messages_count').replace('{count}', item.messageCount.toString())}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.sessionDeleteBtn}
                        onPress={() => handleDeleteSession(item)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FF4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}

              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={handleDeleteChat}
              >
                <Text style={styles.clearAllText}>{t('delete_chat')}</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>

      {/* Model Selection Modal */}
      <Modal
        visible={isModelModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModelModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsModelModalOpen(false)}
        >
          <View style={[styles.modelModal, { backgroundColor: colors.background }]}>
            <Text style={[styles.modelModalTitle, { color: colors.text }]}>{t('select_model')}</Text>
            
            {[
              { id: "gemma-3-27b-it", name: "Gemma 3 (27B)", label: t('model_smart_label'), icon: "hardware-chip-outline", color: "#8B5CF6" },
              { id: "gemma-3-12b-it", name: "Gemma 3 (12B)", label: t('model_balanced_label'), icon: "flash-outline", color: "#3B82F6" },
              { id: "gemma-3-4b-it", name: "Gemma 3 (4B)", label: t('model_fast_label'), icon: "rocket-outline", color: "#10B981" },
            ].map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelOption,
                  selectedModel.id === model.id && { backgroundColor: colors.primary + '10', borderColor: colors.primary }
                ]}
                onPress={() => {
                  setSelectedModel(model);
                  setIsModelModalOpen(false);
                }}
              >
                <View style={[styles.modelIcon, { backgroundColor: model.color + '15' }]}>
                  <Ionicons name={model.icon as any} size={20} color={model.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modelName, { color: colors.text }]}>{model.name}</Text>
                  <Text style={[styles.modelLabel, { color: colors.textSecondary }]}>{model.label}</Text>
                </View>
                {selectedModel.id === model.id && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerTitleContainer: {
    justifyContent: 'center',
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
    marginTop: height * 0.05,
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
  // History Drawer Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCloseArea: {
    flex: 1,
  },
  historyDrawer: {
    width: width * 0.8,
    height: '100%',
    position: 'absolute',
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  newChatText: {
    fontWeight: '600',
    fontSize: 15,
  },
  historyList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sessionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sessionItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionPreview: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  sessionStats: {
    fontSize: 11,
  },
  sessionDeleteBtn: {
    padding: 8,
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyHistoryText: {
    marginTop: 10,
    fontSize: 14,
  },
  clearAllButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  clearAllText: {
    color: '#FF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  // Model Modal Styles
  modelModal: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modelModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 12,
    gap: 12,
  },
  modelIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '700',
  },
  modelLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
