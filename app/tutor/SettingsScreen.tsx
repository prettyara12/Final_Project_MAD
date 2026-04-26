import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Switch, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTutorSettings } from '../../context/TutorSettingsContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const { 
    notifications, setNotifications,
    sounds, setSounds,
    autoAccept, setAutoAccept 
  } = useTutorSettings();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.push('/tutor/TutorProfileScreen' as any)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pengaturan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifikasi</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notification</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Terima pemberitahuan permintaan baru</Text>
              </View>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: colors.borderAlt, true: colors.primaryLighter }}
              thumbColor={notifications ? colors.primary : colors.surfaceHover}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.successLight }]}>
                <Ionicons name="volume-high-outline" size={20} color={colors.success} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Suara</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Suara notifikasi pesan</Text>
              </View>
            </View>
            <Switch 
              value={sounds} 
              onValueChange={setSounds}
              trackColor={{ false: colors.borderAlt, true: colors.successLight }}
              thumbColor={sounds ? colors.success : colors.surfaceHover}
            />
          </View>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferensi</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="moon-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Mode Gelap</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Tampilan tema gelap</Text>
              </View>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: colors.borderAlt, true: colors.primaryLighter }}
              thumbColor={isDark ? colors.primary : colors.surfaceHover}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="flash-outline" size={20} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Terima Otomatis</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Terima permintaan siswa secara otomatis</Text>
              </View>
            </View>
            <Switch 
              value={autoAccept} 
              onValueChange={setAutoAccept}
              trackColor={{ false: colors.borderAlt, true: colors.accentLight }}
              thumbColor={autoAccept ? colors.accent : colors.surfaceHover}
            />
          </View>
        </View>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tentang</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, { color: colors.text }]}>Kebijakan Privasi</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, { color: colors.text }]}>Syarat & Ketentuan</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.menuItem}>
            <Text style={[styles.menuText, { color: colors.text }]}>Versi Aplikasi</Text>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>1.0.0</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 44 : 12, paddingBottom: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12, marginTop: 8 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 4, marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 12,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  settingLabel: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  settingDesc: { fontSize: 12, color: '#9CA3AF' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
  },
  menuText: { fontSize: 15, fontWeight: '600', color: '#111827' },
  versionText: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
});
