import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';

// ───────── TYPES ─────────
type Mentor = {
  id: string;
  name: string;
  initials: string;
  subject: string;
  expertise: string[];
  rating: number;
  avatarColor: string;
  avatarTextColor: string;
};

type BookedSession = {
  id: string;
  mentor: Mentor;
  date: Date;
  duration: string;
};

// ───────── DATA ─────────
const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    subject: 'Kalkulus',
    expertise: ['Matematika', 'Statistik'],
    rating: 4.9,
    avatarColor: '#CECBF6',
    avatarTextColor: '#3C3489',
  },
  {
    id: '2',
    name: 'James Wilson',
    initials: 'JW',
    subject: 'Data Science',
    expertise: ['Python', 'AI'],
    rating: 4.8,
    avatarColor: '#9FE1CB',
    avatarTextColor: '#085041',
  },
  {
    id: '3',
    name: 'Ayu Pratiwi',
    initials: 'AP',
    subject: 'Fisika',
    expertise: ['Mekanika', 'Termodinamika'],
    rating: 4.7,
    avatarColor: '#F5C4B3',
    avatarTextColor: '#712B13',
  },
  {
    id: '4',
    name: 'Budi Santoso',
    initials: 'BS',
    subject: 'Pemrograman Web',
    expertise: ['React', 'TypeScript'],
    rating: 4.6,
    avatarColor: '#B5D4F4',
    avatarTextColor: '#0C447C',
  },
];

const DURATIONS = ['30 menit', '60 menit', '90 menit'];

// ───────── HELPERS ─────────
const formatDate = (date: Date) =>
  date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

