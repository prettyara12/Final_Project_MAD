import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
// import { BottomTabBar } from '../components/BottomTabBar';

const { width } = Dimensions.get('window');

const INITIAL_SUBJECTS = [
  {
    id: '1',
    title: 'Matematika Lanjutan',
    desc: 'Aljabar Linear, Kalkulus III, dan Persamaan Diferensial.',
    progress: 72,
    badge: 'AKTIF',
    actionText: 'Buka Meja Belajar',
    themeColor: '#4F46E5', // blue/purple
    icon: 'calculator-outline'
  },
  {
    id: '2',
    title: 'Psikologi Kognitif',
    desc: 'Sistem memori, atensi, dan teori persepsi.',
    progress: 45,
    badge: 'PERSIAPAN UJIAN',
    actionText: 'Lanjutkan Membaca',
    themeColor: '#9333EA', // purple
    icon: 'brain'
  }
];

const CATEGORIES = [
  { id: '1', title: 'AI & Etika', desc: 'Implikasi filosofis dari kecerdasan mesin.', files: 12, icon: 'hardware-chip' },
  { id: '2', title: 'Biologi Molekuler', desc: 'Dasar-dasar CRISPR dan rekayasa genetika.', files: 8, icon: 'flask' },
  { id: '3', title: 'Perencanaan Wilayah', desc: 'Desain kota berkelanjutan dan infrastruktur.', files: 15, icon: 'business' }
];

const RECENT_NOTES = [
  { id: '1', title: 'Intro Jaringan Syaraf', time: 'Dibuat 2 jam lalu • Studi AI', icon: 'document-text' },
  { id: '2', title: 'Hukum Termodinamika', time: 'Diperbarui kemarin • Fisika', icon: 'document' },
  { id: '3', title: 'Aliran Seni Renaisans', time: 'Diperbarui 3 hari lalu • Sejarah', icon: 'color-palette' },
];

