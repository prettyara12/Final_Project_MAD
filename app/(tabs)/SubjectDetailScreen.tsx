import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
// import { BottomTabBar } from '../../components/BottomTabBar'; <--- Removed

// Full subject data with details
const getSubjectData = (t: any) => ({
  '1': {
    name: t('subject_matematika'),
    icon: 'calculator-outline',
    color: '#EBE2FF',
    iconColor: '#7C3AED',
    description: t('math_desc'),
    topics: [t('topic_linear_algebra'), t('topic_calculus'), t('topic_statistics'), t('topic_geometry'), t('topic_differential')],
    tutorCount: 24,
    avgRating: 4.8,
    difficulty: t('opt_intermediate'),
  },
  '2': {
    name: t('subject_pemrograman'),
    icon: 'code-slash-outline',
    color: '#FCE7F3',
    iconColor: '#DB2777',
    description: t('coding_desc'),
    topics: [t('topic_python'), t('topic_javascript'), t('topic_data_structures'), t('topic_mobile_dev'), t('topic_machine_learning')],
    tutorCount: 31,
    avgRating: 4.9,
    difficulty: t('opt_beginner'),
  },
  '3': {
    name: t('subject_bahasa_inggris'),
    icon: 'globe-outline',
    color: '#FCE7F3',
    iconColor: '#E11D48',
    description: t('language_desc_short'),
    topics: [t('topic_academic_english'), t('topic_toefl'), t('topic_spanish'), t('topic_mandarin'), t('topic_korean')],
    tutorCount: 18,
    avgRating: 4.7,
    difficulty: t('opt_beginner'),
  },
  '4': {
    name: t('subject_biologi'),
    icon: 'flask-outline',
    color: '#EBE2FF',
    iconColor: '#4F46E5',
    description: t('biology_desc'),
    topics: [t('topic_cell_biology'), t('topic_genetics'), t('topic_anatomy'), t('topic_ecology'), t('topic_biotechnology')],
    tutorCount: 15,
    avgRating: 4.6,
    difficulty: t('opt_intermediate'),
  },
  '5': {
    name: t('subject_desain_grafis'),
    icon: 'color-palette-outline',
    color: '#F3E8FF',
    iconColor: '#9333EA',
    description: t('design_desc'),
    topics: [t('topic_ui_ux'), t('topic_visual_principles'), t('topic_figma'), t('topic_typography'), t('topic_graphic_design')],
    tutorCount: 12,
    avgRating: 4.8,
    difficulty: t('opt_beginner'),
  },
  '6': {
    name: t('subject_sejarah'),
    icon: 'time-outline',
    color: '#FEE2E2',
    iconColor: '#E11D48',
    description: t('history_desc'),
    topics: [t('topic_indo_history'), t('topic_ancient_civ'), t('topic_modern_europe'), t('topic_world_war'), t('topic_contemporary_asia')],
    tutorCount: 9,
    avgRating: 4.5,
    difficulty: t('opt_beginner'),
  },
});

