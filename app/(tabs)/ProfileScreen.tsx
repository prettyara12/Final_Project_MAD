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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../context/ProfileContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const { profileData, updateProfile: updateLocalProfile } = useProfile();
  
  // Convex Integration
  const currentUser = useQuery(api.users.getUserByEmail, { email: profileData.email });
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

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleLogout = useCallback(() => {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: 'cancel' },
      { text: "Keluar", style: 'destructive', onPress: () => router.push('/OnboardingScreen' as any) }
    ]);
  }, [router]);

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
  const displayUser = currentUser || {
    name: profileData.name,
    role: 'learner',
    university: profileData.university,
    major: profileData.major
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.avatarMini, { backgroundColor: colors.avatarBg }]}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
          <Text style={[styles.headerLogoText, { color: colors.primary }]}>EduPartner AI</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
           <View style={styles.avatarContainer}>
              <View style={[styles.avatarRing, { borderColor: colors.primaryLighter }]}>
                 <View style={[styles.mainAvatarBox, { backgroundColor: colors.avatarBg }]}>
                    <Ionicons name="person" size={48} color="#FFF" />
                 </View>
              </View>
              <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                 <Ionicons name="pencil" size={12} color="#FFF" />
              </TouchableOpacity>
           </View>

           <Text style={[styles.profileName, { color: colors.text }]}>{displayUser.name}</Text>
           <View style={[styles.rolePill, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.rolePillText, { color: colors.primary }]}>{displayUser.role.toUpperCase()}</Text>
           </View>
           
           <Text style={[styles.profileSubtext, { color: colors.textSecondary }]}>{displayUser.university}</Text>
           <Text style={[styles.profileSubtext, { color: colors.textSecondary, marginTop: -12 }]}>{displayUser.major}</Text>

           <TouchableOpacity style={[styles.proButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.proButtonText}>Tingkatkan ke Pro</Text>
           </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.pulseCard, { backgroundColor: colors.card }]} onPress={() => router.push('/ProgressScreen' as any)}>
           <View style={styles.cardHeaderRow}>
              <Ionicons name="trending-up" size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Denyut Belajar</Text>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
           </View>
           <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Lihat progres belajarmu di sini.</Text>
        </TouchableOpacity>

        <View style={styles.sectionWrapper}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>Beralih Cepat</Text>
           <View style={[styles.toggleCardGroup, { backgroundColor: colors.background }]}>
              <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                 <TouchableOpacity style={styles.toggleRowLeft} onPress={toggleTheme}>
                    <View style={[styles.toggleIconBoxAlt, { backgroundColor: isDark ? '#7C3AED' : '#EBE2FF' }]}>
                       <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? '#FFF' : '#7C3AED'} />
                    </View>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>Tema {isDark ? 'Gelap' : 'Terang'}</Text>
                 </TouchableOpacity>
                 <Switch value={isDark} onValueChange={toggleTheme} />
              </View>
           </View>
        </View>

        <View style={styles.sectionWrapper}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>Pengaturan Akun</Text>
           <View style={[styles.menuCardGroup, { backgroundColor: colors.card }]}>
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setPersonalInfoVisible(true)}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="person" size={18} color={colors.primary} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Informasi Pribadi</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setSecurityVisible(true)}>
                 <View style={[styles.menuIconBg, { backgroundColor: '#EBE2FF' }]}>
                    <Ionicons name="lock-closed" size={18} color="#7C3AED" />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Keamanan & Privasi</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                 <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="log-out" size={18} color="#EF4444" />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>Keluar</Text>
                 </View>
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>

      <Modal visible={personalInfoVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Informasi Pribadi</Text>
              <TouchableOpacity onPress={() => setPersonalInfoVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>Nama Lengkap</Text>
                <TextInput style={[styles.modalInput, { borderColor: colors.border, color: colors.text }]} value={localDraft.name} onChangeText={(v) => setLocalDraft(p => ({ ...p, name: v }))} />
              </View>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>Universitas</Text>
                <TextInput style={[styles.modalInput, { borderColor: colors.border, color: colors.text }]} value={localDraft.university} onChangeText={(v) => setLocalDraft(p => ({ ...p, university: v }))} />
              </View>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>Jurusan</Text>
                <TextInput style={[styles.modalInput, { borderColor: colors.border, color: colors.text }]} value={localDraft.major} onChangeText={(v) => setLocalDraft(p => ({ ...p, major: v }))} />
              </View>
              <TouchableOpacity style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]} onPress={handleSavePersonalInfo}>
                <Text style={styles.modalSaveBtnText}>Simpan Perubahan</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={securityVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Keamanan & Privasi</Text>
              <TouchableOpacity onPress={() => setSecurityVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                 <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
                 <Text style={[styles.menuItemTitle, { color: colors.text, flex: 1, marginLeft: 12 }]}>Autentikasi 2 Faktor</Text>
                 <Switch value={twoFAEnabled} onValueChange={setTwoFAEnabled} />
              </View>
              <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                 <Ionicons name="finger-print" size={18} color={colors.primary} />
                 <Text style={[styles.menuItemTitle, { color: colors.text, flex: 1, marginLeft: 12 }]}>Login Biometrik</Text>
                 <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 10, padding: 4 },
  avatarMini: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  headerLogoText: { fontSize: 16, fontWeight: '700' },
  notificationBtn: { padding: 8 },
  scrollContent: { paddingBottom: 30 },
  profileCard: { marginHorizontal: 20, borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 24, elevation: 3 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarRing: { padding: 4, borderRadius: 60, borderWidth: 2 },
  mainAvatarBox: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  profileName: { fontSize: 24, fontWeight: '900', marginBottom: 6 },
  rolePill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  rolePillText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  profileSubtext: { fontSize: 13, marginBottom: 16 },
  proButton: { width: '100%', paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  proButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  pulseCard: { marginHorizontal: 20, borderRadius: 32, padding: 24, marginBottom: 24 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  sectionWrapper: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeaderTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  toggleCardGroup: { borderRadius: 24, paddingHorizontal: 20 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  toggleRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIconBoxAlt: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  toggleLabel: { fontSize: 13, fontWeight: '600' },
  menuCardGroup: { borderRadius: 32, paddingHorizontal: 20, paddingVertical: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
  menuIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuTextCol: { flex: 1 },
  menuItemTitle: { fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalField: { marginBottom: 16 },
  modalFieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  modalInput: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, borderWidth: 1 },
  modalSaveBtn: { borderRadius: 20, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  modalSaveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
