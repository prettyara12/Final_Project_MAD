import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
// import { BottomTabBar } from '../components/BottomTabBar';

// Expanded tutor data covering all subjects
const TUTORS = [
  // Matematika tutors
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    subject: 'Kalkulus Lanjut & Fisika',
    category: 'Matematika',
    rating: 4.9,
    reviews: 124,
    available: true,
  },
  {
    id: '2',
    name: 'Prof. Budi Hartono',
    subject: 'Aljabar Linear & Statistika',
    category: 'Matematika',
    rating: 4.8,
    reviews: 98,
    available: true,
  },
  // Koding tutors
  {
    id: '3',
    name: 'James Wilson',
    subject: 'Python & Data Science',
    category: 'Koding',
    rating: 4.9,
    reviews: 89,
    available: true,
  },
  {
    id: '4',
    name: 'Rina Sari',
    subject: 'JavaScript & React Native',
    category: 'Koding',
    rating: 4.7,
    reviews: 156,
    available: true,
  },
  {
    id: '5',
    name: 'Kevin Pratama',
    subject: 'Machine Learning & AI',
    category: 'Koding',
    rating: 4.8,
    reviews: 72,
    available: false,
  },
  // Bahasa tutors
  {
    id: '6',
    name: 'Prof. Ananda',
    subject: 'Sastra & Bahasa Spanyol',
    category: 'Bahasa',
    rating: 4.7,
    reviews: 64,
    available: true,
  },
  {
    id: '7',
    name: 'Emily Chen',
    subject: 'Bahasa Mandarin & Jepang',
    category: 'Bahasa',
    rating: 4.9,
    reviews: 201,
    available: true,
  },
  // Biologi tutors
  {
    id: '8',
    name: 'Dr. Mega Putri',
    subject: 'Biologi Molekuler & Genetika',
    category: 'Biologi',
    rating: 4.8,
    reviews: 87,
    available: true,
  },
  {
    id: '9',
    name: 'Arif Nugroho, M.Sc.',
    subject: 'Ekologi & Bioteknologi',
    category: 'Biologi',
    rating: 4.6,
    reviews: 53,
    available: false,
  },
  // Desain tutors
  {
    id: '10',
    name: 'Maria Garcia',
    subject: 'UI/UX Design & Figma',
    category: 'Desain',
    rating: 4.8,
    reviews: 210,
    available: false,
  },
  {
    id: '11',
    name: 'Dian Lestari',
    subject: 'Desain Grafis & Adobe Suite',
    category: 'Desain',
    rating: 4.7,
    reviews: 133,
    available: true,
  },
  // Sejarah tutors
  {
    id: '12',
    name: 'Dr. Andi Wijaya',
    subject: 'Sejarah Indonesia & Asia',
    category: 'Sejarah',
    rating: 4.6,
    reviews: 45,
    available: true,
  },
  {
    id: '13',
    name: 'Lisa Purnama, M.Hum.',
    subject: 'Sejarah Eropa & Perang Dunia',
    category: 'Sejarah',
    rating: 4.5,
    reviews: 38,
    available: true,
  },
];

export default function TutorListScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTutors = TUTORS.filter(tutor =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTutorPress = (id: string) => {
    router.push('/TutorProfileScreen' as any);
  };

  const renderTutorCard = ({ item }: { item: typeof TUTORS[0] }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={() => handleTutorPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.avatarBg }]}>
          <Ionicons name="person" size={24} color="#FFF" />
          {item.available && <View style={styles.onlineDot} />}
        </View>
        
        <View style={[styles.badgeContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="sparkles" size={12} color={colors.primary} />
          <Text style={[styles.badgeText, { color: colors.primary }]}>AI RECOMMENDED</Text>
        </View>
      </View>
      
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.subject, { color: colors.textSecondary }]}>{item.subject}</Text>

      <View style={styles.categoryRow}>
        <View style={[styles.categoryPill, { backgroundColor: colors.border }]}>
          <Text style={[styles.categoryPillText, { color: colors.textSecondary }]}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.footerRow}>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
          <Text style={[styles.reviewText, { color: colors.textSecondary }]}>({item.reviews})</Text>
        </View>
        <Text style={[
          styles.availabilityText, 
          !item.available && styles.unavailableText,
          { color: item.available ? colors.primary : colors.textSecondary }
        ]}>
          {item.available ? "Tersedia Sekarang" : "Jadwal Penuh"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tutor Rekomendasi AI</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Cari nama tutor atau mata kuliah..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredTutors.length} tutor ditemukan
        </Text>
      </View>

      {/* Tutor List */}
      <FlatList 
        data={filteredTutors}
        keyExtractor={(item) => item.id}
        renderItem={renderTutorCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Tidak Ditemukan</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Coba kata kunci lain untuk menemukan tutor.</Text>
          </View>
        }
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#111827',
  },
  resultsRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#6B7280',
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  unavailableText: {
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
