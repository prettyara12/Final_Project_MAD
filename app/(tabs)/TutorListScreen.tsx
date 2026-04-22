import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function TutorListScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Convex Integration
  const tutors = useQuery(api.tutors.getTutors);

  const filteredTutors = tutors?.filter(tutor => {
    const name = (tutor.user?.name || tutor.name || "").toLowerCase();
    const subjects = tutor.subjects ? tutor.subjects.join(' ') : (tutor.specialization || "");
    const search = searchQuery.toLowerCase();
    return name.includes(search) || subjects.toLowerCase().includes(search);
  });

  const handleTutorPress = (id: string) => {
    router.push({ pathname: '/TutorProfileScreen', params: { id } } as any);
  };

  const renderTutorCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={() => handleTutorPress(item._id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.avatarBg }]}>
          <Ionicons name="person" size={24} color="#FFF" />
          <View style={styles.onlineDot} />
        </View>
        
        <View style={[styles.badgeContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="sparkles" size={12} color={colors.primary} />
          <Text style={[styles.badgeText, { color: colors.primary }]}>AI RECOMMENDED</Text>
        </View>
      </View>
      
      <Text style={[styles.name, { color: colors.text }]}>{item.user?.name || item.name}</Text>
      <Text style={[styles.subject, { color: colors.textSecondary }]}>
        {item.subjects ? item.subjects.join(', ') : item.specialization}
      </Text>

      <View style={styles.categoryRow}>
        <View style={[styles.categoryPill, { backgroundColor: colors.border }]}>
          <Text style={[styles.categoryPillText, { color: colors.textSecondary }]}>
            {item.subjects ? item.subjects[0] : (item.specialization || "General")}
          </Text>
        </View>
      </View>
      
      <View style={styles.footerRow}>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating.toFixed(1)}</Text>
          <Text style={[styles.reviewText, { color: colors.textSecondary }]}> (48)</Text>
        </View>
        <Text style={[
          styles.availabilityText, 
          { color: colors.primary }
        ]}>
          Tersedia Sekarang
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
          {filteredTutors?.length || 0} tutor ditemukan
        </Text>
      </View>

      {/* Tutor List */}
      {!tutors ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      ) : (
        <FlatList 
          data={filteredTutors}
          keyExtractor={(item) => item._id}
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
      )}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  resultsRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
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
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subject: {
    fontSize: 13,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
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
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
  },
});