// ───────── MAIN COMPONENT ─────────
export default function BookSessionScreen() {
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);

  // Booked sessions state
  const [sessions, setSessions] = useState<BookedSession[]>([]);

  // Edit session state
  const [editingSession, setEditingSession] = useState<BookedSession | null>(null);
  const [editDate, setEditDate] = useState(new Date());
  const [editMode, setEditMode] = useState<'date' | 'time'>('date');
  const [showEditPicker, setShowEditPicker] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ── Filter ──
  const filteredMentors = MENTORS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Picker handlers ──
  const onChangePicker = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeEditPicker = (_: any, selectedDate?: Date) => {
    setShowEditPicker(false);
    if (selectedDate) setEditDate(selectedDate);
  };

  // ── Booking ──
  const handleBooking = () => {
    if (!selectedMentor || !selectedDuration) {
      Alert.alert('Lengkapi Data', 'Pilih mentor dan durasi terlebih dahulu.');
      return;
    }

    const newSession: BookedSession = {
      id: Date.now().toString(),
      mentor: selectedMentor,
      date: new Date(date),
      duration: selectedDuration,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Reset form
    setSelectedMentor(null);
    setSelectedDuration(null);
    setDate(new Date());

    Alert.alert(
      '✅ Booking Berhasil!',
      `Mentor: ${selectedMentor.name}\nTanggal: ${formatDate(newSession.date)}\nJam: ${formatTime(newSession.date)}\nDurasi: ${selectedDuration}`
    );
  };

  // ── Edit session ──
  const openEditModal = (session: BookedSession) => {
    setEditingSession(session);
    setEditDate(new Date(session.date));
    setShowEditModal(true);
  };

  const saveEditSession = () => {
    if (!editingSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === editingSession.id ? { ...s, date: new Date(editDate) } : s
      )
    );
    setShowEditModal(false);
    setEditingSession(null);
  };

  // ── Delete session ──
  const deleteSession = (id: string) => {
    Alert.alert('Batalkan Sesi?', 'Sesi ini akan dihapus dari daftar booking.', [
      { text: 'Tidak', style: 'cancel' },
      {
        text: 'Ya, batalkan',
        style: 'destructive',
        onPress: () => setSessions((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ── HEADER ── */}
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Book Sesi Mentor</Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            Pilih mentor, jadwal, dan durasi sesi
          </Text>
        </View>

        {/* ── SEARCH ── */}
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Cari mentor atau keahlian..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={(text) => {
              setLoading(true);
              setSearch(text);
              setTimeout(() => setLoading(false), 300);
            }}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── LOADING ── */}
        {loading && <ActivityIndicator style={{ marginTop: 10 }} color="#7F77DD" />}

        {/* ── MENTOR LIST ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Pilih Mentor</Text>

        {!loading && filteredMentors.length === 0 && (
          <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
            <Ionicons name="search-outline" size={32} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Mentor tidak ditemukan</Text>
          </View>
        )}

        <FlatList
          data={filteredMentors}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.mentorCard,
                { backgroundColor: colors.card },
                selectedMentor?.id === item.id && styles.mentorCardSelected,
              ]}
              onPress={() => setSelectedMentor(item)}
              activeOpacity={0.8}
            >
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                <Text style={[styles.avatarText, { color: item.avatarTextColor }]}>
                  {item.initials}
                </Text>
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.mentorName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.mentorSubject, { color: colors.textSecondary }]}>
                  {item.subject}
                </Text>
                <View style={styles.tagRow}>
                  {item.expertise.map((e) => (
                    <View key={e} style={styles.tag}>
                      <Text style={styles.tagText}>{e}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Rating */}
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingNum}>{item.rating}</Text>
              </View>

              {/* Selected checkmark */}
              {selectedMentor?.id === item.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={20} color="#7F77DD" />
                </View>
              )}
            </TouchableOpacity>
          )}
        />

        {/* ── DATE & TIME ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Jadwal Sesi</Text>
        <View style={styles.dtRow}>
          <TouchableOpacity
            style={[styles.dtCard, { backgroundColor: colors.card }]}
            onPress={() => { setMode('date'); setShowPicker(true); }}
          >
            <Ionicons name="calendar-outline" size={18} color="#7F77DD" />
            <Text style={[styles.dtLabel, { color: colors.textSecondary }]}>Tanggal</Text>
            <Text style={[styles.dtValue, { color: colors.text }]}>{formatDate(date)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dtCard, { backgroundColor: colors.card }]}
            onPress={() => { setMode('time'); setShowPicker(true); }}
          >
            <Ionicons name="time-outline" size={18} color="#7F77DD" />
            <Text style={[styles.dtLabel, { color: colors.textSecondary }]}>Waktu</Text>
            <Text style={[styles.dtValue, { color: colors.text }]}>{formatTime(date)}</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode={mode}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangePicker}
            minimumDate={new Date()}
          />
        )}

        {/* ── DURATION ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Durasi</Text>
        <View style={styles.durRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.durChip,
                { backgroundColor: colors.card },
                selectedDuration === d && styles.durChipActive,
              ]}
              onPress={() => setSelectedDuration(d)}
            >
              <Ionicons
                name="hourglass-outline"
                size={14}
                color={selectedDuration === d ? '#fff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.durText,
                  { color: colors.textSecondary },
                  selectedDuration === d && styles.durTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── CONFIRM BUTTON ── */}
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!selectedMentor || !selectedDuration) && styles.confirmBtnDisabled,
          ]}
          onPress={handleBooking}
          disabled={!selectedMentor || !selectedDuration}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.confirmText}>Konfirmasi Booking</Text>
        </TouchableOpacity>

        {/* ── BOOKED SESSIONS ── */}
        {sessions.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Sesi yang Dipesan ({sessions.length})
            </Text>

            {sessions.map((session) => (
              <View
                key={session.id}
                style={[styles.sessionCard, { backgroundColor: colors.card }]}
              >
                {/* Session header */}
                <View style={styles.sessionHeader}>
                  <View style={[styles.avatar, { backgroundColor: session.mentor.avatarColor }]}>
                    <Text style={[styles.avatarText, { color: session.mentor.avatarTextColor }]}>
                      {session.mentor.initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mentorName, { color: colors.text }]}>
                      {session.mentor.name}
                    </Text>
                    <Text style={[styles.mentorSubject, { color: colors.textSecondary }]}>
                      {session.mentor.subject}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Terjadwal</Text>
                  </View>
                </View>

                {/* Session details */}
                <View style={[styles.sessionDetails, { borderTopColor: colors.border }]}>
                  <View style={styles.sessionDetailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#7F77DD" />
                    <Text style={[styles.sessionDetailText, { color: colors.textSecondary }]}>
                      {formatDate(session.date)}
                    </Text>
                  </View>
                  <View style={styles.sessionDetailRow}>
                    <Ionicons name="time-outline" size={14} color="#7F77DD" />
                    <Text style={[styles.sessionDetailText, { color: colors.textSecondary }]}>
                      {formatTime(session.date)} · {session.duration}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEditModal(session)}
                  >
                    <Ionicons name="create-outline" size={14} color="#7F77DD" />
                    <Text style={styles.editBtnText}>Edit Jadwal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteSession(session.id)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#E24B4A" />
                    <Text style={styles.deleteBtnText}>Batalkan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* ── EDIT MODAL ── */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Jadwal Sesi</Text>
            {editingSession && (
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                {editingSession.mentor.name} · {editingSession.duration}
              </Text>
            )}

            {/* Edit date */}
            <TouchableOpacity
              style={[styles.dtCard, { backgroundColor: colors.card, marginBottom: 10 }]}
              onPress={() => { setEditMode('date'); setShowEditPicker(true); }}
            >
              <Ionicons name="calendar-outline" size={18} color="#7F77DD" />
              <Text style={[styles.dtLabel, { color: colors.textSecondary }]}>Tanggal</Text>
              <Text style={[styles.dtValue, { color: colors.text }]}>{formatDate(editDate)}</Text>
            </TouchableOpacity>

            {/* Edit time */}
            <TouchableOpacity
              style={[styles.dtCard, { backgroundColor: colors.card }]}
              onPress={() => { setEditMode('time'); setShowEditPicker(true); }}
            >
              <Ionicons name="time-outline" size={18} color="#7F77DD" />
              <Text style={[styles.dtLabel, { color: colors.textSecondary }]}>Waktu</Text>
              <Text style={[styles.dtValue, { color: colors.text }]}>{formatTime(editDate)}</Text>
            </TouchableOpacity>

            {showEditPicker && (
              <DateTimePicker
                value={editDate}
                mode={editMode}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChangeEditPicker}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.card }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={saveEditSession}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ───────── STYLES ─────────
const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },

  pageHeader: { marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700' },
  pageSubtitle: { fontSize: 13, marginTop: 2 },

  searchBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 14 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  emptyBox: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 14,
    marginBottom: 16,
  },

  mentorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  mentorCardSelected: {
    borderColor: '#7F77DD',
    backgroundColor: '#EEEDFE',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '600' },
  mentorName: { fontSize: 14, fontWeight: '600' },
  mentorSubject: { fontSize: 12, marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: {
    backgroundColor: 'rgba(127,119,221,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: { fontSize: 11, color: '#534AB7' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingStar: { color: '#EF9F27', fontSize: 13 },
  ratingNum: { fontSize: 13, fontWeight: '600', color: '#534AB7' },
  checkmark: { position: 'absolute', top: 10, right: 10 },

  dtRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  dtCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  dtLabel: { fontSize: 11, marginTop: 4 },
  dtValue: { fontSize: 14, fontWeight: '600' },

  durRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  durChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  durChipActive: { backgroundColor: '#7F77DD' },
  durText: { fontSize: 13 },
  durTextActive: { color: '#fff', fontWeight: '600' },

  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7F77DD',
    padding: 16,
    borderRadius: 14,
  },
  confirmBtnDisabled: { backgroundColor: '#C4C1F0', opacity: 0.6 },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 24,
  },

  sessionCard: {
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  statusBadge: {
    backgroundColor: '#EAF3DE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: '600', color: '#3B6D11' },
  sessionDetails: {
    borderTopWidth: 0.5,
    padding: 12,
    gap: 6,
  },
  sessionDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sessionDetailText: { fontSize: 13 },
  sessionActions: {
    flexDirection: 'row',
    gap: 0,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
  },
  editBtnText: { fontSize: 13, color: '#7F77DD', fontWeight: '500' },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(0,0,0,0.08)',
  },
  deleteBtnText: { fontSize: 13, color: '#E24B4A', fontWeight: '500' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnSave: { backgroundColor: '#7F77DD' },
  modalBtnText: { fontWeight: '600', fontSize: 14 },
});