import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomTabBar } from '../components/BottomTabBar';

const { width } = Dimensions.get('window');

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'ai',
    text: 'Halo! Saya Mitra Akademik AI Anda. Saya dapat membantu Anda menyelesaikan persamaan kompleks, menjelaskan peristiwa sejarah, atau bahkan membantu Anda menyusun esai berikutnya. Apa yang kita pelajari hari ini?',
    options: [
      'Jelaskan Fisika Kuantum',
      'Bantuan Masalah Matematika'
    ]
  },
  {
    id: '2',
    sender: 'user',
    text: 'Bisakah Anda menjelaskan perbedaan antara Mitosis dan Meiosis dalam istilah sederhana? Saya ada tes biologi besok.'
  },
  {
    id: '3',
    sender: 'ai',
    isRich: true, // specific flag to render the rich content block
  }
];

export default function AIChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    
    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI typing / response delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Ini adalah contoh respons simulasi dari AI Assistant. Fitur ini akan segera diintegrasikan dengan database Convex!'
      }]);
    }, 1500);
  };

  const renderBubble = (msg: any) => {
    const isUser = msg.sender === 'user';

    return (
      <View key={msg.id} style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
        
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="hardware-chip" size={16} color="#FFF" />
          </View>
        )}

        <View style={isUser ? styles.bubbleUserWrapper : styles.bubbleAIWrapper}>
          <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
            
            {/* Standard Text Message */}
            {msg.text && (
              <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAI]}>
                {msg.text}
              </Text>
            )}

            {/* AI Options Chips */}
            {msg.options && (
              <View style={styles.optionsContainer}>
                {msg.options.map((opt: string, idx: number) => (
                  <TouchableOpacity key={idx} style={styles.optionChip}>
                    <Text style={styles.optionChipText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Custom Rich Content Message (Cell Division Example) */}
            {msg.isRich && (
              <View style={styles.richContent}>
                 <Text style={styles.richTitle}>Penjelasan{'\n'}Pembelahan Sel</Text>
                 
                 <View style={styles.richList}>
                    <View style={styles.richListItem}>
                      <View style={styles.richListBorder} />
                      <View style={styles.richListContent}>
                        <Text style={styles.richListTitle}>1. Mitosis: Mesin Fotokopi</Text>
                        <Text style={styles.richListText}>Anggap ini seperti membuat fotokopi yang tepat. Satu sel membelah sekali untuk membentuk dua sel "anak" yang identik. Ini adalah cara tubuh Anda tumbuh atau menyembuhkan luka.</Text>
                      </View>
                    </View>
                    
                    <View style={styles.richListItem}>
                      <View style={styles.richListBorder} />
                      <View style={styles.richListContent}>
                        <Text style={styles.richListTitle}>2. Meiosis: Pengocok</Text>
                        <Text style={styles.richListText}>Ini lebih seperti mengocok setumpuk kartu. Satu sel membelah dua kali untuk membentuk empat sel unik dengan setengah DNA asli. Ini hanya terjadi untuk reproduksi.</Text>
                      </View>
                    </View>
                 </View>

                 {/* Rich Cards */}
                 <View style={styles.richCardsRow}>
                    <View style={styles.richCard}>
                       <View style={styles.richCardIconBoxBlue}>
                          <Ionicons name="copy" size={18} color="#4F46E5" />
                       </View>
                       <Text style={styles.richCardSubtitle}>MITOSIS</Text>
                       <Text style={styles.richCardTitle}>Sel Somatik (Tubuh)</Text>
                    </View>
                 </View>

                 <View style={styles.richCardsRow}>
                    <View style={styles.richCard}>
                       <View style={styles.richCardIconBoxPurple}>
                          <Ionicons name="people" size={18} color="#9333EA" />
                       </View>
                       <Text style={styles.richCardSubtitle}>MEIOSIS</Text>
                       <Text style={styles.richCardTitle}>Gamet (Sel Kelamin)</Text>
                    </View>
                 </View>

                 {/* Source Footer */}
                 <View style={styles.richFooter}>
                    <Text style={styles.richSourceText}>Sumber:{'\n'}Campbell Biology, Khan Academy</Text>
                    <View style={styles.richFeedback}>
                       <TouchableOpacity style={styles.feedbackBtn}>
                         <Ionicons name="thumbs-up" size={16} color="#9CA3AF" />
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.feedbackBtn}>
                         <Ionicons name="thumbs-down" size={16} color="#9CA3AF" />
                       </TouchableOpacity>
                    </View>
                 </View>

              </View>
            )}

          </View>
        </View>

        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
        )}

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconWrapper}>
               <Ionicons name="hardware-chip" size={18} color="#FFF" />
            </View>
            <Text style={styles.headerLogoText}>EduPartner AI</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications" size={20} color="#4B5563" />
            </TouchableOpacity>
            <View style={styles.avatarMini}>
              <Ionicons name="person" size={16} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Chat List */}
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderBubble)}
        </ScrollView>

        {/* Input Field Section */}
        <View style={styles.inputAreaWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachBtn}>
              <Ionicons name="attach" size={24} color="#6B7280" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              placeholder="Ajukan pertanyaan..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            <TouchableOpacity 
              style={[styles.sendBtn, inputText.trim().length > 0 && styles.sendBtnActive]} 
              onPress={handleSend}
            >
              <Ionicons name="send" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
      <BottomTabBar activeRoute="chat" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC', // light grey bg
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 20,
    backgroundColor: '#FAFAFC',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4F46E5', // purple main brand
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationBtn: {
    padding: 2,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // space below messages for floating input
    paddingTop: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
    width: '100%',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1', // indigo AI
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A855F7', // user purple
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  bubbleAIWrapper: {
    flex: 1,
    maxWidth: '85%',
    alignItems: 'flex-start',
  },
  bubbleUserWrapper: {
    flex: 1,
    maxWidth: '80%',
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
  },
  bubbleAI: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: '#4F46E5', // user primary
    borderTopRightRadius: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  messageTextAI: {
    color: '#374151',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  optionsContainer: {
    marginTop: 16,
    gap: 10,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  optionChipText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Rich Content specific classes
  richContent: {
    width: '100%',
  },
  richTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 20,
    lineHeight: 22,
  },
  richList: {
    marginBottom: 24,
  },
  richListItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  richListBorder: {
    width: 2,
    backgroundColor: '#E5E7EB', // light grey border
    marginRight: 16,
    borderRadius: 1,
  },
  richListContent: {
    flex: 1,
  },
  richListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  richListText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  richCardsRow: {
    marginBottom: 12,
    alignItems: 'center',
  },
  richCard: {
    width: '100%',
    backgroundColor: '#FAFAFC', // very light grey for the inner card box
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  richCardIconBoxBlue: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0E7FF', // lighter blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  richCardIconBoxPurple: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3E8FF', // ligher purple
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  richCardSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 4,
  },
  richCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  richFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  richSourceText: {
    fontSize: 10,
    color: '#9CA3AF',
    lineHeight: 14,
    flex: 1,
    marginRight: 10,
  },
  richFeedback: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackBtn: {
    padding: 4,
  },
  // Floating Input Field
  inputAreaWrapper: {
    position: 'absolute',
    bottom: 96, // Above bottom tab bar
    left: 16,
    right: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  attachBtn: {
    padding: 12,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
    color: '#111827',
    paddingHorizontal: 8,
    paddingTop: 10, // vertical alignment for multiline
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB', // inactive grey
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnActive: {
    backgroundColor: '#4F46E5', // active blue/purple
  },
});
