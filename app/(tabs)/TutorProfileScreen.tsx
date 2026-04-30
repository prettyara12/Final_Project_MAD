import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width } = Dimensions.get('window');

const getDates = (t: any) => [
  { day: t('day_sen'), date: '12', active: true },
  { day: t('day_sel'), date: '13', active: false },
  { day: t('day_rab'), date: '14', active: false },
  { day: t('day_kam'), date: '15', active: false },
  { day: t('day_jum'), date: '16', active: false },
  { day: t('day_sab'), date: '17', disabled: true },
  { day: t('day_min'), date: '18', disabled: true },
];

const TIMESLOTS = [
  { time: '09:00 AM', active: false },
  { time: '10:30 AM', active: true },
  { time: '01:00 PM', active: false },
  { time: '02:30 PM', active: false },
  { time: '04:00 PM', active: false },
  { time: '05:30 PM', active: false },
];

const REVIEWS = [
  {
    id: '1',
    name: 'Alex Thompson',
    course: 'Mahasiswa Aljabar Linear',
    stars: 5,
    text: '"Dr. Jenkins membantu saya lulus ujian tengah semester! Cara dia menjelaskan transformasi matriks benar-benar masuk akal bagi saya untuk pertama kalinya."',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    course: 'Mahasiswa Kalkulus BC',
    stars: 5,
    text: '"Sangat sabar dan selalu datang siap dengan latihan soal tambahan. Sangat direkomendasikan bagi siapa pun yang kesulitan dengan integral."',
  }
];

