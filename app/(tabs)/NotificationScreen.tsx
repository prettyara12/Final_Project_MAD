import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';

// Helper to format timestamp
const formatTime = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
};

// Helper to get icon based on type
const getIconInfo = (type: string) => {
  switch (type) {
    case 'booking': return { name: 'calendar-outline', color: '#4F46E5', bg: '#EEF2FF' };
    case 'achievement': return { name: 'medal-outline', color: '#F59E0B', bg: '#FEF3C7' };
    case 'reminder': return { name: 'alarm-outline', color: '#EF4444', bg: '#FEF2F2' };
    default: return { name: 'notifications-outline', color: '#9333EA', bg: '#F3E8FF' };
  }
};

export default function NotificationScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profileData } = useProfile();

  // Convex Integration
  const user = useQuery(api.users.getUserByEmail, { email: profileData.email });
  const notifications = useQuery(api.notifications.getNotifications, 
    user ? { userId: user._id } : "skip"
  );
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const [silentMode, setSilentMode] = useState(false);

  const newNotifications = notifications?.filter(n => !n.read) || [];
  const oldNotifications = notifications?.filter(n => n.read) || [];

  const handleMarkAllRead = useCallback(async () => {
    if (!user) return;
    if (newNotifications.length === 0) {
      Alert.alert('Info', 'Tidak ada notifikasi baru untuk ditandai.');
      return;
    }
    try {
      await markAllAsRead({ userId: user._id });
      Alert.alert('Sukses', 'Semua notifikasi ditandai sebagai dibaca.');
    } catch (e) {
      Alert.alert('Error', 'Gagal memperbarui notifikasi.');
    }
  }, [user, newNotifications, markAllAsRead]);

  const handleToggleSilentMode = useCallback(() => {
    setSilentMode(prev => !prev);
  }, []);

  const handleNotifPress = useCallback(async (notif: any) => {
    if (!notif.read) {
      await markAsRead({ id: notif._id });
    }
    Alert.alert(notif.title, notif.description, [{ text: 'Tutup' }]);
  }, [markAsRead]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerLogoText, { color: colors.primary, marginLeft: 8 }]}>EduPartner AI</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => Alert.alert('Notifikasi', 'Kamu sedang berada di halaman notifikasi.')}
        >
          <Ionicons name="notifications" size={20} color={colors.primary} />
          {newNotifications.length > 0 && (
            <View style={styles.notifBadgeCount}>
              <Text style={styles.notifBadgeCountText}>{newNotifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Silent Mode Banner (when active) */}
      {silentMode && (
        <View style={styles.silentBanner}>
          <Ionicons name="volume-mute" size={16} color="#FFF" />
          <Text style={styles.silentBannerText}>Mode Senyap aktif — notifikasi dibisukan 2 jam</Text>
          <TouchableOpacity onPress={handleToggleSilentMode}>
            <Text style={styles.silentBannerOff}>Matikan</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Intro */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>Notifikasi</Text>
          <Text style={[styles.mainDesc, { color: colors.textSecondary }]}>
            Tetap terupdate dengan perjalanan belajar dan wawasan AI-mu.
          </Text>
        </View>

        {/* Filters/Actions */}
        <View style={styles.filterRow}>
           <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
             ALERT BARU {newNotifications.length > 0 ? `(${newNotifications.length})` : ''}
           </Text>
           <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.6}>
             <Text style={styles.markReadText}>Tandai semua telah dibaca</Text>
           </TouchableOpacity>
        </View>
        {/* New Notifications */}
        {newNotifications.length > 0 ? (
          <View style={styles.notifList}>
             {newNotifications.map(notif => {
               const iconInfo = getIconInfo(notif.type);
               return (
                <TouchableOpacity 
                  key={notif._id} 
                  style={[styles.cardUnread, { backgroundColor: colors.card, borderColor: colors.border }]}
                  activeOpacity={0.7}
                  onPress={() => handleNotifPress(notif)}
                >
                   <View style={styles.cardHeaderRow}>
                      <View style={[styles.iconBox, { backgroundColor: iconInfo.bg }]}>
                         <Ionicons name={iconInfo.name as any} size={20} color={iconInfo.color} />
                      </View>
                      
                      <View style={styles.cardTitleContainer}>
                         <Text style={[styles.cardTitle, { color: colors.text }]}>{notif.title}</Text>
                      </View>
                      
                      <Text style={[styles.cardTimestamp, { color: colors.textSecondary }]}>
                        {formatTime(notif.createdAt)}
                      </Text>
                   </View>

                   <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                      {notif.description}
                   </Text>
                </TouchableOpacity>
               );
             })}
          </View>
        ) : (
          <View style={styles.emptyNewBox}>
            <Ionicons name="checkmark-done-circle-outline" size={40} color="#10B981" />
            <Text style={[styles.emptyNewText, { color: colors.text }]}>Semua notifikasi telah dibaca! 🎉</Text>
            <Text style={[styles.emptyNewSubtext, { color: colors.textSecondary }]}>Tidak ada alert baru saat ini.</Text>
          </View>
        )}

        {/* Previous Label */}
        {oldNotifications.length > 0 && (
          <Text style={[styles.kemarinLabel, { color: colors.textSecondary }]}>SEBELUMNYA</Text>
        )}

        {/* Old Notifications */}
        <View style={styles.notifList}>
           {oldNotifications.map(notif => {
             const iconInfo = getIconInfo(notif.type);
             return (
              <TouchableOpacity 
                key={notif._id} 
                style={[styles.cardRead, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                activeOpacity={0.7}
                onPress={() => handleNotifPress(notif)}
              >
                 <View style={styles.cardHeaderRow}>
                    <View style={[styles.iconBoxRead, { backgroundColor: colors.border + '40' }]}>
                       <Ionicons name={iconInfo.name as any} size={18} color={colors.textSecondary} />
                    </View>
                    
                    <View style={styles.cardTitleContainer}>
                       <Text style={[styles.cardTitleRead, { color: colors.textSecondary }]}>{notif.title}</Text>
                    </View>
                    <Text style={[styles.cardTimestamp, { color: colors.textSecondary, fontSize: 9 }]}>
                      {formatTime(notif.createdAt)}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                 </View>
                 <Text style={[styles.cardDescRead, { color: colors.textSecondary }]}>{notif.description}</Text>
              </TouchableOpacity>
             );
           })}
        </View>

        {/* Silent Mode / Deep Work Card */}
        <View style={[
          styles.silentModeCard, 
          { backgroundColor: colors.card, borderColor: colors.border },
          silentMode && styles.silentModeCardActive
        ]}>
           <View style={styles.silentHeaderRow}>
             <View>
               <Text style={[styles.silentModeTitle, { color: colors.text }]}>Mode Senyap</Text>
               <Text style={[styles.silentModeDesc, { color: colors.textSecondary }]}>
                 {silentMode 
                   ? 'Mode senyap sedang aktif. Semua notifikasi dibisukan selama 2 jam.'
                   : 'Bisukan semua notifikasi selama 2 jam ke depan untuk masuk ke Deep Work.'
                 }
               </Text>
             </View>
           </View>
           <TouchableOpacity 
             style={[styles.silentModeBtn, silentMode && styles.silentModeBtnActive]}
             onPress={handleToggleSilentMode}
             activeOpacity={0.7}
           >
              <Ionicons 
                name={silentMode ? 'volume-high' : 'volume-mute'} 
                size={16} 
                color={silentMode ? '#FFF' : colors.primary} 
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.silentModeBtnText, silentMode && styles.silentModeBtnTextActive]}>
                {silentMode ? 'Matikan Mode Senyap' : 'Aktifkan Fokus'}
              </Text>
           </TouchableOpacity>
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
    position: 'relative',
  },
  notifBadgeCount: {
    position: 'absolute',
    top: 2,
    right: 2,
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
  silentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  silentBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  silentBannerOff: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  mainDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  notifList: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  cardUnread: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  cardRead: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  iconBoxRead: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  cardTitleRead: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  cardBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  cardBadgeUrgent: {
    backgroundColor: '#FEF2F2',
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  cardBadgeTextUrgent: {
    color: '#DC2626',
  },
  cardTimestamp: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginLeft: 48,
  },
  cardDescRead: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 48,
  },
  italicDesc: {
    fontStyle: 'italic',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 48,
    marginTop: 16,
    gap: 12,
  },
  primaryActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  primaryActionDark: {
    backgroundColor: '#4F46E5',
  },
  primaryActionLight: {
    backgroundColor: '#FAF5FF',
  },
  primaryActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyNewBox: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emptyNewText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  emptyNewSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  kemarinLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  silentModeCard: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    marginTop: 12,
  },
  silentModeCardActive: {
    backgroundColor: '#1E1B4B',
  },
  silentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  silentModeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  silentModeDesc: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 20,
    marginBottom: 20,
  },
  silentModeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  silentModeBtnActive: {
    backgroundColor: '#EF4444',
  },
  silentModeBtnText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '800',
  },
  silentModeBtnTextActive: {
    color: '#FFF',
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  }
});
