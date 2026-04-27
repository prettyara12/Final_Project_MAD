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
import { useTheme } from '../../context/ThemeContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';

const { width } = Dimensions.get('window');

export default function SubjectScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profileData } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  
  const sessions = useQuery(api.sessions.getSessionsByUser, 
    (currentUser && currentUser.role) ? { userId: currentUser._id, role: currentUser.role as "tutor" | "learner" } : "skip"
  );

  const filteredSessions = sessions?.filter(session => 
    session.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (session.tutor?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (session.learner?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.avatarMini, { backgroundColor: colors.avatarBg }]}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
          <Text style={[styles.headerLogoText, { color: colors.primary }]}>EduPartner AI</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => router.push('/NotificationScreen' as any)}
        >
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
           <Text style={[styles.mainTitle, { color: colors.text }]}>Manajemen Sesi</Text>
           <Text style={[styles.mainDesc, { color: colors.textSecondary }]}>Kelola semua jadwal belajarmu di satu tempat.</Text>
           
           <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
             <Ionicons name="search" size={20} color={colors.textSecondary} />
             <TextInput 
               style={[styles.searchInput, { color: colors.text }]}
               placeholder="Cari sesi atau nama partner..."
               placeholderTextColor={colors.textSecondary}
               value={searchQuery}
               onChangeText={setSearchQuery}
             />
           </View>
        </View>

        {/* Sessions List */}
        <View style={styles.cardsSection}>
          {filteredSessions === undefined ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : filteredSessions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>Belum ada sesi yang ditemukan.</Text>
          ) : (
            filteredSessions.map((session, idx) => {
              const isTutor = currentUser?.role === 'tutor';
              const partnerName = isTutor ? session.learner?.name : session.tutor?.name;
              
              let statusColor = colors.primary;
              if (session.status === 'completed') statusColor = '#10B981';
              if (session.status === 'cancelled') statusColor = '#EF4444';
              if (session.status === 'pending') statusColor = '#F59E0B';

              return (
                <View key={session._id} style={[styles.subjectCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                   <View style={styles.subHeaderRow}>
                     <View style={[styles.subIconBox, { backgroundColor: statusColor + '15' }]}>
                        <Ionicons name="calendar-outline" size={20} color={statusColor} />
                     </View>
                     <View style={[styles.badgeBox, { backgroundColor: statusColor + '20' }]}>
                       <Text style={[styles.badgeText, { color: statusColor }]}>{session.status.toUpperCase()}</Text>
                     </View>
                   </View>

                   <Text style={[styles.subTitle, { color: colors.text }]}>{session.subject}</Text>
                   <Text style={[styles.subDesc, { color: colors.textSecondary }]}>
                     {session.date} | {session.time} • {isTutor ? 'Siswa' : 'Tutor'}: {partnerName || 'Menunggu Info'}
                   </Text>

                   <View style={styles.actionsRow}>
                     <TouchableOpacity 
                       style={[styles.mainActionBtn, { backgroundColor: statusColor }]}
                       onPress={() => router.push('/chat/ChatListScreen' as any)}
                     >
                       <Text style={styles.mainActionText}>Lihat Obrolan</Text>
                     </TouchableOpacity>
                   </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Manual BottomTabBar removed */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  notificationBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 160, // accommodate fab and tab bar space
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 38,
    marginBottom: 8,
  },
  mainDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // light grey like input
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeBox: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#9333EA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  mainActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  moreActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  catIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catFileBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catFileText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  catTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  catDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  uploadBlock: {
    backgroundColor: '#4F46E5', // blue/purple main
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  uploadDesc: {
    fontSize: 13,
    color: '#E0E7FF', // lighter blue text
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadBoxDashed: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadBoxTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  uploadBoxSub: {
    color: '#A5B4FC', // faint blue purple
    fontSize: 10,
  },
  uploadProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 16,
  },
  uploadFileName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  uploadProbBarLine: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    width: '100%',
  },
  uploadProbBarFill: {
    width: '86%',
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  uploadFilePercent: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 12,
  },
  lastSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 12,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noteIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  noteTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 20, // Adjusted for persistent tab bar (inside layout)
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5', // prime blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
