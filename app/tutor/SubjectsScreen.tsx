import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectsScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors } = useTheme();

  const user = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  const tutorProfile = useQuery(api.tutors.getTutorByUserId, user?._id ? { userId: user._id } : "skip");
  const updateTutor = useMutation(api.tutors.updateTutorProfile);
  const createTutor = useMutation(api.tutors.createTutorProfile);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tutorProfile?.subjects) {
      setSubjects(tutorProfile.subjects);
    }
  }, [tutorProfile]);

  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) {
      Alert.alert("Duplikat", "Subjek ini sudah ada.");
      return;
    }
    setSubjects([...subjects, trimmed]);
    setNewSubject('');
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (tutorProfile) {
        await updateTutor({ id: tutorProfile._id, subjects });
      } else {
        await createTutor({ userId: user._id, subjects, bio: '', availability: '' });
      }
      Alert.alert("Berhasil", "Subjek berhasil disimpan!");
      router.push('/tutor/TutorProfileScreen' as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal menyimpan subjek.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || colors === undefined) {
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Subjek Saya</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Add Subject */}
        <View style={styles.addRow}>
          <TextInput
            style={[styles.addInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Tambah subjek baru..."
            placeholderTextColor={colors.textMuted}
            value={newSubject}
            onChangeText={setNewSubject}
            onSubmitEditing={addSubject}
          />
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={addSubject}>
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Subject List */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          {subjects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={36} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada subjek. Tambahkan di atas!</Text>
            </View>
          ) : (
            subjects.map((subject, index) => (
              <View key={index} style={[styles.subjectItem, { borderBottomColor: colors.background }]}>
                <View style={styles.subjectLeft}>
                  <View style={[styles.subjectDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.subjectText, { color: colors.text }]}>{subject}</Text>
                </View>
                <TouchableOpacity onPress={() => removeSubject(index)} style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={22} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Save */}
        <TouchableOpacity style={[styles.saveBtn, isSaving && { opacity: 0.7 }, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.saveBtnText}>Simpan Subjek</Text>}
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
  addRow: { flexDirection: 'row', marginBottom: 20, gap: 12 },
  addInput: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB',
  },
  addBtn: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  emptyContainer: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { color: '#9CA3AF', fontSize: 14, marginTop: 12 },
  subjectItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  subjectLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  subjectDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F46E5', marginRight: 14 },
  subjectText: { fontSize: 15, color: '#111827', fontWeight: '600' },
  removeBtn: { padding: 4 },
  saveBtn: { backgroundColor: '#4F46E5', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