export default function TutorProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  
  const DATES = getDates(t);

  // Convex Integration
  const { id, tutorId } = useLocalSearchParams();
  const finalId = (tutorId || id) as string;
  const tutor = useQuery(api.tutors.getTutorDetail, finalId ? { id: finalId } : "skip");

  const [selectedDate, setSelectedDate] = useState('12');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const handleBookSession = () => {
    if (!tutor || !tutor.user) {
      Alert.alert(t('incomplete_data'), t('tutor_data_incomplete_desc'));
      return;
    }
    router.push({
      pathname: '/(tabs)/BookingScreen',
      params: { 
        tutorId: String(tutor.user._id),
        tutorName: String(tutor.user.name),
        subject: (tutor.subjects && tutor.subjects.length > 0) ? String(tutor.subjects[0]) : t('subject_general')
      }
    } as any);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons 
        key={i} 
        name={i < count ? "star" : "star-outline"} 
        size={14} 
        color={colors.primary} 
        style={styles.starIcon} 
      />
    ));
  };

  if (tutor === undefined) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (tutor === null) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.border} />
        <Text style={[styles.tutorName, { color: colors.text, marginTop: 16 }]}>{t('tutor_not_found_title')}</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 }]}>
           {t('tutor_not_found_desc')}
        </Text>
        <TouchableOpacity 
          style={[styles.bookButton, { backgroundColor: colors.primary, width: 200, marginTop: 24 }]} 
          onPress={() => router.back()}
        >
          <Text style={styles.bookButtonText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Profile Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.badgeTopLeft, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.badgeTopLeftText, { color: colors.primary }]}>{t('top_tutor')}</Text>
          </View>

          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarGradientBorder, { backgroundColor: colors.primary }]}>
              <View style={[styles.avatarInner, { backgroundColor: colors.avatarBg }]}>
                {tutor.user?.profileImage ? (
                  <Image source={{ uri: tutor.user.profileImage }} style={styles.avatarImgLarge} />
                ) : (
                  <Ionicons name="person" size={40} color="#FFF" />
                )}
              </View>
            </View>
          </View>

          <Text style={[styles.tutorName, { color: colors.text }]}>{tutor.user?.name || t('role_tutor')}</Text>
          <Text style={[styles.tutorSubject, { color: colors.textSecondary }]}>
            {tutor.subjects && Array.isArray(tutor.subjects) ? tutor.subjects.map((sub: string) => t(`subject_${sub.toLowerCase().replace(/\s+/g, '_')}`)).join(' & ') : t('subject_general')}
          </Text>

          <View style={styles.ratingRow}>
            {renderStars(Math.round(tutor.rating || 0))}
            <Text style={[styles.ratingScore, { color: colors.text }]}>{(tutor.rating || 0).toFixed(1)}</Text>
            <Text style={[styles.ratingReviews, { color: colors.textSecondary }]}>{t('reviews_count_short').replace('{count}', '124')}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('experience_label')}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>8+ {t('years')}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('rate_label')}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>$45/{t('hour')}</Text>
            </View>
          </View>
        </View>

        {/* Subjects Taught Card */}
        <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="school" size={20} color={colors.primary} style={styles.sectionIcon} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('subjects_taught')}</Text>
          </View>
          
          <View style={styles.chipsContainer}>
            {tutor.subjects && Array.isArray(tutor.subjects) ? tutor.subjects.map((sub, idx) => (
              <View key={idx} style={[styles.chipItem, { backgroundColor: colors.border }]}>
                <Text style={[styles.chipText, { color: colors.textSecondary }]}>{sub}</Text>
              </View>
            )) : <Text style={{color: colors.textMuted}}>{t('no_specific_subjects')}</Text>}
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('about_tutor').replace('{name}', tutor.user?.name || '')}</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            {tutor.bio}
          </Text>
        </View>

        {/* Availability Section */}
        <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.availabilityHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('availability_label')}</Text>
            <View style={styles.arrowsRow}>
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="chevron-back" size={16} color={colors.textSecondary} /></TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="chevron-forward" size={16} color={colors.textSecondary} /></TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
            {DATES.map((d, i) => (
              <TouchableOpacity 
                key={i} 
                style={[
                  styles.dateItem, 
                  { backgroundColor: colors.border },
                  selectedDate === d.date && [styles.dateItemActive, { backgroundColor: colors.primary }],
                  d.disabled && [styles.dateItemDisabled, { backgroundColor: 'transparent' }]
                ]}
                onPress={() => !d.disabled && setSelectedDate(d.date)}
                disabled={d.disabled}
              >
                <Text style={[styles.dayText, { color: colors.textSecondary }, selectedDate === d.date && styles.textWhite, d.disabled && styles.textDisabled]}>{d.day}</Text>
                <Text style={[styles.dateTextNum, { color: colors.text }, selectedDate === d.date && styles.textWhite, d.disabled && styles.textDisabled]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.timeGrid}>
            {TIMESLOTS.map((t, i) => (
              <TouchableOpacity 
                key={i} 
                style={[
                  styles.timeItem, 
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedTime === t.time && [styles.timeItemActive, { backgroundColor: colors.primary, borderColor: colors.primary }]
                ]}
                onPress={() => setSelectedTime(t.time)}
              >
                <Text style={[styles.timeText, { color: colors.text }, selectedTime === t.time && styles.textWhite]}>{t.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={[styles.cardSection, styles.lastSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.availabilityHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('latest_reviews')}</Text>
            <TouchableOpacity>
              <Text style={[styles.linkText, { color: colors.primary }]}>{t('view_all')}</Text>
            </TouchableOpacity>
          </View>

          {REVIEWS.map((rev) => (
            <View key={rev.id} style={[styles.reviewCard, { borderTopColor: colors.border }]}>
              <View style={styles.reviewHeader}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.avatarBg }]}>
                  <Ionicons name="person" size={16} color="#FFF" />
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={[styles.reviewerName, { color: colors.text }]}>{rev.name}</Text>
                  <Text style={[styles.reviewerCourse, { color: colors.textSecondary }]}>{rev.course}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {renderStars(rev.stars)}
                </View>
              </View>
              <Text style={[styles.reviewTextVal, { color: colors.textSecondary }]}>{rev.text}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]} onPress={handleBookSession}>
          <Text style={styles.bookButtonText}>{t('confirm_booking')}</Text>
        </TouchableOpacity>
      </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  notificationBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTopLeftText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  avatarWrapper: {
    marginBottom: 16,
    marginTop: 10,
  },
  avatarGradientBorder: {
    width: 90,
    height: 90,
    borderRadius: 30,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImgLarge: {
    width: '100%',
    height: '100%',
  },
  tutorName: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  tutorSubject: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
  ratingReviews: {
    fontSize: 12,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  cardSection: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  arrowBtn: {
    padding: 4,
  },
  datesRow: {
    marginBottom: 24,
    gap: 12,
  },
  dateItem: {
    width: 50,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateItemActive: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dateItemDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateTextNum: {
    fontSize: 15,
    fontWeight: '800',
  },
  textWhite: {
    color: '#FFF',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeItem: {
    width: (width - 32 - 40 - 20) / 3, // account for margins/padding
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  timeItemActive: {
    elevation: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  lastSection: {
    marginBottom: 100,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewCard: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  reviewerCourse: {
    fontSize: 10,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewTextVal: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    elevation: 5,
  },
  bookButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
