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
import { generateStudyPlan } from '../../services/gemini';

export default function StudyPlannerScreen() {
  const router = useRouter();
  const { colors } = useTheme();

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
      Alert.alert('Input Tidak Lengkap', 'Harap isi mata pelajaran dan tujuan belajar Anda.');
      return;
    }

    const h = parseInt(hours) || 2;
    const d = parseInt(days) || 5;

    if (h < 1 || h > 12) {
      Alert.alert('Input Tidak Valid', 'Jam belajar per hari harus antara 1-12 jam.');
      return;
    }

    if (d < 1 || d > 30) {
      Alert.alert('Input Tidak Valid', 'Durasi harus antara 1-30 hari.');
      return;
    }

    setIsLoading(true);
    try {
      const plan = await generateStudyPlan(subject, goal, h, d);
      
      if (plan) {
        router.push({
          pathname: '/(tabs)/StudyPlanResultScreen' as any,
          params: { planData: JSON.stringify(plan), subject }
        });
      } else {
        Alert.alert('Gagal', 'AI tidak dapat menghasilkan rencana saat ini. Coba lagi.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan sistem.');
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Study Planner</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
             <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>Buat Rencana Belajar</Text>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            Beritahu AI apa yang ingin Anda pelajari, dan dapatkan jadwal terstruktur dari hari ke hari.
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Mata Pelajaran / Topik</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Contoh: Matematika Diskrit, React Native..."
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tujuan Belajar</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, height: 80, textAlignVertical: 'top' }]}
              placeholder="Contoh: Persiapan ujian akhir, Menguasai dasar-dasar..."
              placeholderTextColor={colors.textMuted}
              value={goal}
              onChangeText={setGoal}
              multiline
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: colors.text }]}>Jam per Hari</Text>
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
              <Text style={[styles.label, { color: colors.text }]}>Durasi (Hari)</Text>
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
              <Text style={styles.generateBtnText}>Generate Study Plan</Text>
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
