import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

const AI_TUTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    subjects: 'Kalkulus Lanjut & Fisika',
    rating: 4.9,
    reviews: 124,
    rate: '$45/jam',
    match: '98%',
    available: true,
  },
  {
    id: '2',
    name: 'James Wilson',
    subjects: 'Python & Data Science',
    rating: 4.8,
    reviews: 89,
    rate: '$35/jam',
    match: '92%',
    available: true,
  },
];

const POPULAR_SUBJECTS = [
  { id: '1', name: 'Matematika', icon: 'calculator-outline', color: '#EBE2FF', iconColor: '#7C3AED' },
  { id: '2', name: 'Koding', icon: 'code-slash-outline', color: '#FCE7F3', iconColor: '#DB2777' },
  { id: '3', name: 'Bahasa', icon: 'globe-outline', color: '#FCE7F3', iconColor: '#E11D48' },
  { id: '4', name: 'Biologi', icon: 'flask-outline', color: '#EBE2FF', iconColor: '#4F46E5' },
  { id: '5', name: 'Desain', icon: 'color-palette-outline', color: '#F3E8FF', iconColor: '#9333EA' },
  { id: '6', name: 'Sejarah', icon: 'time-outline', color: '#FEE2E2', iconColor: '#E11D48' },
];

const UPCOMING_SESSIONS = [
  {
    id: '1',
    dateText: 'OKT\n24',
    title: 'Fisika Lanjut',
    time: '14:00 - 15:30',
    tutor: 'Dr. Sarah Jenkins',
    borderColor: '#4F46E5',
  },
  {
    id: '2',
    dateText: 'OKT\n24',
    title: 'Dasar Desain UI/UX',
    time: '17:00 - 18:00',
    tutor: 'Maria Garcia',
    borderColor: '#9333EA',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTutors = AI_TUTORS.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* ── HEADER ── */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        {/* 
          Kunci logo rapat kiri:
          - Bungkus Image dalam TouchableOpacity/View kecil
          - Jangan pakai width besar pada Image dengan resizeMode contain
        */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.jpeg')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => router.push('/NotificationScreen' as any)}
        >
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: colors.text }]}>
            Hai, {profileData.name.split(' ')[0]}!
          </Text>
          <Text style={[styles.greetingSubtext, { color: colors.textSecondary }]}>
            Siap menguasai keahlian baru hari ini? Biarkan AI memandu perjalanan belajarmu.
          </Text>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari mata kuliah atau tutor..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Cari</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tutor Rekomendasi AI */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tutor Rekomendasi AI</Text>
              <Text style={styles.sectionSubtitle}>Dipilih berdasarkan riwayat belajarmu</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/TutorListScreen' as any)}>
              <Text style={styles.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
            {filteredTutors.map((tutor) => (
              <View key={tutor.id} style={[styles.tutorCard, { backgroundColor: colors.card }]}>
                <View style={styles.tutorCardHeader}>
                  <View style={styles.tutorAvatarContainer}>
                    <Ionicons name="person" size={24} color="#FFF" />
                    {tutor.available && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.matchBadge}>
                    <Ionicons name="sparkles" size={12} color="#7C3AED" />
                    <Text style={styles.matchText}>COCOK {tutor.match}</Text>
                  </View>
                </View>
                <Text style={[styles.tutorName, { color: colors.text }]}>{tutor.name}</Text>
                <Text style={styles.tutorSubjects}>{tutor.subjects}</Text>
                <View style={styles.tutorCardFooter}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#E11D48" />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{tutor.rating}</Text>
                    <Text style={styles.reviewsText}>({tutor.reviews} ulasan)</Text>
                  </View>
                  <Text style={styles.rateText}>{tutor.rate}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Mata Kuliah Populer */}
        <View style={styles.sectionContainer}>
          <View style={styles.popularSubjectsBox}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mata Kuliah Populer</Text>
            <View style={styles.subjectsGrid}>
              {POPULAR_SUBJECTS.map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  style={[styles.subjectCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push({ pathname: '/SubjectDetailScreen', params: { id: sub.id } } as any)}
                >
                  <View style={[styles.subjectIconWrap, { backgroundColor: sub.color }]}>
                    <Ionicons name={sub.icon as any} size={24} color={sub.iconColor} />
                  </View>
                  <Text style={[styles.subjectName, { color: colors.text }]}>{sub.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Sesi Mendatang */}
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sesi Mendatang</Text>
            <View style={styles.badgeLightPurple}>
              <Text style={styles.badgeLightPurpleText}>2 HARI INI</Text>
            </View>
          </View>
          {UPCOMING_SESSIONS.map((session) => (
            <View key={session.id} style={[styles.sessionCard, { borderLeftColor: session.borderColor, backgroundColor: colors.card }]}>
              <View style={styles.sessionDateCircle}>
                <Text style={[styles.sessionDateText, { color: colors.text }]}>{session.dateText}</Text>
              </View>
              <View style={styles.sessionDetails}>
                <Text style={[styles.sessionTitle, { color: colors.text }]}>{session.title}</Text>
                <Text style={styles.sessionTimeInfo}>{session.time} • {session.tutor}</Text>
              </View>
              <TouchableOpacity style={styles.sessionGoBtn}>
                <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.emptySessionBox}>
            <Text style={styles.emptySessionText}>Tidak ada sesi lain yang dijadwalkan</Text>
          </View>
        </View>

        {/* Learning Pulse */}
        <View style={styles.pulseCard}>
          <View style={styles.pulseHeader}>
            <Text style={styles.pulseTitle}>Denyut Belajar</Text>
            <Ionicons name="analytics" size={24} color="#FFF" style={{ opacity: 0.6 }} />
          </View>
          <Text style={styles.pulseDesc}>Kamu telah menyelesaikan 85% target mingguanmu!</Text>
          <View style={styles.progressBarRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '85%' }]} />
            </View>
            <Text style={styles.progressText}>12/14</Text>
          </View>
          <Text style={styles.pulseNextTarget}>
            Pencapaian Berikutnya: Selesaikan Modul Python Loops untuk mendapatkan lencana 'Code Ninja'.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingTop: STATUSBAR_HEIGHT, // Android status bar
  },

  // ── HEADER ──────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  // logoContainer membungkus Image agar ukurannya pas konten
  logoContainer: {
    alignItems: 'flex-start', // paksa konten ke kiri
    justifyContent: 'center',
  },
  logoImage: {
    width: 44,   // pas ukuran logo circle
    height: 44,
    borderRadius: 8,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── SCROLL ──────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: 110,
  },

  // ── GREETING ────────────────────────────────────────────────────
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  greetingSubtext: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    paddingLeft: 16,
    paddingVertical: 6,
    paddingRight: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    height: 40,
  },
  searchButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  // ── SECTION ─────────────────────────────────────────────────────
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  linkText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── TUTOR CARDS ─────────────────────────────────────────────────
  horizontalScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tutorCard: {
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tutorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tutorAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  matchText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '800',
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  tutorSubjects: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  tutorCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  rateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },

  // ── POPULAR SUBJECTS ────────────────────────────────────────────
  popularSubjectsBox: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginHorizontal: 16,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  subjectCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  subjectIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── SESSIONS ────────────────────────────────────────────────────
  badgeLightPurple: {
    backgroundColor: '#EBE2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeLightPurpleText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '700',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 24,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sessionDateCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionDateText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 14,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  sessionTimeInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionGoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBE2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySessionBox: {
    marginTop: 8,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptySessionText: {
    color: '#9CA3AF',
    fontSize: 13,
  },

  // ── PULSE CARD ──────────────────────────────────────────────────
  pulseCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#7C3AED',
    borderRadius: 32,
    padding: 24,
  },
  pulseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pulseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pulseDesc: {
    fontSize: 14,
    color: '#EBE2FF',
    marginBottom: 20,
    lineHeight: 20,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginRight: 12,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  progressText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pulseNextTarget: {
    fontSize: 12,
    color: '#D8B4FE',
    lineHeight: 18,
  },
});