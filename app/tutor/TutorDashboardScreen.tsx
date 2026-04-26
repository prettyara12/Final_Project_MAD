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
import { Ionicons } from '@expo/vector-icons';

// Components
import { RequestCard } from '../../components/RequestCard';
import { SessionCard } from '../../components/SessionCard';

export default function TutorDashboardScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  
  // Get Tutor's internal ID via email
  const user = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const tutorId = user?._id;

  // Fetch Requests and Sessions
  const pendingRequests = useQuery(api.sessions.getStudentRequests, tutorId ? { tutorId } : "skip");
  const upcomingSessions = useQuery(api.sessions.getTutorSessions, tutorId ? { tutorId } : "skip");

  // Mutations
  const acceptRequest = useMutation(api.sessions.acceptRequest);
  const rejectRequest = useMutation(api.sessions.rejectRequest);

  const handleAccept = async (sessionId: any) => {
    try {
      await acceptRequest({ sessionId });
      Alert.alert("Success", "Berhasil menerima permintaan!");
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

  const handleLogout = () => {
    router.replace('/login' as any);
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, Tutor 👋</Text>
            <Text style={styles.name}>{profileData.name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
             <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Incoming Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permintaan Masuk</Text>
          {pendingRequests === undefined ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : pendingRequests.length === 0 ? (
            <Text style={styles.emptyText}>Tidak ada permintaan masuk saat ini.</Text>
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
          <Text style={styles.sectionTitle}>Sesi Mendatang</Text>
          {upcomingSessions === undefined ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : upcomingSessions.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada sesi terjadwal.</Text>
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
    paddingBottom: 40,
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
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
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
  }
});
