import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const DAYS = [
  { id: 'mon', label: 'Senin' },
  { id: 'tue', label: 'Selasa' },
  { id: 'wed', label: 'Rabu' },
  { id: 'thu', label: 'Kamis' },
  { id: 'fri', label: 'Jumat' },
  { id: 'sat', label: 'Sabtu' },
  { id: 'sun', label: 'Minggu' },
];

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function AvailabilityScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors } = useTheme();

  const user = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  const tutorProfile = useQuery(api.tutors.getTutorByUserId, user?._id ? { userId: user._id } : "skip");
  const updateTutor = useMutation(api.tutors.updateTutorProfile);
  const createTutor = useMutation(api.tutors.createTutorProfile);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tutorProfile?.availability) {
      try {
        const parsed = JSON.parse(tutorProfile.availability);
        setSelectedDays(parsed.days || []);
        setSelectedTimes(parsed.times || []);
      } catch {
        // fallback
      }
    }
  }, [tutorProfile]);

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const availability = JSON.stringify({ days: selectedDays, times: selectedTimes });
    try {
      if (tutorProfile) {
        await updateTutor({ id: tutorProfile._id, availability });
      } else {
        await createTutor({ userId: user._id, subjects: [], bio: '', availability });
      }
      Alert.alert("Berhasil", "Ketersediaan berhasil disimpan!");
      router.push('/tutor/TutorProfileScreen' as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal menyimpan ketersediaan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.push('/tutor/TutorProfileScreen' as any)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ketersediaan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Days Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hari yang Tersedia</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <TouchableOpacity key={day.id} style={[styles.dayItem, { borderBottomColor: colors.background }]} onPress={() => toggleDay(day.id)}>
                <Text style={[styles.dayText, { color: colors.text }]}>{day.label}</Text>
                <View style={[styles.checkbox, { borderColor: colors.borderAlt }, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Times Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Jam yang Tersedia</Text>
        <View style={styles.timesGrid}>
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTimes.includes(time);
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeChip, { backgroundColor: colors.surface, borderColor: colors.borderAlt }, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => toggleTime(time)}
              >
                <Text style={[styles.timeText, { color: colors.textSecondary }, isSelected && { color: "#FFFFFF" }]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save */}
        <TouchableOpacity style={[styles.saveBtn, isSaving && { opacity: 0.7 }, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.saveBtnText}>Simpan Ketersediaan</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 44 : 12, paddingBottom: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12, marginTop: 8 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8, marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  dayItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  dayText: { fontSize: 15, color: '#111827', fontWeight: '600' },
  checkbox: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  timeChip: {
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
  },
  timeChipActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  timeText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  timeTextActive: { color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#4F46E5', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
