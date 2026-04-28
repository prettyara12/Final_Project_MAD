import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Modal,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../context/ProfileContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const { profileData, updateProfile: updateLocalProfile, clearProfile } = useProfile();
  
  // Convex Integration
  const userQuery = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  const currentUser = userQuery;

  const notifications = useQuery(api.notifications.getNotifications, currentUser?._id ? { userId: currentUser._id } : "skip");
  const unreadCount = notifications ? notifications.filter((n: any) => !n.read).length : 0;
  const updateBackendProfile = useMutation(api.users.updateUser);

  // Modal states
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [securityVisible, setSecurityVisible] = useState(false);

  // Local state for modal editing
  const [localDraft, setLocalDraft] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    university: '',
    major: '',
    year: '',
  });

  useEffect(() => {
    if (personalInfoVisible) {
      setLocalDraft({
        name: currentUser?.name || profileData.name,
        email: currentUser?.email || profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        university: currentUser?.university || profileData.university,
        major: currentUser?.major || profileData.major,
        year: profileData.year,
      });
    }
  }, [personalInfoVisible, currentUser, profileData]);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      updateLocalProfile({ profileImage: base64Image });
      if (currentUser) {
        try {
          await updateBackendProfile({ id: currentUser._id, profileImage: base64Image });
          Alert.alert("✅ Berhasil", "Foto profil berhasil diubah!");
        } catch (e) {
          Alert.alert("Error", "Gagal menyimpan foto ke server.");
        }
      } else {
        Alert.alert("✅ Berhasil", "Foto profil berhasil diubah!");
      }
    }
  };


  // Security and Theme States
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleLogout = useCallback(() => {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: 'cancel' },
      { text: "Keluar", style: 'destructive', onPress: () => {
        clearProfile();
        router.replace('/login' as any);
      } }
    ]);
  }, [router, clearProfile]);

  const handleSavePersonalInfo = async () => {
    if (!currentUser) {
      updateLocalProfile(localDraft);
      setPersonalInfoVisible(false);
      Alert.alert('✅ Tersimpan', 'Profil lokal diperbarui (User belum terdaftar di database).');
      return;
    }
    try {
      await updateBackendProfile({
        id: currentUser._id,
        name: localDraft.name,
        university: localDraft.university,
        major: localDraft.major,
      });
      updateLocalProfile(localDraft);
      setPersonalInfoVisible(false);
      Alert.alert('✅ Tersimpan', 'Profil berhasil diperbarui.');
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui profil.');
    }
  };

  // Tampilkan loading HANYA jika query sedang loading (undefined)
  // Jika query selesai dan hasilnya null (user tidak ada), kita lanjut menampilkan desain awal dengan data dummy/context
  if (currentUser === undefined) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // Gunakan data dari database jika ada, jika tidak gunakan dari context
  const displayUser = currentUser ? {
    ...currentUser,
    role: currentUser.role || 'learner'
  } : {
    name: profileData.name,
    role: 'learner',
    university: profileData.university,
    major: profileData.major
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Decorative Background Element */}
      <View style={[styles.bgDecoration, { backgroundColor: colors.primaryLight, opacity: isDark ? 0.05 : 0.2 }]} />

      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card }]}>
             <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerLogoText, { color: colors.text, marginLeft: 12 }]}>Profil Saya</Text>
        </View>
        <TouchableOpacity 
          style={[styles.notificationBtn, { backgroundColor: colors.card }]}
          onPress={() => router.push('/NotificationScreen' as any)}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          {unreadCount > 0 && (
            <View style={[styles.notifBadge, { borderColor: colors.card }]}>
               <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Info Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, shadowColor: colors.primary }]}>
           <View style={styles.avatarContainer}>
              <View style={[styles.avatarRing, { borderColor: colors.primary + '30' }]}>
                 <View style={[styles.mainAvatarBox, { backgroundColor: colors.avatarBg }]}>
                    {profileData.profileImage ? (
                      <Image source={{ uri: profileData.profileImage }} style={styles.avatarImageLarge} />
                    ) : (
                      <Ionicons name="person" size={50} color="#FFF" />
                    )}
                 </View>
              </View>
              <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.primary }]} onPress={handlePickImage}>
                 <Ionicons name="camera" size={14} color="#FFF" />
              </TouchableOpacity>
           </View>

           <Text style={[styles.profileName, { color: colors.text }]}>{displayUser.name}</Text>
           <View style={[styles.rolePill, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.rolePillText, { color: colors.primary }]}>{displayUser.role.toUpperCase()}</Text>
           </View>
           
           <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.profileSubtext, { color: colors.textSecondary }]}>{displayUser.university}</Text>
           </View>
           <View style={[styles.infoRow, { marginTop: 4 }]}>
              <Ionicons name="book-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.profileSubtext, { color: colors.textSecondary }]}>{displayUser.major}</Text>
           </View>
        </View>

        {/* Quick Actions / Theme */}
        <View style={styles.sectionWrapper}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.textSecondary }]}>Preferensi</Text>
           <View style={[styles.menuCardGroup, { backgroundColor: colors.card }]}>
              <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                 <View style={styles.toggleRowLeft}>
                    <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                       <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={isDark ? '#FBBF24' : '#F59E0B'} />
                    </View>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Mode Gelap</Text>
                 </View>
                 <Switch 
                   value={isDark} 
                   onValueChange={toggleTheme}
                   trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }}
                   thumbColor={isDark ? colors.primary : '#FFF'}
                 />
              </View>
           </View>
        </View>

        {/* Account Settings */}
        <View style={styles.sectionWrapper}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.textSecondary }]}>Pengaturan Akun</Text>
           <View style={[styles.menuCardGroup, { backgroundColor: colors.card }]}>
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setPersonalInfoVisible(true)}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="person-outline" size={20} color={colors.primary} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Informasi Pribadi</Text>
                    <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>Nama, Universitas, Jurusan</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setSecurityVisible(true)}>
                 <View style={[styles.menuIconBg, { backgroundColor: '#E0E7FF' }]}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#4F46E5" />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Keamanan & Privasi</Text>
                    <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>2FA, Biometrik</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                 <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>Keluar Akun</Text>
                    <Text style={[styles.menuItemSub, { color: '#FCA5A5' }]}>Sesi Anda akan berakhir</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
              </TouchableOpacity>
           </View>
        </View>

        {/* About App */}
        <View style={[styles.sectionWrapper, { marginBottom: 40 }]}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.textSecondary }]}>Lainnya</Text>
           <View style={[styles.menuCardGroup, { backgroundColor: colors.card }]}>
              <TouchableOpacity 
                style={[styles.menuItem, { borderBottomWidth: 0 }]}
                onPress={() => router.push('/about' as any)}
              >
                 <View style={[styles.menuIconBg, { backgroundColor: '#F3F4F6' }]}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Tentang EduPartner AI</Text>
                    <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>Versi 2.0.4</Text>
                 </View>
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>

      {/* Modern Personal Info Modal */}
      <Modal visible={personalInfoVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Informasi Pribadi</Text>
              <TouchableOpacity onPress={() => setPersonalInfoVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>Nama Lengkap</Text>
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
                  value={localDraft.name} 
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, name: v }))} 
                />
              </View>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>Universitas</Text>
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
                  value={localDraft.university} 
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, university: v }))} 
                />
              </View>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>Jurusan</Text>
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
                  value={localDraft.major} 
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, major: v }))} 
                />
              </View>
              <TouchableOpacity style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]} onPress={handleSavePersonalInfo}>
                <Text style={styles.modalSaveBtnText}>Simpan Perubahan</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modern Security Modal */}
      <Modal visible={securityVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Keamanan</Text>
              <TouchableOpacity onPress={() => setSecurityVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.securityModalContent}>
              <View style={[styles.securityItem, { borderBottomColor: colors.border }]}>
                 <View style={styles.securityItemLeft}>
                    <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
                    <View style={{ marginLeft: 16 }}>
                       <Text style={[styles.menuItemTitle, { color: colors.text }]}>Autentikasi 2 Faktor</Text>
                       <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>Keamanan ekstra untuk akun Anda</Text>
                    </View>
                 </View>
                 <Switch value={twoFAEnabled} onValueChange={setTwoFAEnabled} trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }} />
              </View>
              <View style={styles.securityItem}>
                 <View style={styles.securityItemLeft}>
                    <Ionicons name="finger-print" size={22} color={colors.primary} />
                    <View style={{ marginLeft: 16 }}>
                       <Text style={[styles.menuItemTitle, { color: colors.text }]}>Login Biometrik</Text>
                       <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>Masuk cepat dengan sidik jari/wajah</Text>
                    </View>
                 </View>
                 <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  bgDecoration: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerLogoText: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  notifBadgeText: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40, paddingTop: 10 },
  profileCard: { 
    marginHorizontal: 20, 
    borderRadius: 32, 
    padding: 24, 
    alignItems: 'center', 
    marginBottom: 32, 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 20, 
    elevation: 5 
  },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatarRing: { padding: 6, borderRadius: 65, borderWidth: 1.5, borderStyle: 'dashed' },
  mainAvatarBox: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImageLarge: { width: '100%', height: '100%' },
  editBadge: { position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  profileName: { fontSize: 26, fontWeight: '900', marginBottom: 8, letterSpacing: -0.5 },
  rolePill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  rolePillText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileSubtext: { fontSize: 14, fontWeight: '500' },
  sectionWrapper: { paddingHorizontal: 20, marginBottom: 28 },
  sectionHeaderTitle: { fontSize: 14, fontWeight: '800', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 },
  menuCardGroup: { borderRadius: 28, paddingHorizontal: 16, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  toggleRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, gap: 14 },
  menuIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  menuTextCol: { flex: 1 },
  menuItemTitle: { fontSize: 15, fontWeight: '700' },
  menuItemSub: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 30, maxHeight: '90%' },
  modalHandle: { width: 40, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  modalTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  modalField: { marginBottom: 20 },
  modalFieldLabel: { fontSize: 13, fontWeight: '800', marginBottom: 8, marginLeft: 4 },
  modalInput: { borderRadius: 18, paddingHorizontal: 18, paddingVertical: 16, fontSize: 15, borderWidth: 1, fontWeight: '500' },
  modalSaveBtn: { borderRadius: 24, paddingVertical: 18, alignItems: 'center', marginTop: 12, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 4 },
  modalSaveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  securityModalContent: { paddingBottom: 20 },
  securityItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1 },
  securityItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
});
