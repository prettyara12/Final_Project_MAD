import React, { useState } from 'react';
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

const SUBJECTS = [
  'Kalkulus BC',
  'Fisika Kuantum',
  'Aljabar Linear',
  'Statika',
  'SAT Matematika',
];

const DATES = [
  { day: 'SEN', date: '12', active: true },
  { day: 'SEL', date: '13', active: false },
  { day: 'RAB', date: '14', active: false },
  { day: 'KAM', date: '15', active: false },
  { day: 'JUM', date: '16', active: false },
  { day: 'SAB', date: '17', disabled: true },
  { day: 'MIN', date: '18', disabled: true },
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

  const [selectedDate, setSelectedDate] = useState('12');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const handleBookSession = () => {
    // Navigate to booking/confirmation screen
    console.log("Navigating to BookingScreen");
    router.push('/BookingScreen' as any);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons 
        key={i} 
        name={i < count ? "star" : "star-outline"} 
        size={14} 
        color="#7C3AED" 
        style={styles.starIcon} 
      />
    ));
  };

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
          <Ionicons name="notifications" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Profile Card */}
        <View style={styles.heroCard}>
          <View style={styles.badgeTopLeft}>
            <Text style={styles.badgeTopLeftText}>TERATAS</Text>
          </View>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGradientBorder}>
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={40} color="#6B7280" />
              </View>
            </View>
          </View>

          <Text style={styles.tutorName}>Dr. Sarah Jenkins</Text>
          <Text style={styles.tutorSubject}>Matematika Lanjut & Fisika</Text>

          <View style={styles.ratingRow}>
            {renderStars(5)}
            <Text style={styles.ratingScore}>4.9</Text>
            <Text style={styles.ratingReviews}>(124 ulasan)</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>PENGALAMAN</Text>
              <Text style={styles.statValue}>8+ Tahun</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TARIF</Text>
              <Text style={styles.statValue}>$45/jam</Text>
            </View>
          </View>
        </View>

        {/* Subjects Taught Card */}
        <View style={styles.cardSection}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="school" size={20} color="#4F46E5" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Mata Kuliah Diajar</Text>
          </View>
          
          <View style={styles.chipsContainer}>
            {SUBJECTS.map((sub, idx) => (
              <View key={idx} style={styles.chipItem}>
                <Text style={styles.chipText}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Tentang Dr. Jenkins</Text>
          <Text style={styles.aboutText}>
            Saya berspesialisasi dalam membuat konsep matematika yang kompleks menjadi mudah diakses dan menarik. Dengan gelar PhD dalam Fisika Teoretis dan pengalaman mengajar selama hampir satu dekade di tingkat universitas, saya membantu mahasiswa menjembatani kesenjangan antara hafalan dan pemahaman konseptual yang sejati.{'\n\n'}
            Filosofi mengajar saya berfokus pada "Denyut Belajar"—pendekatan terstruktur yang membangun kepercayaan diri melalui tantangan bertahap dan penerapan dunia nyata dari teori-teori abstrak.
          </Text>
        </View>

        {/* Availability Section */}
        <View style={styles.cardSection}>
          <View style={styles.availabilityHeader}>
            <Text style={styles.sectionTitle}>Ketersediaan</Text>
            <View style={styles.arrowsRow}>
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="chevron-back" size={16} color="#6B7280" /></TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="chevron-forward" size={16} color="#6B7280" /></TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
            {DATES.map((d, i) => (
              <TouchableOpacity 
                key={i} 
                style={[
                  styles.dateItem, 
                  selectedDate === d.date && styles.dateItemActive,
                  d.disabled && styles.dateItemDisabled
                ]}
                onPress={() => !d.disabled && setSelectedDate(d.date)}
                disabled={d.disabled}
              >
                <Text style={[styles.dayText, selectedDate === d.date && styles.textWhite, d.disabled && styles.textDisabled]}>{d.day}</Text>
                <Text style={[styles.dateTextNum, selectedDate === d.date && styles.textWhite, d.disabled && styles.textDisabled]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.timeGrid}>
            {TIMESLOTS.map((t, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.timeItem, selectedTime === t.time && styles.timeItemActive]}
                onPress={() => setSelectedTime(t.time)}
              >
                <Text style={[styles.timeText, selectedTime === t.time && styles.textWhite]}>{t.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={[styles.cardSection, styles.lastSection]}>
          <View style={styles.availabilityHeader}>
            <Text style={styles.sectionTitle}>Ulasan Terbaru</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {REVIEWS.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={16} color="#FFF" />
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{rev.name}</Text>
                  <Text style={styles.reviewerCourse}>{rev.course}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {renderStars(rev.stars)}
                </View>
              </View>
              <Text style={styles.reviewTextVal}>{rev.text}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookSession}>
          <Text style={styles.bookButtonText}>Pesan Sesi</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 120, // space for bottom fixed button
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTopLeftText: {
    color: '#9333EA',
    fontSize: 10,
    fontWeight: '800',
  },
  avatarWrapper: {
    marginBottom: 16,
    marginTop: 8,
  },
  avatarGradientBorder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4F46E5', // pseudo gradient ring
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  tutorName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  tutorSubject: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
    marginRight: 4,
  },
  ratingReviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
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
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipItem: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  dateItem: {
    width: 52,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateItemActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dateItemDisabled: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  dateTextNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textDisabled: {
    color: '#D1D5DB',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  timeItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timeItemActive: {
    backgroundColor: '#4F46E5',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  linkText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },
  lastSection: {
    marginBottom: 0,
  },
  reviewCard: {
    backgroundColor: '#FAFAFC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  reviewerCourse: {
    fontSize: 11,
    color: '#6B7280',
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewTextVal: {
    fontSize: 13,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookButton: {
    backgroundColor: '#4F46E5',
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
