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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors, isDark } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const tutors = useQuery(api.tutors.getTutors);
  const popularSubjects = useQuery(api.subjects.getPopularSubjects);
  
  // Hanya jalankan query sessions jika currentUser ditemukan
  const sessions = useQuery(api.sessions.getSessionsByUser, 
    currentUser ? { userId: currentUser._id, role: currentUser.role } : "skip"
  );

  const filteredTutors = tutors?.filter(tutor => 
    tutor.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Top Fixed Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarMini, { backgroundColor: colors.avatarBg }]}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
          <Text style={[styles.headerLogoText, { color: colors.primary }]}>EduPartner AI</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/NotificationScreen' as any)}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: colors.text }]}>Hai, {profileData.name.split(' ')[0]}!</Text>
          <Text style={styles.greetingSubtext}>
            Siap menguasai keahlian baru hari ini? Biarkan AI memandu perjalanan belajarmu.
          </Text>
          
          {/* Search Bar */}
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

        {/* AI Recommended Tutors */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tutor Rekomendasi AI</Text>
              <Text style={styles.sectionSubtitle}>Dipilih berdasarkan riwayat belajarmu</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/TutorListScreen' as any)}>
              <Text style={styles.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {tutors === undefined ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {(filteredTutors && filteredTutors.length > 0) ? (
                filteredTutors.map((tutor) => (
                  <TouchableOpacity 
                    key={tutor._id} 
                    style={styles.tutorCard}
                    onPress={() => router.push({ pathname: '/TutorProfileScreen', params: { id: tutor._id } } as any)}
                  >
                    <View style={styles.tutorCardHeader}>
                      <View style={styles.tutorAvatarContainer}>
                        <Ionicons name="person" size={24} color="#FFF" />
                        <View style={styles.onlineDot} />
                      </View>
                      <View style={styles.matchBadge}>
                        <Ionicons name="sparkles" size={12} color="#7C3AED" />
                        <Text style={styles.matchText}>COCOK 98%</Text>
                      </View>
                    </View>

                    <Text style={styles.tutorName}>{tutor.user?.name || tutor.name}</Text>
                    <Text style={styles.tutorSubjects}>
                      {tutor.subjects ? tutor.subjects.join(' & ') : tutor.specialization}
                    </Text>                    
                    <View style={styles.tutorCardFooter}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#E11D48" />
                        <Text style={styles.ratingText}>{tutor.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewsText}>(48 ulasan)</Text>
                      </View>
                      <Text style={styles.rateText}>$45/jam</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptySessionText}>Belum ada tutor tersedia.</Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* Popular Subjects */}
        <View style={styles.sectionContainer}>
          <View style={styles.popularSubjectsBox}>
            <Text style={styles.sectionTitle}>Mata Kuliah Populer</Text>
            
            {popularSubjects === undefined ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <View style={styles.subjectsGrid}>
                {popularSubjects.map((sub) => (
                  <TouchableOpacity 
                    key={sub._id} 
                    style={styles.subjectCard}
                    onPress={() => router.push({ pathname: '/SubjectDetailScreen', params: { id: sub._id } } as any)}
                  >
                    <View style={[styles.subjectIconWrap, { backgroundColor: '#EBE2FF' }]}>
                      <Ionicons name="book-outline" size={24} color="#7C3AED" />
                    </View>
                    <Text style={styles.subjectName}>{sub.name || sub.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>Sesi Mendatang</Text>
            <View style={styles.badgeLightPurple}>
              <Text style={styles.badgeLightPurpleText}>{sessions?.length || 0} TOTAL</Text>
            </View>
          </View>

          {/* Jika currentUser null (belum login/terdaftar), sessions akan 'skip' dan bernilai undefined. 
              Kita tampilkan state kosong daripada spinner terus-menerus. */}
          {sessions && sessions.length > 0 ? (
            sessions.slice(0, 2).map((session) => (
              <View key={session._id} style={[styles.sessionCard, { borderLeftColor: '#4F46E5' }]}>
                <View style={styles.sessionDateCircle}>
                  <Text style={styles.sessionDateText}>{session.date.split(' ')[0]}</Text>
                </View>
                
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionTitle}>{session.subject}</Text>
                  <Text style={styles.sessionTimeInfo}>{session.time} • {session.tutor?.name}</Text>
                </View>

                <TouchableOpacity style={styles.sessionGoBtn} onPress={() => router.push('/ProgressScreen' as any)}>
                  <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptySessionBox}>
              <Text style={styles.emptySessionText}>
                {currentUser === null ? "Daftarkan akun untuk melihat sesi." : "Tidak ada sesi lain yang dijadwalkan"}
              </Text>
            </View>
          )}
        </View>

        {/* Learning Pulse Card */}
        <View style={styles.pulseCard}>
          <View style={styles.pulseHeader}>
             <Text style={styles.pulseTitle}>Denyut Belajar</Text>
             <Ionicons name="analytics" size={24} color="#FFF" style={{opacity: 0.6}}/>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: '800',
  },
  notificationBtn: {
    padding: 2,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  linkText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  horizontalScrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  tutorCard: {
    backgroundColor: '#FFFFFF',
    width: width * 0.7,
    borderRadius: 28,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tutorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tutorAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  matchText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  tutorName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  tutorSubjects: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  tutorCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  reviewsText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  rateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  popularSubjectsBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  badgeLightPurple: {
    backgroundColor: '#EBE2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeLightPurpleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  sessionDateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionDateText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  sessionTimeInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionGoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySessionBox: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  emptySessionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  pulseCard: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 40,
  },
  pulseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pulseTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pulseDesc: {
    fontSize: 14,
    color: '#E0E7FF',
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
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
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
