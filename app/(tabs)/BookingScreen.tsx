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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';

const { width } = Dimensions.get('window');

const DAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
const CALENDAR_DATES = [
  // Padding for prev month
  { date: '25', inactive: true }, { date: '26', inactive: true }, 
  { date: '27', inactive: true }, { date: '28', inactive: true }, 
  { date: '29', inactive: true }, { date: '30', inactive: true }, 
  { date: '1', inactive: false },
  // Row 2
  { date: '2', inactive: false }, { date: '3', inactive: false }, 
  { date: '4', inactive: false }, { date: '5', inactive: false }, 
  { date: '6', inactive: false }, { date: '7', inactive: false }, 
  { date: '8', inactive: false },
  // Row 3
  { date: '9', inactive: false }, { date: '10', inactive: false, active: true }, 
  { date: '11', inactive: false }, { date: '12', inactive: false }, 
  { date: '13', inactive: false }, { date: '14', inactive: false }, 
  { date: '15', inactive: false },
  // Row 4
  { date: '16', inactive: false }, { date: '17', inactive: false }, 
  { date: '18', inactive: false }, { date: '19', inactive: false }, 
  { date: '20', inactive: false }, { date: '21', inactive: false }, 
  { date: '22', inactive: false },
  // Row 5
  { date: '23', inactive: false }, { date: '24', inactive: false }, 
  { date: '25', inactive: false }
];

