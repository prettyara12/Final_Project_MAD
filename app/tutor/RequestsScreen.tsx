import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { RequestCard } from '../../components/RequestCard';

export default function RequestsScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors } = useTheme();
  
  const user = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  const tutorId = user?._id;

  const pendingRequests = useQuery(api.sessions.getStudentRequests, tutorId ? { tutorId } : "skip");

  const acceptRequest = useMutation(api.sessions.acceptRequest);
  const rejectRequest = useMutation(api.sessions.rejectRequest);

  const handleAccept = async (sessionId: any) => {
    try {
      const conversationId = await acceptRequest({ sessionId });
      Alert.alert("Berhasil", "Permintaan diterima!");
      router.push(`/chat/${conversationId}` as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal memproses permintaan.");
    }
  };

  const handleReject = async (sessionId: any) => {
    try {
      await rejectRequest({ sessionId });
      Alert.alert("Berhasil", "Permintaan ditolak.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal memproses permintaan.");
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <RequestCard
      studentName={item.learner?.name || 'Siswa'}
      subject={item.subject}
      time={`${item.date} | ${item.time}`}
      message={item.message}
      onAccept={() => handleAccept(item._id)}
      onReject={() => handleReject(item._id)}
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Permintaan Masuk</Text>
        <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{pendingRequests?.length || 0}</Text>
        </View>
      </View>

      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name="mail-open-outline" size={40} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum ada permintaan masuk</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Permintaan dari siswa akan muncul di sini</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  badge: {
    marginLeft: 12,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
