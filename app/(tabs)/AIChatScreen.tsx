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
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const GEMINI_API_KEY ='AIzaSyDhE-BjTJPLSt9ZY0iV1e7uBgnCcT-x3I8';

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT =
  `Kamu adalah Mitra Akademik AI yang membantu siswa belajar. ` +
  `Jawab dalam Bahasa Indonesia dengan jelas, ramah, dan edukatif. ` +
  `Gunakan penjelasan sederhana dan contoh nyata. ` +
  `Jika ada rumus atau poin penting, gunakan format yang mudah dibaca. ` +
  `Batasi jawaban agar tidak terlalu panjang kecuali diminta.`;

const SB_HEIGHT =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Role = 'user' | 'ai';

interface Message {
  id: string;
  role: Role;
  text: string;
  options?: string[];
  isLoading?: boolean;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const CHIPS = [
  'Jelaskan Fisika Kuantum',
  'Bantuan Masalah Matematika',
  'Apa itu DNA?',
  'Cara belajar efektif',
];

// ─────────────────────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────────────────────
export default function AIChatScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text:
        'Halo! Saya Mitra Akademik AI Anda. Saya dapat membantu Anda menyelesaikan persamaan kompleks, menjelaskan peristiwa sejarah, atau bahkan membantu Anda menyusun esai berikutnya. Apa yang kita pelajari hari ini?',
      options: CHIPS,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef<GeminiContent[]>([]);

  // ── Kirim ke Gemini ────────────────────────────────────────────────────────
  const callGemini = async (userText: string): Promise<string> => {
    historyRef.current.push({ role: 'user', parts: [{ text: userText }] });

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: historyRef.current,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Gemini API error');

    const reply: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Maaf, tidak ada respons.';

    historyRef.current.push({ role: 'model', parts: [{ text: reply }] });
    return reply;
  };

  // ── Handle Send ────────────────────────────────────────────────────────────
  const handleSend = async (override?: string) => {
    const text = (override ?? inputText).trim();
    if (!text || isLoading) return;

    if (GEMINI_API_KEY ==='AIzaSyDhE-BjTJPLSt9ZY0iV1e7uBgnCcT-x3I8') {
      Alert.alert(
        'API Key Belum Diisi',
        'Buka file AIChatScreen.tsx, cari baris GEMINI_API_KEY dan ganti dengan API key dari https://aistudio.google.com',
      );
      return;
    }

    setInputText('');
    setIsLoading(true);

    const userId = Date.now().toString();
    const loadId = (Date.now() + 1).toString();

    setMessages(prev => [
      ...prev,
      { id: userId, role: 'user', text },
      { id: loadId, role: 'ai', text: '', isLoading: true },
    ]);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const reply = await callGemini(text);
      setMessages(prev =>
        prev.map(m =>
          m.id === loadId ? { ...m, text: reply, isLoading: false } : m,
        ),
      );
    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadId
            ? {
                ...m,
                text: `Terjadi kesalahan: ${err.message ?? 'Periksa API key dan koneksi internet.'}`,
                isLoading: false,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  // ── Render Bubble ──────────────────────────────────────────────────────────
  const renderBubble = (msg: Message) => {
    const isUser = msg.role === 'user';
    return (
      <View
        key={msg.id}
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAI,
        ]}
      >
        {!isUser && (
          <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="hardware-chip" size={16} color="#FFF" />
          </View>
        )}

        <View style={isUser ? styles.bubbleUserWrapper : styles.bubbleAIWrapper}>
          <View
            style={[
              styles.bubble,
              isUser
                ? [styles.bubbleUser, { backgroundColor: colors.primary }]
                : [styles.bubbleAI, { backgroundColor: colors.card, borderColor: colors.border }],
            ]}
          >
            {msg.isLoading ? (
              <View style={styles.typingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.typingText, { color: colors.textSecondary }]}>
                  Sedang mengetik...
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.messageText,
                  isUser
                    ? styles.messageTextUser
                    : [styles.messageTextAI, { color: colors.text }],
                ]}
              >
                {msg.text}
              </Text>
            )}

            {msg.options && !msg.isLoading && (
              <View style={styles.optionsContainer}>
                {msg.options.map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionChip,
                      { backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                    onPress={() => handleSend(opt)}
                  >
                    <Text style={[styles.optionChipText, { color: colors.primary }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {isUser && (
          <View style={[styles.userAvatar, { backgroundColor: colors.avatarBg }]}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
        )}
      </View>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── HEADER — tidak diubah dari kode asli ── */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              paddingTop: SB_HEIGHT + 12,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Image
            source={require('../../assets/images/logo.jpeg')}
            style={styles.logoImage}
          />
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => router.push('/NotificationScreen' as any)}
            >
              <Ionicons name="notifications" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Reset Chat', 'Hapus semua riwayat percakapan?', [
                  { text: 'Batal', style: 'cancel' },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                      historyRef.current = [];
                      setMessages([
                        {
                          id: Date.now().toString(),
                          role: 'ai',
                          text: 'Percakapan direset. Ada yang ingin kamu tanyakan?',
                          options: CHIPS,
                        },
                      ]);
                    },
                  },
                ])
              }
            >
              <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.avatarMini, { backgroundColor: colors.avatarBg }]}>
              <Ionicons name="person" size={16} color="#FFF" />
            </View>
          </View>
        </View>

        {/* ── CHAT LIST ── */}
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={[
            styles.scrollContent,
            // Padding bawah agar konten terakhir tidak tertutup input bar
            { paddingBottom: 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(renderBubble)}
        </ScrollView>

        {/* ── INPUT BAR ──
            Tidak lagi menggunakan position: absolute.
            Menggunakan layout normal + paddingBottom dari insets.bottom
            agar tidak tertutup navigation bar / home indicator Android & iOS.
        ── */}
        <View
          style={[
            styles.inputAreaWrapper,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              // Tambahkan jarak bawah sesuai tinggi navigation bar perangkat
              paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
            },
          ]}
        >
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity style={styles.attachBtn}>
              <Ionicons name="attach" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Ajukan pertanyaan..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              editable={!isLoading}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    inputText.trim().length > 0 && !isLoading
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={() => handleSend()}
              disabled={isLoading || inputText.trim().length === 0}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={16} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
            Jawaban AI bisa saja tidak akurat. Verifikasi informasi penting.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },

  // Header — identik dengan kode asli
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationBtn: { padding: 2 },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // Messages
  messageRow: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
    width: '100%',
  },
  messageRowAI: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  bubbleAIWrapper: { flex: 1, maxWidth: '85%', alignItems: 'flex-start' },
  bubbleUserWrapper: { flex: 1, maxWidth: '80%', alignItems: 'flex-end' },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
  },
  bubbleAI: {
    borderTopLeftRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  bubbleUser: { borderTopRightRadius: 8 },
  messageText: { fontSize: 14, lineHeight: 22 },
  messageTextAI: { color: '#374151' },
  messageTextUser: { color: '#FFFFFF' },

  // Typing indicator
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { fontSize: 13 },

  // Quick chips
  optionsContainer: { marginTop: 16, gap: 10 },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionChipText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },

  // Input bar — layout normal, bukan absolute
  inputAreaWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  attachBtn: { padding: 12 },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
});