export default function SubjectScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSubject = () => {
    // Basic local state append to satisfy requirement
    // In a real app we'd open a modal. Here we just push a dummy.
    Alert.alert(
      "Tambah Mata Kuliah",
      "Apakah Anda ingin menambahkan kelas dummy 'Struktur Data & Algoritma'?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Tambah", 
          onPress: () => {
            const newSub = {
              id: Date.now().toString(),
              title: 'Struktur Data & Algoritma',
              desc: 'Array, Linked List, Tree, Graph, dan Kompleksitas.',
              progress: 0,
              badge: 'BARU',
              actionText: 'Mulai Belajar',
              themeColor: '#10B981',
              icon: 'code-slash'
            };
            setSubjects([newSub, ...subjects]);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Top Header */}
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
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => router.push('/NotificationScreen' as any)}
        >
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
           <Text style={[styles.mainTitle, { color: colors.text }]}>Manajemen Mata{'\n'}Kuliah</Text>
           <Text style={[styles.mainDesc, { color: colors.textSecondary }]}>Atur perjalanan akademikmu dengan wawasan bertenaga AI.</Text>
           
           <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
             <Ionicons name="search" size={20} color={colors.textSecondary} />
             <TextInput 
               style={[styles.searchInput, { color: colors.text }]}
               placeholder="Cari mata kuliah atau materi..."
               placeholderTextColor={colors.textSecondary}
               value={searchQuery}
               onChangeText={setSearchQuery}
             />
           </View>
        </View>

        {/* Subjects List (Large Cards) */}
        <View style={styles.cardsSection}>
          {subjects.map((sub, idx) => (
            <View key={sub.id} style={[styles.subjectCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
               <View style={styles.subHeaderRow}>
                 <View style={[styles.subIconBox, { backgroundColor: sub.themeColor + '15' }]}>
                    <Ionicons name={sub.icon as any} size={20} color={sub.themeColor} />
                 </View>
                 <View style={[styles.badgeBox, { backgroundColor: colors.primaryLight }]}>
                   <Text style={[styles.badgeText, { color: colors.primary }]}>{sub.badge}</Text>
                 </View>
               </View>

               <Text style={[styles.subTitle, { color: colors.text }]}>{sub.title}</Text>
               <Text style={[styles.subDesc, { color: colors.textSecondary }]}>{sub.desc}</Text>

               <View style={styles.progressRow}>
                 <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Kemajuan Kursus</Text>
                 <Text style={[styles.progressLabel, { color: sub.themeColor }]}>{sub.progress}%</Text>
               </View>
               <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                 <View style={[styles.progressBarFill, { width: `${sub.progress}%`, backgroundColor: sub.themeColor }]} />
               </View>

               <View style={styles.actionsRow}>
                 <TouchableOpacity 
                   style={[styles.mainActionBtn, { backgroundColor: sub.themeColor }]}
                   onPress={() => router.push('/SubjectDetailScreen' as any)}
                 >
                   <Text style={styles.mainActionText}>{sub.actionText}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.moreActionBtn, { borderColor: colors.border }]}>
                   <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
                 </TouchableOpacity>
               </View>
            </View>
          ))}
        </View>

        {/* Topik Terkategorisasi */}
        <View style={styles.sectionHeader}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Topik Terkategorisasi</Text>
        </View>
        <View style={styles.categorySection}>
           {CATEGORIES.map(cat => (
             <View key={cat.id} style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.catHeader}>
                   <View style={[styles.catIconBox, { backgroundColor: colors.primaryLight }]}>
                     <Ionicons name={cat.icon as any} size={16} color={colors.primary} />
                   </View>
                   <View style={[styles.catFileBadge, { backgroundColor: colors.avatarBg }]}>
                      <Text style={styles.catFileText}>{cat.files} File</Text>
                   </View>
                </View>
                <Text style={[styles.catTitle, { color: colors.text }]}>{cat.title}</Text>
                <Text style={[styles.catDesc, { color: colors.textSecondary }]}>{cat.desc}</Text>
             </View>
           ))}
        </View>

        {/* Unggah Materi (Upload Block) */}
        <View style={[styles.uploadBlock, { backgroundColor: colors.primary }]}>
           <Text style={styles.uploadTitle}>Unggah Materi</Text>
           <Text style={styles.uploadDesc}>
              Unggah PDF, catatan kuliah, atau gambar. AI kami akan secara otomatis mengkategorikannya ke dalam topik.
           </Text>
           
           <TouchableOpacity style={[styles.uploadBoxDashed, { borderColor: '#FFF' }]}>
              <View style={[styles.uploadIconCircle, { backgroundColor: colors.primaryLight }]}>
                 <Ionicons name="cloud-upload" size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadBoxTitle}>Tarik file ke sini atau klik untuk mencari</Text>
              <Text style={styles.uploadBoxSub}>Dukung PDF, DOCX, PNG (Maks 50MB)</Text>
           </TouchableOpacity>

           {/* Upload Progress Mock */}
           <View style={[styles.uploadProgressRow, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Ionicons name="document-text" size={16} color="#FFF" style={{marginRight: 8}} />
              <View style={{ flex: 1 }}>
                 <Text style={styles.uploadFileName}>Midterm_Review.pdf</Text>
                 <View style={[styles.uploadProbBarLine, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <View style={[styles.uploadProbBarFill, { backgroundColor: '#FFF' }]} />
                 </View>
              </View>
              <Text style={styles.uploadFilePercent}>86%</Text>
           </View>
        </View>

        {/* Catatan Terbaru */}
        <View style={styles.lastSection}>
           <View style={styles.sectionHeaderLine}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Catatan Terbaru</Text>
              <TouchableOpacity><Text style={[styles.linkText, { color: colors.primary }]}>Lihat Semua</Text></TouchableOpacity>
           </View>

           {RECENT_NOTES.map(note => (
             <View key={note.id} style={[styles.noteRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.noteIconCircle, { backgroundColor: colors.primaryLight }]}>
                   <Ionicons name={note.icon as any} size={16} color={colors.primary} />
                </View>
                <View style={styles.noteInfo}>
                   <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
                   <Text style={[styles.noteTime, { color: colors.textSecondary }]}>{note.time}</Text>
                </View>
             </View>
           ))}
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fabBtn} onPress={handleAddSubject}>
         <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Manual BottomTabBar removed */}
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
  },
  scrollContent: {
    paddingBottom: 160, // accommodate fab and tab bar space
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 38,
    marginBottom: 8,
  },
  mainDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // light grey like input
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeBox: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#9333EA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  mainActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  moreActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  catIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catFileBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catFileText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  catTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  catDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  uploadBlock: {
    backgroundColor: '#4F46E5', // blue/purple main
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  uploadDesc: {
    fontSize: 13,
    color: '#E0E7FF', // lighter blue text
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadBoxDashed: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadBoxTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  uploadBoxSub: {
    color: '#A5B4FC', // faint blue purple
    fontSize: 10,
  },
  uploadProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 16,
  },
  uploadFileName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  uploadProbBarLine: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    width: '100%',
  },
  uploadProbBarFill: {
    width: '86%',
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  uploadFilePercent: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 12,
  },
  lastSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 12,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noteIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  noteTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 20, // Adjusted for persistent tab bar (inside layout)
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5', // prime blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
