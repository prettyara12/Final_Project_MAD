import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { useTutorSettings } from '../../context/TutorSettingsContext';
import { Ionicons } from '@expo/vector-icons';

// Components
import { RequestCard } from '../../components/RequestCard';
import { SessionCard } from '../../components/SessionCard';

export default function TutorDashboardScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors } = useTheme();
  const { autoAccept } = useTutorSettings();
  
  // Get Tutor's internal ID via email
  const user = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const tutorId = user?._id;

  // Fetch Requests and Sessions
  const pendingRequests = useQuery(api.sessions.getStudentRequests, tutorId ? { tutorId } : "skip");
  const upcomingSessions = useQuery(api.sessions.getTutorSessions, tutorId ? { tutorId } : "skip");

  // Mutations
  const acceptRequest = useMutation(api.sessions.acceptRequest);
  const rejectRequest = useMutation(api.sessions.rejectRequest);

  // Auto Accept Logic
  React.useEffect(() => {
    if (autoAccept && pendingRequests && pendingRequests.length > 0) {
      pendingRequests.forEach(req => {
        handleAccept(req._id);
      });
    }
  }, [autoAccept, pendingRequests]);

  const handleAccept = async (sessionId: any) => {
    try {
      const conversationId = await acceptRequest({ sessionId });
      Alert.alert("Success", "Berhasil menerima permintaan!");
      // Auto navigate to chat
      router.push(`/chat/${conversationId}` as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal memproses permintaan.");
    }
  };

  const handleReject = async (sessionId: any) => {
    try {
      await rejectRequest({ sessionId });
      Alert.alert("Success", "Permintaan ditolak.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Gagal memproses permintaan.");
    }
  };


  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Memuat Dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Halo, Tutor 👋</Text>
            <Text style={[styles.name, { color: colors.text }]}>{profileData.name}</Text>
          </View>
          <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.primaryLight }]}>
             <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Incoming Requests */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Permintaan Masuk</Text>
          {pendingRequests === undefined ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : pendingRequests.length === 0 ? (
            <View style={[styles.emptyStateContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.background }]}>
                 <Ionicons name="mail-open-outline" size={32} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum ada permintaan masuk</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Permintaan dari siswa akan muncul di sini</Text>
            </View>
          ) : (
            pendingRequests.map((req: any) => (
              <RequestCard 
                key={req._id}
                studentName={req.learner?.name || 'Siswa Tanpa Nama'}
                subject={req.subject}
                time={`${req.date} | ${req.time}`}
                onAccept={() => handleAccept(req._id)}
                onReject={() => handleReject(req._id)}
              />
            ))
          )}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sesi Mendatang</Text>
          {upcomingSessions === undefined ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : upcomingSessions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada sesi terjadwal.</Text>
          ) : (
            upcomingSessions.map((session: any) => (
              <SessionCard 
                key={session._id}
                title={session.subject}
                time={`${session.date} | ${session.time}`}
                tutor={session.learner?.name || 'Siswa'} // Reusing SessionCard but showing learner name
              />
            ))
          )}
        </View>
      </ScrollView>
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
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  }
});
