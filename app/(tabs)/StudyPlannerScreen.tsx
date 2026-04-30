import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { generateStudyPlan } from '../../services/gemini';

export default function StudyPlannerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, language } = useLanguage();

  const [subject, setSubject] = useState('');
  const [goal, setGoal] = useState('');
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSubject('');
      setGoal('');
      setHours('');
      setDays('');
      setIsLoading(false);
    }, [])
  );

  const handleGenerate = async () => {
    if (!subject.trim() || !goal.trim()) {
      Alert.alert(t('error_input_incomplete'), t('error_fill_subject_goal'));
      return;
    }

    const h = parseInt(hours) || 2;
    const d = parseInt(days) || 5;

    if (h < 1 || h > 12) {
      Alert.alert(t('error_invalid_input'), t('error_hours_range'));
      return;
    }

    if (d < 1 || d > 30) {
      Alert.alert(t('error_invalid_input'), t('error_days_range'));
      return;
    }

    setIsLoading(true);
    try {
      const plan = await generateStudyPlan(subject, goal, h, d, language as any);
      
      if (plan) {
        router.push({
          pathname: '/(tabs)/StudyPlanResultScreen' as any,
          params: { planData: JSON.stringify(plan), subject }
        });
      } else {
        Alert.alert(t('failed'), t('failed_analyze_alert'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('error_system'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('study_planner_title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
             <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>{t('create_schedule')}</Text>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            {t('planner_desc')}
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('subject_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder={t('subject_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('goal_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, height: 80, textAlignVertical: 'top' }]}
              placeholder={t('goal_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={goal}
              onChangeText={setGoal}
              multiline
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('hours_day_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="2"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('duration_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="5"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={days}
                onChangeText={setDays}
              />
            </View>
          </View>

        </View>

        <TouchableOpacity 
          style={[styles.generateBtn, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
          onPress={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>{t('generate_plan')}</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  generateBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  }
});
