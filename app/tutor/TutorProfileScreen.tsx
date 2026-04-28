import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function TutorProfileScreen() {
  const router = useRouter();
  const { profileData, updateProfile, clearProfile } = useProfile();
  const { colors, isDark } = useTheme();

  const user = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");

  const handleLogout = () => {
    Alert.alert(
      "Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Keluar", 
          style: "destructive",
          onPress: () => {
            clearProfile();
            router.replace('/login' as any);
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {profileData?.profileImage ? (
                <Image source={{ uri: profileData.profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={40} color="#FFFFFF" />
              )}
            </View>
            <View style={[styles.roleBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.roleBadgeText}>TUTOR</Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{profileData?.name || 'Tutor'}</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{profileData?.email || ''}</Text>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sesi</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Siswa</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>5.0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/tutor/EditProfileScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuText, { color: colors.text }]}>Edit Profil</Text>
              <Text style={[styles.menuSubText, { color: colors.textMuted }]}>Nama, Foto, Bio & Keahlian</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/tutor/SubjectsScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: colors.successLight }]}>
              <Ionicons name="book-outline" size={20} color={colors.success} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuText, { color: colors.text }]}>Subjek Saya</Text>
              <Text style={[styles.menuSubText, { color: colors.textMuted }]}>Kelola mata pelajaran yang diajar</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/tutor/AvailabilityScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="time-outline" size={20} color="#EA580C" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuText, { color: colors.text }]}>Ketersediaan</Text>
              <Text style={[styles.menuSubText, { color: colors.textMuted }]}>Atur jadwal jam mengajar Anda</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/tutor/SettingsScreen' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: colors.surfaceHover }]}>
              <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuText, { color: colors.text }]}>Pengaturan</Text>
              <Text style={[styles.menuSubText, { color: colors.textMuted }]}>Notifikasi, Keamanan & Akun</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* About EduPartner Section (Matches Learner Style) */}
        <View style={styles.aboutSectionWrapper}>
           <Text style={[styles.sectionTitleLabel, { color: colors.textSecondary }]}>Lainnya</Text>
           <View style={[styles.aboutCardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity 
                style={styles.aboutMenuItem}
                onPress={() => router.push('/about' as any)}
              >
                 <View style={[styles.aboutIconBg, { backgroundColor: colors.background }]}>
                    <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
                 </View>
                 <View style={styles.aboutTextCol}>
                    <Text style={[styles.aboutItemTitle, { color: colors.text }]}>Tentang EduPartner AI</Text>
                    <Text style={[styles.aboutItemSub, { color: colors.textMuted }]}>Versi 2.0.4 Premium</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
           </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.dangerLight }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Keluar Akun</Text>
        </TouchableOpacity>

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
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 48 : 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  menuSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  menuTextCol: {
    flex: 1,
  },
  menuSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  aboutSectionWrapper: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionTitleLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  aboutCardGroup: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  aboutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  aboutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  aboutTextCol: {
    flex: 1,
  },
  aboutItemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  aboutItemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
  },
});
