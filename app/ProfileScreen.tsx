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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomTabBar } from '../components/BottomTabBar';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const { profileData, updateProfile } = useProfile();
  
  // Modal states
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [securityVisible, setSecurityVisible] = useState(false);
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);

  // Local state for modal editing (draft)
  const [localDraft, setLocalDraft] = useState(profileData);

  // Sync draft when modal opens or profile changes
  useEffect(() => {
    if (personalInfoVisible) {
      setLocalDraft(profileData);
    }
  }, [personalInfoVisible, profileData]);

  // Security state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: 'cancel' },
        { text: "Keluar", style: 'destructive', onPress: () => router.push('/OnboardingScreen' as any) }
      ]
    );
  }, [router]);

  // Edit profile photo
  const handleEditPhoto = useCallback(() => {
    Alert.alert(
      '📸 Ubah Foto Profil',
      'Pilih sumber foto untuk profil kamu:',
      [
        { text: 'Batal', style: 'cancel' },
        { text: '📷 Kamera', onPress: () => Alert.alert('Kamera', 'Fitur kamera akan segera tersedia dalam pembaruan mendatang.') },
        { text: '🖼️ Galeri', onPress: () => Alert.alert('Galeri', 'Fitur galeri akan segera tersedia dalam pembaruan mendatang.') },
      ]
    );
  }, []);

  // Upgrade to Pro
  const handleUpgradePro = useCallback(() => {
    Alert.alert(
      '⭐ Tingkatkan ke EduPartner Pro',
      'Dapatkan akses premium:\n\n'
      + '✅ Sesi bimbingan tak terbatas\n'
      + '✅ AI tutor personal 24/7\n'
      + '✅ Analitik belajar mendalam\n'
      + '✅ Prioritas pencocokan tutor\n'
      + '✅ Sertifikat kelulusan\n\n'
      + '💰 Rp 99.000/bulan atau Rp 899.000/tahun',
      [
        { text: 'Nanti Saja', style: 'cancel' },
        { text: 'Mulai Uji Coba Gratis', onPress: () => {
          Alert.alert('🎉 Berhasil!', 'Uji coba gratis 14 hari Pro telah diaktifkan!\nNikmati semua fitur premium.');
        }},
      ]
    );
  }, []);


  // Toggle Dark Mode — uses global theme context
  const handleToggleDarkMode = useCallback(() => {
    toggleTheme();
    // No Alert so the visual change is the feedback itself
  }, [toggleTheme]);

  // Stats pill press
  const handleStatPress = useCallback((type: string) => {
    if (type === 'rating') {
      Alert.alert(
        '⭐ Detail Peringkat',
        'Peringkat kamu: 4.9/5.0\n\n📊 Berdasarkan:\n• 15 sesi yang diselesaikan\n• 12 ulasan dari tutor\n• Tingkat kehadiran 98%\n• Tingkat penyelesaian tugas 95%',
        [{ text: 'Keren!' }]
      );
    } else {
      Alert.alert(
        '🔥 Detail Beruntun',
        'Beruntun saat ini: 12 hari\n\n📅 Rekap:\n• Beruntun terlama: 18 hari\n• Total hari aktif: 45 hari\n• Rata-rata sesi/hari: 2.3\n\nPertahankan momentummu!',
        [{ text: 'Semangat!' }]
      );
    }
  }, []);

  // Learning pulse card press
  const handlePulsePress = useCallback(() => {
    router.push('/ProgressScreen' as any);
  }, [router]);

  // Personal info save
  const handleSavePersonalInfo = useCallback(() => {
    updateProfile(localDraft);
    Alert.alert('✅ Tersimpan', 'Informasi pribadi berhasil diperbarui.', [
      { text: 'Oke', onPress: () => setPersonalInfoVisible(false) }
    ]);
  }, [localDraft, updateProfile]);

  // Security actions
  const handleChangePassword = useCallback(() => {
    Alert.alert(
      '🔐 Ubah Kata Sandi',
      'Link reset kata sandi telah dikirim ke email:\njulian.aris@university.ac.id\n\nSilakan cek inbox atau folder spam.',
      [{ text: 'Mengerti' }]
    );
  }, []);

  const handleToggle2FA = useCallback(() => {
    const newState = !twoFAEnabled;
    setTwoFAEnabled(newState);
    if (newState) {
      Alert.alert('🔒 2FA Diaktifkan', 'Autentikasi dua faktor berhasil diaktifkan.\nKode verifikasi akan dikirim via SMS setiap login.');
    } else {
      Alert.alert('⚠️ 2FA Dinonaktifkan', 'Autentikasi dua faktor telah dinonaktifkan.\nAkunmu mungkin kurang aman.');
    }
  }, [twoFAEnabled]);

  const handleToggleBiometric = useCallback(() => {
    const newState = !biometricEnabled;
    setBiometricEnabled(newState);
    Alert.alert(
      newState ? '👆 Biometrik Aktif' : 'Biometrik Nonaktif',
      newState 
        ? 'Login dengan sidik jari atau Face ID telah diaktifkan.'
        : 'Login biometrik telah dinonaktifkan.',
    );
  }, [biometricEnabled]);

  // Role pill press
  const handleRolePress = useCallback(() => {
    Alert.alert(
      '🎓 Status Akun',
      `Nama: ${profileData.name}\nPeran: Pelajar\nUniversitas: ${profileData.university}\nJurusan: ${profileData.major}\nTahun: ${profileData.year}\n\nBergabung sejak: Januari 2024`,
      [{ text: 'Tutup' }]
    );
  }, [profileData]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
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
        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/NotificationScreen' as any)}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
           {/* Avatar Area */}
           <View style={styles.avatarContainer}>
              <View style={[styles.avatarRing, { borderColor: colors.primaryLighter }]}>
                 <View style={[styles.mainAvatarBox, { backgroundColor: colors.avatarBg }]}>
                    <Ionicons name="person" size={48} color="#FFF" />
                 </View>
              </View>
              <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.primary }]} onPress={handleEditPhoto} activeOpacity={0.7}>
                 <Ionicons name="pencil" size={12} color="#FFF" />
              </TouchableOpacity>
           </View>

           {/* Info Area */}
           <Text style={[styles.profileName, { color: colors.text }]}>{profileData.name}</Text>
           <TouchableOpacity onPress={handleRolePress} activeOpacity={0.7}>
              <View style={[styles.rolePill, { backgroundColor: colors.primaryLight }]}>
                 <Text style={[styles.rolePillText, { color: colors.primary }]}>
                   PELAJAR
                 </Text>
              </View>
           </TouchableOpacity>
           
           <Text style={[styles.profileSubtext, { color: colors.textSecondary }]}>{profileData.major} • {profileData.year}</Text>
           
           {/* Stats Pills */}
           <View style={styles.statsRow}>
              <TouchableOpacity style={[styles.statPill, { backgroundColor: colors.surfaceHover }]} onPress={() => handleStatPress('rating')} activeOpacity={0.7}>
                 <Ionicons name="star" size={12} color={colors.accent} />
                 <Text style={[styles.statPillText, { color: colors.text }]}>Peringkat 4.9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statPill, { backgroundColor: colors.surfaceHover }]} onPress={() => handleStatPress('streak')} activeOpacity={0.7}>
                 <Ionicons name="flash" size={12} color={colors.primary} />
                 <Text style={[styles.statPillText, { color: colors.text }]}>12 Beruntun</Text>
              </TouchableOpacity>
           </View>

           {/* Action Button */}
           <TouchableOpacity style={[styles.proButton, { backgroundColor: colors.primary }]} onPress={handleUpgradePro} activeOpacity={0.7}>
              <Text style={styles.proButtonText}>Tingkatkan ke Pro</Text>
           </TouchableOpacity>
        </View>

        {/* Learning Pulse (Denyut Belajar) Card */}
        <TouchableOpacity style={[styles.pulseCard, { backgroundColor: colors.card }]} onPress={handlePulsePress} activeOpacity={0.8}>
           <View style={styles.cardHeaderRow}>
              <Ionicons name="trending-up" size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Denyut Belajar</Text>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
           </View>

           {/* List of Progress */}
           <View style={styles.progressItem}>
              <View style={styles.progressTextRow}>
                 <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Algoritma Lanjutan</Text>
                 <Text style={[styles.progressPercent, { color: colors.primary }]}>85% Selesai</Text>
              </View>
              <View style={[styles.progBarBg, { backgroundColor: colors.surfaceHover }]}>
                 <View style={[styles.progBarFill, { width: '85%', backgroundColor: colors.primary }]} />
              </View>
           </View>

           <View style={styles.progressItem}>
              <View style={styles.progressTextRow}>
                 <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Jaringan Saraf</Text>
                 <Text style={[styles.progressPercentAlt, { color: colors.accent }]}>42% Selesai</Text>
              </View>
              <View style={[styles.progBarBg, { backgroundColor: colors.surfaceHover }]}>
                 <View style={[styles.progBarFill, { width: '42%', backgroundColor: colors.accent }]} />
              </View>
           </View>

           <View style={[styles.targetRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.targetItalicText, { color: colors.textTertiary }]}>Target berikutnya: Pakar Neural</Text>
              <Ionicons name="trophy" size={20} color={colors.accent} />
           </View>
        </TouchableOpacity>

        {/* Quick Toggles (Beralih Cepat) */}
        <View style={styles.sectionWrapper}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>Beralih Cepat</Text>
           <View style={[styles.toggleCardGroup, { backgroundColor: colors.surfaceAlt }]}>
              

              <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                 <TouchableOpacity style={styles.toggleRowLeft} onPress={handleToggleDarkMode} activeOpacity={0.7}>
                    <View style={[styles.toggleIconBoxAlt, { backgroundColor: isDark ? '#7C3AED' : colors.accentLight }]}>
                       <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? '#FFF' : colors.accent} />
                    </View>
                    <View>
                      <Text style={[styles.toggleLabel, { color: colors.text }]}>Tema {isDark ? 'Gelap' : 'Terang'}</Text>
                      <Text style={[styles.toggleSublabel, { color: colors.textMuted }]}>
                        {isDark ? 'Nyaman untuk malam hari' : 'Mode siang hari aktif'}
                      </Text>
                    </View>
                 </TouchableOpacity>
                 <Switch 
                   trackColor={{ false: colors.borderAlt, true: colors.primary }}
                   thumbColor={"#FFFFFF"}
                   ios_backgroundColor={colors.borderAlt}
                   onValueChange={handleToggleDarkMode}
                   value={isDark}
                 />
              </View>

           </View>
        </View>

        {/* Account Settings Menu */}
        <View style={styles.sectionWrapper}>
           <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>Pengaturan Akun</Text>
           <View style={[styles.menuCardGroup, { backgroundColor: colors.card }]}>

              {/* Menu Item 1 - Personal Info */}
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setPersonalInfoVisible(true)} activeOpacity={0.6}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="person" size={18} color={colors.primary} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Informasi Pribadi</Text>
                    <Text style={[styles.menuItemSub, { color: colors.textTertiary }]}>Email, telepon, dan alamat</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Menu Item 2 - Security */}
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setSecurityVisible(true)} activeOpacity={0.6}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.accentLight }]}>
                    <Ionicons name="lock-closed" size={18} color={colors.accent} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Keamanan & Privasi</Text>
                    <Text style={[styles.menuItemSub, { color: colors.textTertiary }]}>Kata sandi dan 2FA</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Menu Item 3 - Subscription */}
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => setSubscriptionVisible(true)} activeOpacity={0.6}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.surfaceHover }]}>
                    <Ionicons name="wallet" size={18} color={colors.textSecondary} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>Langganan</Text>
                    <Text style={[styles.menuItemSub, { color: colors.textTertiary }]}>Kelola penagihan</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Menu Item 4 (Logout) */}
              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout} activeOpacity={0.6}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.dangerLight }]}>
                    <Ionicons name="log-out" size={18} color={colors.danger} />
                 </View>
                 <View style={styles.menuTextCol}>
                    <Text style={[styles.menuItemTitle, { color: colors.danger }]}>Keluar</Text>
                    <Text style={[styles.menuItemSub, { color: isDark ? '#F87171' : '#F87171' }]}>Keluar dari akunmu</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color="#FCA5A5" />
              </TouchableOpacity>

           </View>
        </View>

      </ScrollView>

      {/* ====== MODAL: Informasi Pribadi ====== */}
      <Modal visible={personalInfoVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Informasi Pribadi</Text>
              <TouchableOpacity onPress={() => setPersonalInfoVisible(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Nama Lengkap</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  value={localDraft.name}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, name: v }))}
                  placeholder="Nama lengkap"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Email</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  value={localDraft.email}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, email: v }))}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Telepon</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  value={localDraft.phone}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, phone: v }))}
                  placeholder="No. telepon"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Alamat</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, height: 60 }]}
                  value={localDraft.address}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, address: v }))}
                  placeholder="Alamat"
                  placeholderTextColor={colors.textMuted}
                  multiline
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Universitas</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  value={localDraft.university}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, university: v }))}
                  placeholder="Universitas"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Jurusan</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  value={localDraft.major}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, major: v }))}
                  placeholder="Jurusan"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalFieldLabel, { color: colors.textTertiary }]}>Angkatan / Tahun</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                  value={localDraft.year}
                  onChangeText={(v) => setLocalDraft(p => ({ ...p, year: v }))}
                  placeholder="Contoh: Tahun 3"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <TouchableOpacity style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]} onPress={handleSavePersonalInfo} activeOpacity={0.7}>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.modalSaveBtnText}>Simpan Perubahan</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ====== MODAL: Keamanan & Privasi ====== */}
      <Modal visible={securityVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Keamanan & Privasi</Text>
              <TouchableOpacity onPress={() => setSecurityVisible(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Change Password */}
              <TouchableOpacity style={[styles.securityRow, { borderBottomColor: colors.border }]} onPress={handleChangePassword} activeOpacity={0.6}>
                <View style={[styles.securityIconBox, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="key" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.securityRowTitle, { color: colors.text }]}>Ubah Kata Sandi</Text>
                  <Text style={[styles.securityRowSub, { color: colors.textTertiary }]}>Terakhir diubah 30 hari lalu</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              {/* 2FA */}
              <View style={[styles.securityRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.securityIconBox, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.securityRowTitle, { color: colors.text }]}>Autentikasi 2 Faktor</Text>
                  <Text style={[styles.securityRowSub, { color: colors.textTertiary }]}>{twoFAEnabled ? 'Aktif — via SMS' : 'Nonaktif'}</Text>
                </View>
                <Switch
                  trackColor={{ false: colors.borderAlt, true: colors.success }}
                  thumbColor="#FFFFFF"
                  value={twoFAEnabled}
                  onValueChange={handleToggle2FA}
                />
              </View>

              {/* Biometric */}
              <View style={[styles.securityRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.securityIconBox, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="finger-print" size={20} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.securityRowTitle, { color: colors.text }]}>Login Biometrik</Text>
                  <Text style={[styles.securityRowSub, { color: colors.textTertiary }]}>{biometricEnabled ? 'Sidik jari / Face ID aktif' : 'Nonaktif'}</Text>
                </View>
                <Switch
                  trackColor={{ false: colors.borderAlt, true: colors.accent }}
                  thumbColor="#FFFFFF"
                  value={biometricEnabled}
                  onValueChange={handleToggleBiometric}
                />
              </View>

              {/* Active Sessions */}
              <TouchableOpacity 
                style={[styles.securityRow, { borderBottomColor: colors.border }]}
                activeOpacity={0.6}
                onPress={() => Alert.alert('📱 Sesi Aktif', 'Perangkat yang sedang login:\n\n1. 📱 Samsung Galaxy S24 (Saat ini)\n   • Jakarta, Indonesia\n   • Login 2 jam lalu\n\n2. 💻 MacBook Pro\n   • Jakarta, Indonesia\n   • Login 3 hari lalu', [
                  { text: 'Tutup' },
                  { text: 'Keluar Semua', style: 'destructive', onPress: () => Alert.alert('✅', 'Semua sesi lain telah dikeluarkan.') },
                ])}
              >
                <View style={[styles.securityIconBox, { backgroundColor: isDark ? '#422006' : '#FEF3C7' }]}>
                  <Ionicons name="phone-portrait" size={20} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.securityRowTitle, { color: colors.text }]}>Sesi Aktif</Text>
                  <Text style={[styles.securityRowSub, { color: colors.textTertiary }]}>2 perangkat terhubung</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Delete Account */}
              <TouchableOpacity 
                style={[styles.securityRow, { borderBottomWidth: 0 }]} 
                activeOpacity={0.6}
                onPress={() => Alert.alert(
                  '⚠️ Hapus Akun',
                  'Tindakan ini bersifat PERMANEN.\n\nSemua data belajar, sertifikat, dan riwayat sesi akan dihapus.\n\nApakah kamu yakin?',
                  [
                    { text: 'Batal', style: 'cancel' },
                    { text: 'Hapus Akun', style: 'destructive', onPress: () => Alert.alert('📧 Konfirmasi', 'Email konfirmasi telah dikirim. Silakan cek inbox untuk menyelesaikan penghapusan akun.') },
                  ]
                )}
              >
                <View style={[styles.securityIconBox, { backgroundColor: colors.dangerLight }]}>
                  <Ionicons name="trash" size={20} color={colors.danger} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.securityRowTitle, { color: colors.danger }]}>Hapus Akun</Text>
                  <Text style={[styles.securityRowSub, { color: '#F87171' }]}>Hapus akun secara permanen</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ====== MODAL: Langganan ====== */}
      <Modal visible={subscriptionVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Langganan</Text>
              <TouchableOpacity onPress={() => setSubscriptionVisible(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Current Plan */}
              <View style={[styles.subCurrentPlan, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderAlt }]}>
                <View style={[styles.subPlanBadge, { backgroundColor: colors.borderAlt }]}>
                  <Text style={[styles.subPlanBadgeText, { color: colors.textTertiary }]}>PAKET SAAT INI</Text>
                </View>
                <Text style={[styles.subPlanName, { color: colors.text }]}>Gratis</Text>
                <Text style={[styles.subPlanDesc, { color: colors.textTertiary }]}>Akses dasar ke fitur belajar dan 3 sesi/minggu</Text>
              </View>

              {/* Pro Monthly */}
              <TouchableOpacity 
                style={[styles.subPlanCard, { backgroundColor: colors.card, borderColor: colors.primaryLighter }]} 
                activeOpacity={0.7}
                onPress={() => Alert.alert('⭐ Pro Bulanan', 'Mulai paket Pro Bulanan?\n\nRp 99.000/bulan\nUji coba gratis 14 hari', [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Mulai Uji Coba', onPress: () => {
                    Alert.alert('🎉', 'Uji coba gratis 14 hari dimulai!');
                    setSubscriptionVisible(false);
                  }},
                ])}
              >
                <View style={styles.subPlanCardHeader}>
                  <Ionicons name="star" size={24} color={colors.primary} />
                  <View style={[styles.subPlanPopularBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.subPlanPopularText, { color: colors.primary }]}>POPULER</Text>
                  </View>
                </View>
                <Text style={[styles.subPlanCardName, { color: colors.textSecondary }]}>Pro Bulanan</Text>
                <Text style={[styles.subPlanCardPrice, { color: colors.text }]}>Rp 99.000<Text style={[styles.subPlanCardPriceUnit, { color: colors.textTertiary }]}>/bulan</Text></Text>
                <View style={styles.subPlanFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={[styles.subPlanFeatureText, { color: colors.textSecondary }]}>Sesi bimbingan tak terbatas</Text>
                </View>
                <View style={styles.subPlanFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={[styles.subPlanFeatureText, { color: colors.textSecondary }]}>AI tutor personal 24/7</Text>
                </View>
                <View style={styles.subPlanFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={[styles.subPlanFeatureText, { color: colors.textSecondary }]}>Analitik mendalam</Text>
                </View>
              </TouchableOpacity>

              {/* Pro Yearly */}
              <TouchableOpacity 
                style={[styles.subPlanCard, styles.subPlanCardPremium]} 
                activeOpacity={0.7}
                onPress={() => Alert.alert('💎 Pro Tahunan', 'Mulai paket Pro Tahunan?\n\nRp 899.000/tahun (hemat 25%!)\nUji coba gratis 14 hari', [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Mulai Uji Coba', onPress: () => {
                    Alert.alert('🎉', 'Uji coba gratis 14 hari dimulai!');
                    setSubscriptionVisible(false);
                  }},
                ])}
              >
                <View style={styles.subPlanCardHeader}>
                  <Ionicons name="diamond" size={24} color="#FFF" />
                  <View style={[styles.subPlanPopularBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Text style={[styles.subPlanPopularText, { color: '#FFF' }]}>HEMAT 25%</Text>
                  </View>
                </View>
                <Text style={[styles.subPlanCardName, { color: '#E0E7FF' }]}>Pro Tahunan</Text>
                <Text style={[styles.subPlanCardPrice, { color: '#FFF' }]}>Rp 899.000<Text style={[styles.subPlanCardPriceUnit, { color: '#C7D2FE' }]}>/tahun</Text></Text>
                <View style={styles.subPlanFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#A5B4FC" />
                  <Text style={[styles.subPlanFeatureText, { color: '#E0E7FF' }]}>Semua fitur Pro Bulanan</Text>
                </View>
                <View style={styles.subPlanFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#A5B4FC" />
                  <Text style={[styles.subPlanFeatureText, { color: '#E0E7FF' }]}>Sertifikat penyelesaian</Text>
                </View>
                <View style={styles.subPlanFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#A5B4FC" />
                  <Text style={[styles.subPlanFeatureText, { color: '#E0E7FF' }]}>Prioritas pencocokan tutor</Text>
                </View>
              </TouchableOpacity>

              {/* Payment History */}
              <TouchableOpacity 
                style={styles.subHistoryBtn}
                activeOpacity={0.6}
                onPress={() => Alert.alert('📋 Riwayat Pembayaran', 'Belum ada transaksi.\nMulai langganan Pro untuk melihat riwayat pembayaran.')}
              >
                <Ionicons name="receipt" size={18} color={colors.primary} />
                <Text style={[styles.subHistoryBtnText, { color: colors.primary }]}>Lihat Riwayat Pembayaran</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomTabBar activeRoute="profile" />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  notificationBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
  },
  mainAvatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  profileSubtext: {
    fontSize: 13,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  proButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  proButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pulseCard: {
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressItem: {
    marginBottom: 16,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressPercentAlt: {
    fontSize: 12,
    fontWeight: '700',
  },
  progBarBg: {
    height: 8,
    borderRadius: 4,
  },
  progBarFill: {
    height: 8,
    borderRadius: 4,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 4,
  },
  targetItalicText: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  sectionWrapper: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  toggleCardGroup: {
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  toggleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIconBoxAlt: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSublabel: {
    fontSize: 10,
    marginTop: 2,
  },
  menuCardGroup: {
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  menuItemSub: {
    fontSize: 11,
  },

  // ====== Modal Styles ======
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalField: {
    marginBottom: 16,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  modalInput: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  modalSaveBtn: {
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Security modal rows
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  securityIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  securityRowSub: {
    fontSize: 11,
  },

  // Subscription modal styles
  subCurrentPlan: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  subPlanBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  subPlanBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subPlanName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subPlanDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  subPlanCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
  },
  subPlanCardPremium: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  subPlanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subPlanPopularBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  subPlanPopularText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subPlanCardName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subPlanCardPrice: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
  },
  subPlanCardPriceUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  subPlanFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  subPlanFeatureText: {
    fontSize: 12,
  },
  subHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginBottom: 16,
  },
  subHistoryBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
