import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SUBJECT_PROGRESS = [
  { id: '1', title: 'Matematika Tingkat Lanjut', score: 92, color: '#4F46E5', icon: 'calculator' },
  { id: '2', title: 'Fisika Kuantum', score: 68, color: '#9333EA', icon: 'flask' },
  { id: '3', title: 'Filsafat Modern', score: 45, color: '#E11D48', icon: 'book' },
];

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

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.avatarMini}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
          <Text style={styles.headerLogoText}>EduPartner AI</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Intro */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Perjalanan Belajarku</Text>
          <Text style={styles.mainDesc}>
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
        <View style={styles.masteryCard}>
           <Text style={styles.masterySuperTitle}>DENYUT BELAJAR</Text>
           <Text style={styles.masteryTitle}>Penguasaan{'\n'}Keseluruhan</Text>
           
           <View style={styles.masteryScoreRow}>
              <Text style={styles.masteryScoreValue}>84<Text style={styles.masteryScorePercent}>%</Text></Text>
              <Text style={styles.masteryTargetText}>Target: 90%</Text>
           </View>
           
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '84%', backgroundColor: '#4F46E5' }]} />
           </View>
        </View>

        {/* Points / Gamification Card */}
        <View style={styles.pointsCard}>
           <View style={styles.pointsHeaderRow}>
              <View style={styles.pointsIconBox}>
                 <Ionicons name="ribbon" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.rankBadge}>
                 <Text style={styles.rankBadgeText}>Peringkat #4</Text>
              </View>
           </View>
           <Text style={styles.pointsValue}>2,450</Text>
           <Text style={styles.pointsSubText}>Poin Edu Terkumpul</Text>
           
           <TouchableOpacity style={styles.pointsActionBtn}>
              <Text style={styles.pointsActionBtnText}>Tukarkan Hadiah</Text>
           </TouchableOpacity>
        </View>

        {/* Subject Progress List */}
        <View style={styles.sectionContainer}>
           <Text style={styles.sectionTitle}>Kemahiran Mata Kuliah</Text>
           
           <View style={styles.subjectListWrapper}>
              {SUBJECT_PROGRESS.map((sub) => (
                <View key={sub.id} style={styles.subjectRowCard}>
                   <View style={styles.subIconRow}>
                      <View style={styles.subIconBox}>
                         <Ionicons name={sub.icon as any} size={16} color={sub.color} />
                      </View>
                      <Text style={styles.subTextTitle}>{sub.title}</Text>
                   </View>
                   <Text style={[styles.subTextScore, { color: sub.color }]}>{sub.score}%</Text>

                   {/* Absolute Progress line at bottom of interior row inside card visually */}
                   <View style={styles.subProgressBarBg}>
                      <View style={[styles.subProgressBarFill, { width: `${sub.score}%`, backgroundColor: sub.color }]} />
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* Badges Grid */}
        <View style={styles.sectionContainer}>
           <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Lencana Terbaru</Text>
              <TouchableOpacity><Text style={styles.linkText}>Lihat Semua</Text></TouchableOpacity>
           </View>

           <View style={styles.badgesGrid}>
              {BADGES.map((badge) => (
                <View key={badge.id} style={styles.badgeCard}>
                   <View style={[styles.badgeIconCircle, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon as any} size={24} color={badge.iconColor} />
                   </View>
                   <Text style={[styles.badgeTitle, !badge.earned && styles.textMuted]}>{badge.title}</Text>
                   <Text style={styles.badgeDesc} numberOfLines={2}>{badge.desc}</Text>
                </View>
              ))}
           </View>
        </View>

        {/* Activity Chart Section */}
        <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
           <Text style={styles.sectionTitle}>Aktivitas Belajar</Text>

           <View style={styles.chartCard}>
              <View style={styles.chartHeaderRow}>
                 <View>
                    <Text style={styles.chartValueStr}>24.5</Text>
                    <Text style={styles.chartValueLabel}>Jam</Text>
                    <Text style={styles.chartValueDesc}>Total waktu belajar{'\n'}minggu ini</Text>
                 </View>
                 <View style={styles.togglePill}>
                    <TouchableOpacity style={styles.toggleActive}><Text style={styles.toggleActiveText}>Minggu</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.toggleInactive}><Text style={styles.toggleInactiveText}>Bulan</Text></TouchableOpacity>
                 </View>
              </View>

              <View style={styles.chartBarsContainer}>
                 {CHART_DATA.map((item, idx) => (
                    <View key={idx} style={styles.chartBarCol}>
                       <View style={[
                          styles.chartBarFill, 
                          { height: `${item.height}%` },
                          item.active && styles.chartBarFillActive
                       ]} />
                       <Text style={styles.chartBarLabel}>{item.day}</Text>
                    </View>
                 ))}
              </View>
           </View>
        </View>

      </ScrollView>

      {/* Mock Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/HomeScreen' as any)}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/SubjectScreen' as any)}>
          <Ionicons name="search-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Cari</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/BookingScreen' as any)}>
          <Ionicons name="book-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Sesi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/AIChatScreen' as any)}>
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Chat AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeTabIconWrap}>
             <Ionicons name="person" size={20} color="#4F46E5" />
          </View>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 110, // account for floating bottom bar
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
  masteryScorePercent: {
    fontSize: 20,
    fontWeight: '700',
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
    backgroundColor: '#9333EA', // deep purple
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
    color: '#E9D5FF', // lighter purple text
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
  subTextScore: {
    fontSize: 13,
    fontWeight: '800',
    width: 40,
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
    width: (width - 40 - 12) / 2, // halfway minus gap
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
    color: '#9CA3AF', // lighter grey text if not earned
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
    height: 140, // fix exact height for bars
  },
  chartBarCol: {
    alignItems: 'center',
    width: 24,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: 16,
    backgroundColor: '#E0E7FF', // faint blue
    borderRadius: 8,
    marginBottom: 12,
  },
  chartBarFillActive: {
    backgroundColor: '#4F46E5', // vibrant purple
  },
  chartBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeTabIconWrap: {
    backgroundColor: '#EBE2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#4F46E5',
    fontWeight: '700',
    marginTop: 0,
  }
});