// Tutors mapped per subject
const SUBJECT_TUTORS: Record<string, { id: string; name: string; specialty: string; rating: number; reviews: number; available: boolean }[]> = {
  '1': [
    { id: '1', name: 'Dr. Sarah Jenkins', specialty: 'Kalkulus Lanjut & Fisika', rating: 4.9, reviews: 124, available: true },
    { id: '2', name: 'Prof. Budi Hartono', specialty: 'Aljabar Linear & Statistika', rating: 4.8, reviews: 98, available: true },
  ],
  '2': [
    { id: '3', name: 'James Wilson', specialty: 'Python & Data Science', rating: 4.9, reviews: 89, available: true },
    { id: '4', name: 'Rina Sari', specialty: 'JavaScript & React Native', rating: 4.7, reviews: 156, available: true },
    { id: '5', name: 'Kevin Pratama', specialty: 'Machine Learning & AI', rating: 4.8, reviews: 72, available: false },
  ],
  '3': [
    { id: '6', name: 'Prof. Ananda', specialty: 'Sastra & Bahasa Spanyol', rating: 4.7, reviews: 64, available: true },
    { id: '7', name: 'Emily Chen', specialty: 'Bahasa Mandarin & Jepang', rating: 4.9, reviews: 201, available: true },
  ],
  '4': [
    { id: '8', name: 'Dr. Mega Putri', specialty: 'Biologi Molekuler & Genetika', rating: 4.8, reviews: 87, available: true },
    { id: '9', name: 'Arif Nugroho, M.Sc.', specialty: 'Ekologi & Bioteknologi', rating: 4.6, reviews: 53, available: false },
  ],
  '5': [
    { id: '10', name: 'Maria Garcia', specialty: 'UI/UX Design & Figma', rating: 4.8, reviews: 210, available: false },
    { id: '11', name: 'Dian Lestari', specialty: 'Desain Grafis & Adobe Suite', rating: 4.7, reviews: 133, available: true },
  ],
  '6': [
    { id: '12', name: 'Dr. Andi Wijaya', specialty: 'Sejarah Indonesia & Asia', rating: 4.6, reviews: 45, available: true },
    { id: '13', name: 'Lisa Purnama, M.Hum.', specialty: 'Sejarah Eropa & Perang Dunia', rating: 4.5, reviews: 38, available: true },
  ],
};

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { t, language } = useLanguage();
  
  const SUBJECT_DATA = getSubjectData(t) as any;
  const subject = SUBJECT_DATA[id || '1'];
  const tutors = SUBJECT_TUTORS[id || '1'] || [];
  
  if (!subject) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Text style={{ padding: 40, textAlign: 'center', color: colors.text }}>{t('subject_not_found')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>

      {/* Header - Fixed outside ScrollView */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('subject_detail')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.heroIconWrap, { backgroundColor: subject.color }]}>
            <Ionicons name={subject.icon as any} size={48} color={subject.iconColor} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{subject.name}</Text>
          <View style={[styles.difficultyPill, { backgroundColor: colors.primaryLight }]}>
             <Ionicons name="school-outline" size={12} color={colors.primary} />
             <Text style={[styles.difficultyText, { color: colors.primary }]}>{subject.difficulty}</Text>
          </View>
          <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>{subject.description}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="people" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{subject.tutorCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('available_tutors')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{subject.avgRating}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('avg_rating')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="book" size={20} color="#9333EA" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{subject.topics.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('tab_sessions')}</Text>
          </View>
        </View>

        {/* Topics List */}
        <View style={[styles.sectionBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('topics_learned')}</Text>
          {subject.topics.map((topic: string, idx: number) => (
            <View key={idx} style={[styles.topicRow, { borderBottomColor: colors.border }, idx === subject.topics.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.topicBullet, { backgroundColor: subject.iconColor }]} />
              <Text style={[styles.topicText, { color: colors.text }]}>{topic}</Text>
            </View>
          ))}
        </View>

        {/* Tutor List */}
        <View style={[styles.sectionBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.tutorSectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('available_tutors')}</Text>
            <View style={[styles.tutorCountPill, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.tutorCountText, { color: colors.primary }]}>{t('tutor_count', { count: tutors.length })}</Text>
            </View>
          </View>
          {tutors.map((tutor, idx) => (
            <TouchableOpacity 
              key={tutor.id} 
              style={[styles.tutorRow, { borderBottomColor: colors.border }, idx === tutors.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => router.push('/TutorProfileScreen' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.tutorAvatar, { backgroundColor: colors.avatarBg }]}>
                <Ionicons name="person" size={18} color="#FFF" />
                {tutor.available && <View style={styles.tutorOnlineDot} />}
              </View>
              <View style={styles.tutorInfo}>
                <Text style={[styles.tutorName, { color: colors.text }]}>{tutor.name}</Text>
                <Text style={[styles.tutorSpecialty, { color: colors.textSecondary }]}>{tutor.specialty}</Text>
                <View style={styles.tutorMetaRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.tutorRating, { color: colors.text }]}>{tutor.rating}</Text>
                  <Text style={[styles.tutorReviews, { color: colors.textSecondary }]}>{t('reviews_count', { count: tutor.reviews })}</Text>
                </View>
              </View>
              <View style={styles.tutorStatusCol}>
                <Text style={[styles.tutorStatus, !tutor.available && styles.tutorStatusBusy]}>
                  {tutor.available ? t('status_available') : t('status_full')}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.border} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/TutorListScreen' as any)}
          >
            <Ionicons name="search" size={18} color="#FFF" />
            <Text style={styles.primaryBtnText}>{t('find_tutor_name', { name: subject.name })}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryBtn, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
            onPress={() => router.push('/SubjectScreen' as any)}
          >
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>{t('start_self_study')}</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    backgroundColor: '#FAFAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  heroIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  difficultyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  heroDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topicBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 14,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    gap: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    gap: 10,
  },
  secondaryBtnText: {
    color: '#4F46E5',
    fontSize: 15,
    fontWeight: '700',
  },
  tutorSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tutorCountPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tutorCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  tutorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tutorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
  },
  tutorOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  tutorSpecialty: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  tutorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tutorRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  tutorReviews: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  tutorStatusCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  tutorStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  tutorStatusBusy: {
    color: '#EF4444',
  },
});
