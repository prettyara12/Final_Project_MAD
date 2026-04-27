import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';

const { width } = Dimensions.get('window');

const DAYS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

const TIME_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '10:30 AM', available: true, tag: 'POPULER' },
  { time: '01:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '04:00 PM', available: false, full: true },
  { time: '05:30 PM', available: true },
];

export default function BookingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const { profileData } = useProfile();

  // Convex Integration
  const user = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const bookSessionMutation = useMutation(api.sessions.bookSession);
  const recommendedGroups = useQuery(api.groups.getRecommendedGroups);
  
  // Fetch Tutor Detail if name/subject missing from params
  const tutorDetail = useQuery(api.tutors.getTutorDetail, params.tutorId ? { id: params.tutorId as string } : "skip");

  // States
  const [selectedDate, setSelectedDate] = useState(new Date().getDate().toString());
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [isBooking, setIsBooking] = useState(false);

  // Derived Info
  const displayTutorName = (params.tutorName as string) || tutorDetail?.user?.name || "Memuat...";
  const displaySubject = (params.subject as string) || (tutorDetail?.subjects && tutorDetail.subjects[0]) || "General Study";

  // Date Helpers
  const now = new Date();
  const currentMonthName = now.toLocaleString('id-ID', { month: 'long' });
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  const dates = useMemo(() => {
    const arr = [];
    // Padding for empty days at start
    for (let i = 0; i < firstDayOfMonth; i++) {
      arr.push({ date: '', inactive: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      arr.push({ date: i.toString(), inactive: i < now.getDate() });
    }
    return arr;
  }, [daysInMonth, firstDayOfMonth]);

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert("Error", "Sesi tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!params.tutorId) {
      Alert.alert("Error", "Informasi tutor tidak ditemukan.");
      return;
    }

    setIsBooking(true);
    try {
      await bookSessionMutation({
        learnerId: user._id,
        tutorId: params.tutorId as any,
        subject: displaySubject,
        date: `${selectedDate} ${currentMonthName} ${currentYear}`,
        time: selectedTime,
      });

      Alert.alert(
        "Pemesanan Berhasil!",
        "Sesi Anda telah dijadwalkan. Tutor akan segera mengonfirmasi.",
        [{ text: "Lihat Progres", onPress: () => router.push('/(tabs)/ProgressScreen' as any) }]
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Gagal", "Terjadi kesalahan saat memesan sesi.");
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
        
        {/* Selected Session Confirmation Card (Hero) */}
        <View style={[styles.confirmationCard, { backgroundColor: colors.primary, marginTop: 10 }]}>
           <Text style={styles.confSuperTitle}>SESI TERPILIH</Text>
           <Text style={styles.confTitle}>{displaySubject}</Text>
           <Text style={[styles.confInfoText, { marginBottom: 16, marginLeft: 0 }]}>Tutor: {displayTutorName}</Text>
           
           <View style={styles.confInfoRow}>
             <Ionicons name="calendar-outline" size={16} color="#EBE2FF" />
             <Text style={styles.confInfoText}>{selectedDate} {currentMonthName} {currentYear}</Text>
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
              <Text style={[styles.calSubtitle, { color: colors.textSecondary }]}>{currentMonthName} {currentYear}</Text>
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
            {dates.map((item, idx) => {
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

        {/* Recommended Groups */}
        <View style={styles.groupsSection}>
          <Text style={[styles.groupsHeader, { color: colors.text }]}>
            Grup Belajar{'\n'}
            <Text style={[styles.groupsHeaderHighlight, { color: colors.primary }]}>Direkomendasikan</Text>
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsScroll}
          >
            {recommendedGroups === undefined ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : recommendedGroups.map((group: any) => (
              <TouchableOpacity key={group._id} style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                <View style={[styles.groupIconBox, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="people" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.groupTitle, { color: colors.text }]} numberOfLines={1}>{group.title}</Text>
                <Text style={[styles.groupMeta, { color: colors.textSecondary }]}>{group.participants} Peserta • {group.tutorName}</Text>
                
                <View style={styles.groupAvatars}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <View key={i} style={[styles.miniAvatar, { left: i * 15, zIndex: 10 - i, backgroundColor: colors.avatarBg, borderColor: colors.surface }]}>
                      <Ionicons name="person" size={10} color="#FFF" />
                    </View>
                  ))}
                  <View style={[styles.miniAvatarPlus, { left: 45, backgroundColor: colors.primary, borderColor: colors.surface }]}>
                    <Text style={styles.miniAvatarPlusText}>+</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    marginBottom: 12,
  },
  mainTitleHighlight: {
    // color added dynamically
  },
  mainDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  calendarCard: {
    borderRadius: 32,
    marginHorizontal: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
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
  },
  calSubtitle: {
    fontSize: 12,
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
    justifyContent: 'flex-start',
  },
  dateBox: {
    width: (width - 40 - 48) / 7,
    height: 40,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  dateNum: {
    fontSize: 13,
    fontWeight: '600',
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
  },
  slotsList: {
    gap: 12,
  },
  slotBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '700',
  },
  slotTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  slotTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  confirmationCard: {
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
    marginBottom: 8,
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
  },
  confButtonText: {
    fontWeight: '800',
    fontSize: 14,
  },
  groupsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  groupsHeader: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
    lineHeight: 30,
  },
  groupsHeaderHighlight: {
    // color added dynamically
  },
  groupsScroll: {
    paddingRight: 20,
  },
  groupCard: {
    width: 280,
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
  },
  groupIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 12,
    marginBottom: 16,
  },
  groupAvatars: {
    flexDirection: 'row',
    height: 24,
    position: 'relative',
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarPlus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarPlusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  }
});
