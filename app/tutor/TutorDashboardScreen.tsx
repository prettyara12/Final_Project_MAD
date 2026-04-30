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
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

// Components
import { RequestCard } from '../../components/RequestCard';
import { SessionCard } from '../../components/SessionCard';

export default function TutorDashboardScreen() {
  const router = useRouter();
  const { profileData } = useProfile();
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const { autoAccept } = useTutorSettings();
  
  // Get Tutor's internal ID via email
  const user = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const tutorId = user?._id;

  // Fetch Requests, Sessions, and Notifications
  const pendingRequests = useQuery(api.sessions.getStudentRequests, tutorId ? { tutorId } : "skip");
  const upcomingSessions = useQuery(api.sessions.getTutorSessions, tutorId ? { tutorId } : "skip");
  const notifications = useQuery(api.notifications.getNotifications, tutorId ? { userId: tutorId } : "skip");
  const unreadCount = notifications ? notifications.filter((n: any) => !n.read).length : 0;

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
      Alert.alert(t('berhasil'), t('accept_request_success'));
      // Auto navigate to chat
      router.push(`/chat/${conversationId}` as any);
    } catch (e) {
      console.error(e);
      Alert.alert(t('error'), t('process_request_error'));
    }
  };

  const handleReject = async (sessionId: any) => {
    try {
      await rejectRequest({ sessionId });
      Alert.alert(t('berhasil'), t('reject_request_success'));
    } catch (e) {
      console.error(e);
      Alert.alert(t('error'), t('process_request_error'));
    }
  };


  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>{t('loading_dashboard')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{t('tutor_greeting')}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{profileData.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.notifBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => router.push('/NotificationScreen' as any)}
            >
               <Ionicons name="notifications-outline" size={24} color={colors.primary} />
               {unreadCount > 0 && (
                 <View style={styles.notifBadgeCount}>
                   <Text style={styles.notifBadgeCountText}>{unreadCount}</Text>
                 </View>
               )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Incoming Requests */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('incoming_requests')}</Text>
          {pendingRequests === undefined ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : pendingRequests.length === 0 ? (
            <View style={[styles.emptyStateContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.background }]}>
                 <Ionicons name="mail-open-outline" size={32} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('no_incoming_requests')}</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>{t('student_requests_desc')}</Text>
            </View>
          ) : (
            pendingRequests.map((req: any) => (
              <RequestCard 
                key={req._id}
                studentName={req.learner?.name || t('student')}
                subject={t(`subject_${req.subject.toLowerCase().replace(/\s+/g, '_')}`)}
                time={`${req.date} | ${req.time}`}
                onAccept={() => handleAccept(req._id)}
                onReject={() => handleReject(req._id)}
              />
            ))
          )}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('upcoming_sessions')}</Text>
          {upcomingSessions === undefined ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : upcomingSessions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('no_scheduled_sessions')}</Text>
          ) : (
            upcomingSessions.map((session: any) => (
              <SessionCard 
                key={session._id}
                title={t(`subject_${session.subject.toLowerCase().replace(/\s+/g, '_')}`)}
                time={`${session.date} | ${session.time}`}
                tutor={session.learner?.name || t('student')} // Reusing SessionCard but showing learner name
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
    position: 'relative',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifBadgeCount: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
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