const TIME_SLOTS = [
  { time: '09:00 AM', tag: 'CEPAT PENUH', available: true },
  { time: '10:30 AM', active: true, available: true },
  { time: '01:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '04:00 PM (Terisi)', available: false, full: true },
];

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const { profileData } = useProfile();
  
  const [selectedDate, setSelectedDate] = useState('10');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [isBooking, setIsBooking] = useState(false);

  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const bookSession = useMutation(api.sessions.bookSession);

  const handleConfirm = async () => {
    if (!currentUser || !params.tutorId) {
      Alert.alert("Error", "Informasi pengguna atau tutor tidak lengkap.");
      return;
    }

    setIsBooking(true);
    try {
      await bookSession({
        tutorId: params.tutorId as any,
        learnerId: currentUser._id,
        subject: params.subject as string || "General Study",
        date: `${selectedDate} Okt 2023`,
        time: selectedTime,
      });
      
      Alert.alert("Sukses", "Sesi belajar berhasil dipesan!", [
        { text: "OK", onPress: () => router.push('/ProgressScreen' as any) }
      ]);
    } catch (error) {
      Alert.alert("Error", "Gagal memesan sesi. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

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
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Pesan Sesi{'\n'}
            <Text style={[styles.mainTitleHighlight, { color: colors.primary }]}>Berikutnya</Text>
          </Text>
          <Text style={[styles.mainDesc, { color: colors.textSecondary }]}>
            Jadwalkan pengalaman belajar yang dipersonalisasi dengan tutor pilihanmu.
          </Text>
        </View>

        {/* Calendar Picker */}
        <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={[styles.calTitle, { color: colors.text }]}>Pilih Tanggal</Text>
              <Text style={[styles.calSubtitle, { color: colors.textSecondary }]}>Oktober 2023</Text>
            </View>
            <View style={styles.arrowsRow}>
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="chevron-back" size={18} color={colors.textSecondary} /></TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn}><Ionicons name="chevron-forward" size={18} color={colors.text} /></TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.daysRow}>
            {DAYS.map(day => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>

          <View style={styles.datesGrid}>
            {CALENDAR_DATES.map((item, idx) => {
              const isActive = selectedDate === item.date && !item.inactive;
              return (
                <TouchableOpacity 
                  key={idx}
                  style={[
                    styles.dateBox, 
                    { backgroundColor: isActive ? colors.primary : 'transparent' }
                  ]}
                  onPress={() => {
                    if(!item.inactive) setSelectedDate(item.date);
                  }}
                  disabled={item.inactive}
                >
                  <Text style={[
                      styles.dateNum, 
                      { color: isActive ? '#FFF' : (item.inactive ? colors.border : colors.text) }
                  ]}>
                    {item.date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Available Slots */}
        <View style={styles.slotsSection}>
          <View style={styles.slotsHeader}>
            <Ionicons name="time" size={20} color={colors.primary} style={styles.slotsIcon} />
            <Text style={[styles.slotsTitle, { color: colors.text }]}>Slot Tersedia</Text>
          </View>
          
          <View style={styles.slotsList}>
            {TIME_SLOTS.map((slot, idx) => {
              const isSelected = selectedTime === slot.time && slot.available;
              return (
                <TouchableOpacity 
                  key={idx}
                  style={[
                    styles.slotBtn, 
                    { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1 },
                    slot.full && { opacity: 0.6 }
                  ]}
                  onPress={() => {
                    if(slot.available) setSelectedTime(slot.time);
                  }}
                  disabled={!slot.available}
                >
                  <Text style={[
                    styles.slotText,
                    { color: isSelected ? '#FFF' : (slot.full ? colors.textMuted : colors.text) }
                  ]}>
                    {slot.time}
                  </Text>

                  {/* Right side Elements */}
                  {slot.tag && (
                    <View style={[styles.slotTag, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.slotTagText, { color: colors.primary }]}>{slot.tag}</Text>
                    </View>
                  )}
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Selected Session Confirmation Card */}
        <View style={[styles.confirmationCard, { backgroundColor: colors.primary }]}>
           <Text style={styles.confSuperTitle}>SESI TERPILIH</Text>
           <Text style={styles.confTitle}>{params.subject || "Fisika Quantum & Model AI"}</Text>
           <Text style={[styles.confInfoText, { marginBottom: 16, marginLeft: 0 }]}>Tutor: {params.tutorName || "Dr. Sarah Jenkins"}</Text>
           
           <View style={styles.confInfoRow}>
             <Ionicons name="calendar-outline" size={16} color="#EBE2FF" />
             <Text style={styles.confInfoText}>{selectedDate} Oktober 2023</Text>
           </View>
           <View style={styles.confInfoRow}>
             <Ionicons name="time-outline" size={16} color="#EBE2FF" />
             <Text style={styles.confInfoText}>{selectedTime}</Text>
           </View>

           <TouchableOpacity 
              style={[styles.confButton, isBooking && { opacity: 0.7 }]} 
              onPress={handleConfirm}
              disabled={isBooking}
            >
              <Text style={[styles.confButtonText, { color: colors.primary }]}>
                {isBooking ? "Memproses..." : "Konfirmasi Pesanan"}
              </Text>
           </TouchableOpacity>
        </View>

        {/* Recommended Groups */}
        <View style={styles.groupsSection}>
          <Text style={[styles.groupsHeader, { color: colors.text }]}>
            Grup{'\n'}Belajar <Text style={[styles.groupsHeaderHighlight, { color: colors.primary }]}>Direkomendasikan</Text>
          </Text>
          
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.groupCardContent}>
              <View style={[styles.groupAvatar, { backgroundColor: colors.avatarBg }]}>
                 <Ionicons name="person" size={20} color="#FFF" />
                 <View style={styles.onlineDot} />
              </View>
              <View style={styles.groupInfo}>
                 <Text style={[styles.groupTitle, { color: colors.text }]}>Aljabar Lanjutan</Text>
                 <Text style={[styles.groupSubtitle, { color: colors.textSecondary }]}>Dipimpin oleh Sarah J.</Text>
                 <Text style={[styles.groupDesc, { color: colors.textSecondary }]}>Analisis mendalam tentang persamaan linear dan ruang vektor. Sisa 3 tempat.</Text>
              </View>
            </View>
            <View style={[styles.groupFooter, { borderTopColor: colors.border }]}>
               <Text style={[styles.groupTime, { color: colors.textSecondary }]}>HARI INI • 5:00 PM</Text>
               <TouchableOpacity><Text style={[styles.groupAction, { color: colors.primary }]}>Gabung Sekarang</Text></TouchableOpacity>
            </View>
          </View>

          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.groupCardContent}>
              <View style={[styles.groupAvatar, { backgroundColor: colors.avatarBg }]}>
                 <Ionicons name="person" size={20} color="#FFF" />
                 <View style={styles.onlineDot} />
              </View>
              <View style={styles.groupInfo}>
                 <Text style={[styles.groupTitle, { color: colors.text }]}>Python untuk Data</Text>
                 <Text style={[styles.groupSubtitle, { color: colors.textSecondary }]}>Dipimpin oleh Mark R.</Text>
                 <Text style={[styles.groupDesc, { color: colors.textSecondary }]}>Bekerja melalui tantangan visualisasi Pandas dan Matplotlib.</Text>
               </View>
            </View>
            <View style={[styles.groupFooter, { borderTopColor: colors.border }]}>
               <Text style={[styles.groupTime, { color: colors.textSecondary }]}>BESOK • 2:00 PM</Text>
               <TouchableOpacity><Text style={[styles.groupAction, { color: colors.primary }]}>Lihat Grup</Text></TouchableOpacity>
            </View>
          </View>

          <View style={[styles.createGroupCard, { backgroundColor: colors.primary }]}>
             <Ionicons name="people" size={32} color="#FFF" style={styles.createGroupIcon} />
             <Text style={styles.createGroupTitle}>Buat Milikmu Sendiri</Text>
             <Text style={styles.createGroupDesc}>Mulai sesi belajar dengan teman sebaya.</Text>
             <TouchableOpacity style={[styles.createGroupBtn, { backgroundColor: '#FFF' }]}>
               <Text style={[styles.createGroupBtnText, { color: colors.primary }]}>Mulai Sekarang</Text>
             </TouchableOpacity>
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
    paddingBottom: 100,
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
    lineHeight: 40,
    marginBottom: 12,
  },
  mainTitleHighlight: {
    color: '#4F46E5',
  },
  mainDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    marginHorizontal: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  calSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  arrowsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  arrowBtn: {
    padding: 4,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayLabel: {
    width: width * 0.1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateBox: {
    width: width * 0.1,
    height: width * 0.1,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  dateBoxActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  dateNum: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  dateNumInactive: {
    color: '#D1D5DB',
  },
  dateNumActive: {
    color: '#FFFFFF',
  },
  slotsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  slotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slotsIcon: {
    marginRight: 8,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  slotsList: {
    gap: 12,
  },
  slotBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  slotBtnActive: {
    backgroundColor: '#4F46E5',
  },
  slotBtnFull: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  slotTextActive: {
    color: '#FFFFFF',
  },
  slotTextFull: {
    color: '#9CA3AF',
  },
  slotTag: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  slotTagText: {
    color: '#9333EA',
    fontSize: 10,
    fontWeight: '800',
  },
  confirmationCard: {
    backgroundColor: '#7C3AED',
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 40,
  },
  confSuperTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EBE2FF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  confTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 28,
  },
  confInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confInfoText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 8,
  },
  confButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  confButtonText: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 14,
  },
  groupsSection: {
    paddingHorizontal: 20,
  },
  groupsHeader: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 20,
    lineHeight: 30,
  },
  groupsHeaderHighlight: {
    color: '#9333EA',
  },
  groupCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  groupCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  groupInfo: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  groupSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  groupDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  groupTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9333EA',
  },
  groupAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  createGroupCard: {
    backgroundColor: '#A855F7',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  createGroupIcon: {
    marginBottom: 12,
  },
  createGroupTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  createGroupDesc: {
    fontSize: 12,
    color: '#EBE2FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  createGroupBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createGroupBtnText: {
    color: '#9333EA',
    fontWeight: '700',
    fontSize: 12,
  },
});
