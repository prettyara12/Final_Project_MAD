import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const LEARNING_STYLES = ['Visual', 'Theory', 'Practice'];
const TIMES = ['Morning', 'Afternoon', 'Evening'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function AIPreferenceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profileData } = useProfile();
  const { t } = useLanguage();
  
  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const savePreference = useMutation(api.tutors.saveStudentPreference);

  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [learningStyle, setLearningStyle] = useState('Visual');
  const [preferredTime, setPreferredTime] = useState('Morning');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', t('error_subject_required') || 'Silakan masukkan mata pelajaran yang dicari.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', t('error_verify_user'));
      return;
    }

    setIsLoading(true);
    try {
      await savePreference({
        userId: currentUser._id,
        subject,
        topic,
        learningStyle,
        preferredTime,
        difficulty,
        notes,
      });

      router.push({
        pathname: '/AIResultScreen',
        params: { 
          subject,
          preferredTime,
          learningStyle,
          difficulty
        }
      } as any);
    } catch (error) {
      Alert.alert('Error', t('error_save_pref'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (options: string[], current: string, setter: (val: string) => void) => (
    <View style={styles.optionsRow}>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt}
          style={[
            styles.optionButton, 
            { backgroundColor: current === opt ? colors.primary : colors.surfaceAlt, borderColor: colors.border },
            current === opt && { borderColor: colors.primary }
          ]}
          onPress={() => setter(opt)}
        >
          <Text style={[styles.optionText, { color: current === opt ? '#FFF' : colors.textSecondary }]}>
            {t(`opt_${opt.toLowerCase()}`) || opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('ai_search_pref')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('customize_learning')}</Text>
          </View>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            {t('ai_find_tutor_desc')}
          </Text>

          {/* Subject Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('subject_label')}</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              placeholder={t('subject_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Topic Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('topic_label')}</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              placeholder={t('topic_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          {/* Learning Style */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('learning_style_label')}</Text>
            {renderOption(LEARNING_STYLES, learningStyle, setLearningStyle)}
          </View>

          {/* Preferred Time */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('time_pref_label')}</Text>
            {renderOption(TIMES, preferredTime, setPreferredTime)}
          </View>

          {/* Difficulty */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('difficulty_label')}</Text>
            {renderOption(DIFFICULTY_LEVELS, difficulty, setDifficulty)}
          </View>

          {/* Additional Notes */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('additional_notes')}</Text>
            <TextInput 
              style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              placeholder={t('notes_placeholder')}
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>{t('find_best_tutor')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  backButton: { padding: 4 },
  scrollContent: { padding: 20 },
  card: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  sectionDesc: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  optionText: { fontSize: 12, fontWeight: '700' },
  submitButton: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
