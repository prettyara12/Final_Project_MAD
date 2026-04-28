import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getTutorRecommendation } from '../../services/gemini';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors, isDark } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  const tutors = useQuery(api.tutors.getTutors);
  const popularSubjects = useQuery(api.subjects.getPopularSubjects);
  
  // Hanya jalankan query sessions jika currentUser ditemukan dan memiliki role
  const sessions = useQuery(api.sessions.getSessionsByUser, 
    (currentUser && currentUser.role) ? { userId: currentUser._id, role: currentUser.role as "tutor" | "learner" } : "skip"
  );
  
  const notifications = useQuery(api.notifications.getNotifications, currentUser?._id ? { userId: currentUser._id } : "skip");
  const unreadCount = notifications ? notifications.filter((n: any) => !n.read).length : 0;

  // AI Recommendation Integration
  const recommendedTutors = useQuery(api.tutors.getRecommendedTutors, {
    subject: searchQuery || "Matematika", // Use search or default
    preferredTime: "08:00", // Default preferred time
    learningStyle: "Visual", // Default learning style
  });

  const recommendedGroups = useQuery(api.groups.getRecommendedGroups);

  const [aiInsights, setAiInsights] = useState<any[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (recommendedTutors && recommendedTutors.length > 0 && !isAiLoading) {
      const fetchAI = async () => {
        setIsAiLoading(true);
        try {
          const recommendations = await getTutorRecommendation({
            subject: searchQuery || "Matematika",
            preferredTime: "08:00",
            learningStyle: "Visual"
          }, recommendedTutors);
          if (recommendations) setAiInsights(recommendations);
        } catch (e) {
          console.error("AI Insight Error:", e);
        } finally {
          setIsAiLoading(false);
        }
      };
      fetchAI();
    }
  }, [recommendedTutors, searchQuery]);

  const getInsightForTutor = (tutorId: string) => {
    return aiInsights?.find(insight => insight.tutorId === tutorId);
  };

  const filteredTutors = tutors?.filter(tutor => {
    const nameStr = tutor.user?.name || tutor.name || '';
    const nameMatch = nameStr.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = (tutor.subjects && Array.isArray(tutor.subjects)) 
      ? tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) 
      : false;
    return nameMatch || subjectMatch;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Top Fixed Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.headerLeft}
          onPress={() => router.push('/ProfileScreen' as any)}
        >
          <View style={[styles.avatarMini, { backgroundColor: colors.avatarBg, overflow: 'hidden' }]}>
            {profileData?.profileImage ? (
              <Image source={{ uri: profileData.profileImage }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Ionicons name="person" size={16} color="#FFF" />
            )}
          </View>
          <Text style={[styles.headerLogoText, { color: colors.primary }]}>EduPartner AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.notificationBtn, { position: 'relative' }]} onPress={() => router.push('/NotificationScreen' as any)}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
               <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: colors.text }]}>Hai, {(profileData?.name || 'Siswa').split(' ')[0]}!</Text>
          <Text style={[styles.greetingSubtext, { color: colors.textSecondary }]}>
            Siap menguasai keahlian baru hari ini? Biarkan AI memandu perjalanan belajarmu.
          </Text>
          
          {/* Search Bar */}
          <View style={[styles.searchBarContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput 
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Cari mata kuliah atau tutor..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.searchButtonText}>Cari</Text>
            </TouchableOpacity>
          </View>

          {/* AI Search Entry Point */}
          <TouchableOpacity 
            style={[styles.aiSearchBtn, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
            onPress={() => router.push('/AIPreferenceScreen' as any)}
          >
            <View style={styles.aiSearchBtnLeft}>
              <View style={[styles.aiSearchIconBox, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={[styles.aiSearchBtnTitle, { color: colors.text }]}>Find Tutor with AI</Text>
                <Text style={[styles.aiSearchBtnSub, { color: colors.textSecondary }]}>Personalisasi pencarianmu sekarang</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* AI Study Planner Entry Point */}
          <TouchableOpacity 
            style={[styles.aiSearchBtn, { backgroundColor: colors.surfaceHover, borderColor: colors.border, marginTop: 12 }]}
            onPress={() => router.push('/StudyPlannerScreen' as any)}
          >
            <View style={styles.aiSearchBtnLeft}>
              <View style={[styles.aiSearchIconBox, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="calendar" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={[styles.aiSearchBtnTitle, { color: colors.text }]}>AI Study Planner</Text>
                <Text style={[styles.aiSearchBtnSub, { color: colors.textSecondary }]}>Buat jadwal belajar otomatis</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* AI Recommended Tutors */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tutor Rekomendasi AI</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Dipilih berdasarkan riwayat belajarmu</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/TutorListScreen' as any)}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {recommendedTutors === undefined ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {Array.isArray(recommendedTutors) && recommendedTutors.length > 0 ? (
                recommendedTutors.map((tutor, index) => (
                  <TouchableOpacity 
                    key={tutor?._id} 
                    style={[
                      styles.tutorCard, 
                      { backgroundColor: colors.surface, borderBottomColor: colors.border },
                      index < 3 && { borderColor: colors.primary, borderWidth: 1 } // Highlight top 3
                    ]}
                    onPress={() => tutor?._id && router.push({ pathname: '/TutorProfileScreen', params: { id: tutor._id } } as any)}
                  >
                    <View style={styles.tutorCardHeader}>
                      <View style={[styles.tutorAvatarContainer, { backgroundColor: colors.avatarBg }]}>
                        {tutor?.user?.profileImage ? (
                          <Image source={{ uri: tutor?.user?.profileImage }} style={styles.tutorAvatarImage} />
                        ) : (
                          <Ionicons name="person" size={24} color="#FFF" />
                        )}
                        <View style={[styles.onlineDot, { borderColor: colors.surface }]} />
                      </View>
                      <View style={[styles.matchBadge, index < 3 ? { backgroundColor: colors.primary } : { backgroundColor: colors.primaryLight }]}>
                        <Ionicons name="sparkles" size={12} color={index < 3 ? "#FFF" : colors.primary} />
                        <Text style={[styles.matchText, { color: index < 3 ? "#FFF" : colors.primary }]}>
                          {index === 0 ? "AI TOP PICK" : `MATCH ${Math.max(15, Math.min(99, Number(tutor?.score) || 0))}%`}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.tutorName, { color: colors.text }]}>{tutor?.user?.name || tutor?.name || 'Tutor'}</Text>
                    <Text style={[styles.tutorSubjects, { color: colors.textSecondary }]} numberOfLines={1}>
                      {tutor?.subjects && Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor?.specialization || 'Umum')}
                    </Text>

                    {/* AI Explanation */}
                    <View style={[styles.aiExplanationBox, { backgroundColor: colors.surfaceHover }]}>
                      <Ionicons name="bulb-outline" size={14} color={colors.primary} />
                      <Text style={[styles.aiExplanationText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {tutor?._id ? (getInsightForTutor(tutor._id)?.explanation || "AI sedang menganalisis kecocokan terbaik untukmu...") : "Memuat analisis..."}
                      </Text>
                    </View>

                    <View style={[styles.tutorCardFooter, { borderTopColor: colors.border }]}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={[styles.ratingText, { color: colors.text }]}>{Number(tutor?.rating || 5).toFixed(1)}</Text>
                        <Text style={[styles.reviewsText, { color: colors.textMuted }]}>{`(${(tutor as any)?.experience || '8'}th Exp)`}</Text>
                      </View>
                      <TouchableOpacity 
                        style={[styles.bookBtnSmall, { backgroundColor: colors.primary }]}
                        onPress={() => tutor?.user?._id && router.push({ pathname: '/BookingScreen', params: { tutorId: tutor.user._id } } as any)}
                      >
                        <Text style={styles.bookBtnTextSmall}>Pesan</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Tidak ada rekomendasi saat ini.</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>



        {/* Recommended Groups */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Grup Belajar</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Belajar bersama teman lebih menyenangkan</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Segera Hadir", "Fitur eksplorasi grup akan segera hadir!")}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {recommendedGroups === undefined ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (recommendedGroups || []).map((group: any) => (
              <TouchableOpacity 
                key={group._id} 
                style={[styles.groupCardHome, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
              >
                <View style={[styles.groupIconBoxHome, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="people" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.groupTitleHome, { color: colors.text }]} numberOfLines={1}>{group.title}</Text>
                <Text style={[styles.groupMetaHome, { color: colors.textSecondary }]}>{group.participants} Peserta • {group.tutorName}</Text>
                
                <View style={styles.groupAvatarsHome}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <View key={i} style={[styles.miniAvatarHome, { left: i * 15, zIndex: 10 - i, backgroundColor: colors.avatarBg, borderColor: colors.surface }]}>
                      <Ionicons name="person" size={10} color="#FFF" />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sesi Mendatang</Text>
            <View style={[styles.badgeLightPurple, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.badgeLightPurpleText, { color: colors.primary }]}>{sessions?.length || 0} TOTAL</Text>
            </View>
          </View>

          {sessions && sessions.length > 0 ? (
            sessions.slice(0, 2).map((session) => (
              <View key={session._id} style={[styles.sessionCard, { borderLeftColor: colors.primary, backgroundColor: colors.surface }]}>
                <View style={[styles.sessionDateCircle, { backgroundColor: colors.background }]}>
                  <Text style={[styles.sessionDateText, { color: colors.text }]}>{session.date.split(' ')[0]}</Text>
                </View>
                
                <View style={styles.sessionDetails}>
                  <Text style={[styles.sessionTitle, { color: colors.text }]}>{session.subject}</Text>
                  <Text style={[styles.sessionTimeInfo, { color: colors.textSecondary }]}>{session.time} • {session.tutor?.name}</Text>
                </View>

                <TouchableOpacity style={[styles.sessionGoBtn, { backgroundColor: colors.primaryLight }]} onPress={() => router.push('/chat/ChatListScreen' as any)}>
                  <Ionicons name="chatbubbles" size={16} color={colors.primary} />
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
      </ScrollView>

      {/* AI Scanner Bubble Button */}
      <TouchableOpacity 
        style={[styles.scannerBubble, { backgroundColor: '#3B82F6' }]}
        onPress={() => router.push('/ScannerScreen' as any)}
        activeOpacity={0.9}
      >
        <Ionicons name="scan" size={24} color="#FFF" />
      </TouchableOpacity>
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
  bookBtnSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookBtnTextSmall: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tutorAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  aiExplanationBox: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    alignItems: 'center',
  },
  aiExplanationText: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
    flex: 1,
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
  notificationBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notifBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
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
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  aiSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 24,
    marginTop: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  aiSearchBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiSearchIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSearchBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  aiSearchBtnSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  groupCardHome: {
    width: width * 0.6,
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  groupIconBoxHome: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupTitleHome: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  groupMetaHome: {
    fontSize: 11,
    marginBottom: 12,
  },
  groupAvatarsHome: {
    flexDirection: 'row',
    height: 24,
  },
  miniAvatarHome: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBubble: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
});
