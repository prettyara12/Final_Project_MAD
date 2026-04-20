import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

type Session = {
  id: string;
  mentorName: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  themeColor: string;
  avatar: string;
};

const SESSIONS: Session[] = [
  {
    id: '1',
    mentorName: 'Dr. Sarah Jenkins',
    subject: 'Kalkulus Lanjutan',
    date: 'Hari ini',
    time: '14:00 - 15:30',
    duration: '90 menit',
    status: 'Berlangsung',
    themeColor: '#4F46E5',
    avatar: 'SJ',
  },
  {
    id: '2',
    mentorName: 'James Wilson',
    subject: 'Python & Data Science',
    date: 'Hari ini',
    time: '17:00 - 18:00',
    duration: '60 menit',
    status: 'Mendatang',
    themeColor: '#9333EA',
    avatar: 'JW',
  },
  {
    id: '3',
    mentorName: 'Maria Garcia',
    subject: 'Desain UI/UX',
    date: 'Besok',
    time: '10:00 - 11:30',
    duration: '90 menit',
    status: 'Mendatang',
    themeColor: '#0EA5E9',
    avatar: 'MG',
  },
  {
    id: '4',
    mentorName: 'Dr. Ahmad Yani',
    subject: 'Fisika Kuantum',
    date: '24 Okt',
    time: '13:00 - 14:00',
    duration: '60 menit',
    status: 'Selesai',
    themeColor: '#10B981',
    avatar: 'AY',
  },
  {
    id: '5',
    mentorName: 'Lisa Tanaka',
    subject: 'Bahasa Inggris Akademik',
    date: '22 Okt',
    time: '09:00 - 10:00',
    duration: '60 menit',
    status: 'Selesai',
    themeColor: '#F59E0B',
    avatar: 'LT',
  },
];

const STATUS_FILTERS = ['Semua', 'Mendatang', 'Berlangsung', 'Selesai'];

const SB_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

export default function SessionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredSessions = SESSIONS.filter((s) => {
    const matchSearch =
      s.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === 'Semua' || s.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleJoinSession = (session: Session) => {
    if (session.status === 'Selesai') {
      Alert.alert('Sesi Selesai', 'Sesi ini telah berakhir. Lihat rekaman di riwayat belajarmu.');
    } else {
      Alert.alert(
        'Bergabung ke Sesi',
        `Bergabung dengan ${session.mentorName} untuk sesi "${session.subject}"?\n\nWaktu: ${session.time}`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Bergabung', onPress: () => Alert.alert('✅ Berhasil', 'Kamu telah bergabung ke sesi!') },
        ]
      );
    }
  };

  const getStatusStyle = (status: Session['status']) => {
    switch (status) {
      case 'Berlangsung': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'Mendatang':   return { bg: '#EBE2FF', text: '#7C3AED' };
      case 'Selesai':     return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getActionLabel = (status: Session['status']) => {
    switch (status) {
      case 'Berlangsung': return 'Masuk Sekarang';
      case 'Mendatang':   return 'Lihat Detail';
      case 'Selesai':     return 'Lihat Rekaman';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── HEADER: 2 baris ── */}
      <View style={[styles.header, { backgroundColor: colors.background, paddingTop: SB_HEIGHT + 12 }]}>

        {/* Baris 1: tombol back (kiri) + notifikasi (kanan) */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: '#F3F4F6' }]}
            onPress={() => router.push('/NotificationScreen' as any)}
          >
            <Ionicons name="notifications" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Baris 2: logo di bawah tombol back, rapat kiri */}
        <Image
          source={require('../../assets/images/logo.jpeg')}
          style={styles.logoImage}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>Sesi Belajar{'\n'}dengan Mentor</Text>
          <Text style={[styles.mainDesc, { color: colors.textSecondary }]}>
            Kelola jadwal dan riwayat sesi belajarmu bersama mentor.
          </Text>

          {/* Search */}
          <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Cari mentor atau mata kuliah..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#EBE2FF' }]}>
            <Text style={styles.summaryNumber}>3</Text>
            <Text style={styles.summaryLabel}>Sesi Mendatang</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[styles.summaryNumber, { color: '#16A34A' }]}>1</Text>
            <Text style={[styles.summaryLabel, { color: '#16A34A' }]}>Sedang Berlangsung</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.summaryNumber, { color: '#6B7280' }]}>12</Text>
            <Text style={[styles.summaryLabel, { color: '#6B7280' }]}>Total Selesai</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                activeFilter === f
                  ? { backgroundColor: '#4F46E5' }
                  : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[
                styles.filterChipText,
                { color: activeFilter === f ? '#FFFFFF' : colors.textSecondary },
              ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Session List */}
        <View style={styles.listSection}>
          {filteredSessions.map((session) => {
            const ss = getStatusStyle(session.status);
            return (
              <View
                key={session.id}
                style={[
                  styles.sessionCard,
                  { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: session.themeColor },
                ]}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: session.themeColor }]}>
                    <Text style={styles.avatarText}>{session.avatar}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.mentorName, { color: colors.text }]}>{session.mentorName}</Text>
                    <Text style={[styles.subjectName, { color: colors.textSecondary }]}>{session.subject}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: ss.bg }]}>
                    <Text style={[styles.statusText, { color: ss.text }]}>{session.status}</Text>
                  </View>
                </View>

                <View style={[styles.detailsRow, { borderTopColor: colors.border }]}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{session.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{session.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="hourglass-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{session.duration}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: session.themeColor }]}
                  onPress={() => handleJoinSession(session)}
                >
                  <Text style={styles.actionBtnText}>{getActionLabel(session.status)}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Book New Session */}
        <TouchableOpacity
          style={styles.bookBlock}
          onPress={() => router.push('/BookSessionScreen' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.bookBlockLeft}>
            <Text style={styles.bookBlockTitle}>Jadwalkan Sesi Baru</Text>
            <Text style={styles.bookBlockDesc}>Temukan mentor dan pilih waktu yang sesuai denganmu.</Text>
          </View>
          <Ionicons name="add-circle" size={36} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  // ── HEADER: kolom vertikal ───────────────────────────────────────
  header: {
    // flexDirection default = 'column' → baris 1 dan baris 2 menumpuk ke bawah
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // back kiri, notif kanan
    marginBottom: 10,                // jarak ke logo di bawahnya
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 44,   // pas ukuran logo → tidak ada ruang kosong → otomatis rapat kiri
    height: 44,
    borderRadius: 8,
    alignSelf: 'flex-start', // pastikan logo menempel ke kiri
  },

  // ── SCROLL ──────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: 40,
  },

  // ── TITLE ───────────────────────────────────────────────────────
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    marginBottom: 8,
  },
  mainDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  // ── SUMMARY ─────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#7C3AED',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C3AED',
    textAlign: 'center',
  },

  // ── FILTER ──────────────────────────────────────────────────────
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── SESSION LIST ─────────────────────────────────────────────────
  listSection: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  sessionCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 20,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cardInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 14,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
  },
  actionBtn: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── BOOK BLOCK ───────────────────────────────────────────────────
  bookBlock: {
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4F46E5',
  },
  bookBlockLeft: {
    flex: 1,
    marginRight: 16,
  },
  bookBlockTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  bookBlockDesc: {
    fontSize: 12,
    color: '#E0E7FF',
    lineHeight: 18,
  },
});