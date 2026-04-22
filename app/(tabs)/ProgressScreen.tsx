import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
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

const BADGES = [
  { id: '1', title: 'Bangun Pagi', desc: '4 sesi sebelum jam 8 Pagi', bg: '#FDE047', icon: 'flash', iconColor: '#A16207', earned: true },
  { id: '2', title: 'Pemikir Dalam', desc: 'Sesi fokus 2 jam+', bg: '#93C5FD', icon: 'medal', iconColor: '#1E3A8A', earned: true },
  { id: '3', title: 'Penguasa Api', desc: '7 hari beruntun', bg: '#F3F4F6', icon: 'flame', iconColor: '#D1D5DB', earned: false },
  { id: '4', title: 'Mentor', desc: 'Bantu 10 teman', bg: '#F3F4F6', icon: 'people', iconColor: '#D1D5DB', earned: false },
];

const CHART_DATA = [
  { day: 'SEN', height: 40 },
  { day: 'SEL', height: 60 },
  { day: 'RAB', height: 50 },
  { day: 'KAM', height: 100, active: true },
  { day: 'JUM', height: 75 },
  { day: 'SAB', height: 45 },
  { day: 'MIN', height: 20 },
];

export default function ProgressScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profileData } = useProfile();

  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const sessions = useQuery(api.sessions.getSessionsByUser, 
    currentUser ? { userId: currentUser._id, role: currentUser.role } : "skip"
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Header */}
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
        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/NotificationScreen' as any)}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Intro */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>Perjalanan Belajarku</Text>
          <Text style={[styles.mainDesc, { color: colors.textSecondary }]}>
            Kamu berada di 5% pelajar teratas minggu ini. Pertahankan momentumnya!
          </Text>
        </View>

        {/* Collaborative Mode Banner */}
        <View style={styles.collabBanner}>
           <View style={styles.avatarsOverlapBox}>
              <View style={[styles.overlapAvatar, { zIndex: 3, backgroundColor: '#0F172A' }]}><Ionicons name="person" size={12} color="#FFF" /></View>
              <View style={[styles.overlapAvatar, { zIndex: 2, backgroundColor: '#065F46', left: -10 }]}><Ionicons name="person" size={12} color="#FFF" /></View>
              <View style={[styles.overlapTextLabel, { zIndex: 1, left: -20 }]}>
                 <Text style={styles.overlapText}>+12</Text>
              </View>
           </View>
           <View style={styles.collabTextContent}>
              <Text style={styles.collabTitle}>Mode Kolaboratif</Text>
              <Text style={styles.collabSub}>Aktif dengan teman sebaya</Text>
           </View>
        </View>

        {/* Main Mastery Card */}
        <View style={[styles.masteryCard, { backgroundColor: colors.primary }]}>
           <Text style={styles.masterySuperTitle}>DENYUT BELAJAR</Text>
           <Text style={styles.masteryTitle}>Sesi Terdaftar</Text>
           
           <View style={styles.masteryScoreRow}>
              <Text style={styles.masteryScoreValue}>{sessions?.length || 0}</Text>
              <Text style={styles.masteryTargetText}>Target: 10 Sesi</Text>
           </View>
           
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min((sessions?.length || 0) * 10, 100)}%`, backgroundColor: '#FFF' }]} />
           </View>
        </View>

        {/* Points / Gamification Card */}
        <View style={[styles.pointsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
           <View style={styles.pointsHeaderRow}>
              <View style={[styles.pointsIconBox, { backgroundColor: colors.primary }]}>
                 <Ionicons name="ribbon" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.rankBadge}>
                 <Text style={styles.rankBadgeText}>Peringkat #4</Text>
              </View>
           </View>
           <Text style={[styles.pointsValue, { color: colors.text }]}>2,450</Text>
           <Text style={[styles.pointsSubText, { color: colors.textSecondary }]}>Poin Edu Terkumpul</Text>
           
           <TouchableOpacity style={[styles.pointsActionBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.pointsActionBtnText}>Tukarkan Hadiah</Text>
           </TouchableOpacity>
        </View>

        {/* Subject Progress List */}
        <View style={styles.sectionContainer}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Status Sesi Belajar</Text>
           
           {!sessions ? (
             <ActivityIndicator size="small" color="#4F46E5" />
           ) : (
             <View style={styles.subjectListWrapper}>
                {sessions.map((session) => (
                  <View key={session._id} style={[styles.subjectRowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                     <View style={styles.subIconRow}>
                        <View style={[styles.subIconBox, { backgroundColor: '#4F46E520' }]}>
                           <Ionicons name="book" size={16} color="#4F46E5" />
                        </View>
                        <View>
                          <Text style={[styles.subTextTitle, { color: colors.text }]}>{session.subject}</Text>
                          <Text style={[styles.subTextSubtitle, { color: colors.textSecondary, fontSize: 10 }]}>Tutor: {session.tutor?.name}</Text>
                        </View>
                     </View>
                     <Text style={[styles.subTextScore, { color: session.status === 'booked' ? '#4F46E5' : '#10B981' }]}>
                       {session.status.toUpperCase()}
                     </Text>

                     <View style={[styles.subProgressBarBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.subProgressBarFill, { width: session.status === 'completed' ? '100%' : '50%', backgroundColor: session.status === 'completed' ? '#10B981' : '#4F46E5' }]} />
                     </View>
                  </View>
                ))}
                {sessions.length === 0 && (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Belum ada sesi yang dipesan.</Text>
                )}
             </View>
           )}
        </View>

        {/* Badges Grid */}
        <View style={styles.sectionContainer}>
           <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Lencana Terbaru</Text>
              <TouchableOpacity><Text style={[styles.linkText, { color: colors.primary }]}>Lihat Semua</Text></TouchableOpacity>
           </View>

           <View style={styles.badgesGrid}>
              {BADGES.map((badge) => (
                <View key={badge.id} style={[styles.badgeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                   <View style={[styles.badgeIconCircle, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon as any} size={24} color={badge.iconColor} />
                   </View>
                   <Text style={[styles.badgeTitle, { color: colors.text }, !badge.earned && styles.textMuted]}>{badge.title}</Text>
                   <Text style={[styles.badgeDesc, { color: colors.textSecondary }]} numberOfLines={2}>{badge.desc}</Text>
                </View>
              ))}
           </View>
        </View>

        {/* Activity Chart Section */}
        <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Aktivitas Belajar</Text>

           <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.chartHeaderRow}>
                 <View>
                    <Text style={[styles.chartValueStr, { color: colors.text }]}>24.5</Text>
                    <Text style={[styles.chartValueLabel, { color: colors.text }]}>Jam</Text>
                    <Text style={[styles.chartValueDesc, { color: colors.textSecondary }]}>Total waktu belajar{'\n'}minggu ini</Text>
                 </View>
                 <View style={[styles.togglePill, { backgroundColor: colors.border }]}>
                    <TouchableOpacity style={[styles.toggleActive, { backgroundColor: colors.primary }]}><Text style={styles.toggleActiveText}>Minggu</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.toggleInactive}><Text style={[styles.toggleInactiveText, { color: colors.textSecondary }]}>Bulan</Text></TouchableOpacity>
                 </View>
              </View>

              <View style={styles.chartBarsContainer}>
                 {CHART_DATA.map((item, idx) => (
                    <View key={idx} style={styles.chartBarCol}>
                       <View style={[
                          styles.chartBarFill, 
                          { 
                            height: `${item.height}%`, 
                            backgroundColor: item.active ? colors.primary : colors.border 
                          },
                          item.active && styles.chartBarFillActive
                       ]} />
                       <Text style={[styles.chartBarLabel, { color: colors.textSecondary }]}>{item.day}</Text>
                    </View>
                 ))}
              </View>
           </View>
        </View>

      </ScrollView>
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
    paddingBottom: 30,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  mainDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  collabBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  avatarsOverlapBox: {
    flexDirection: 'row',
    width: 65,
    marginRight: 10,
  },
  overlapAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
  },
  overlapTextLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
  },
  overlapText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  collabTextContent: {
    flex: 1,
  },
  collabTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 2,
  },
  collabSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  masteryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  masterySuperTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1,
    marginBottom: 12,
  },
  masteryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 16,
  },
  masteryScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  masteryScoreValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#4F46E5',
    lineHeight: 44,
  },
  masteryTargetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  progressBarFill: {
    height: 12,
    borderRadius: 6,
  },
  pointsCard: {
    backgroundColor: '#9333EA', 
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
  },
  pointsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pointsSubText: {
    fontSize: 12,
    color: '#E9D5FF', 
    marginBottom: 24,
  },
  pointsActionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pointsActionBtnText: {
    color: '#9333EA',
    fontWeight: '800',
    fontSize: 14,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  subjectListWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    gap: 16,
  },
  subjectRowCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  subIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subTextTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  subTextSubtitle: {
    fontSize: 10,
    fontWeight: '400',
  },
  subTextScore: {
    fontSize: 13,
    fontWeight: '800',
    width: 80,
    textAlign: 'right',
  },
  subProgressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  subProgressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  sectionHeaderRow: {
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
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeCard: {
    width: (width - 40 - 12) / 2, 
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  badgeIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  textMuted: {
    color: '#9CA3AF', 
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  chartValueStr: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 2,
  },
  chartValueLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  chartValueDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 4,
  },
  toggleActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  toggleInactive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toggleInactiveText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140, 
  },
  chartBarCol: {
    alignItems: 'center',
    width: 24,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: 16,
    backgroundColor: '#E0E7FF', 
    borderRadius: 8,
    marginBottom: 12,
  },
  chartBarFillActive: {
    backgroundColor: '#4F46E5', 
  },
  chartBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
