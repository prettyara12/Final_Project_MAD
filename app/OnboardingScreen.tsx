import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButton';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="share-social" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>EduPartner AI</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ERA BELAJAR BARU</Text>
          </View>

          <Text style={styles.title}>
            Di Mana{'\n'}Kecerdasan{'\n'}Bertemu{'\n'}
            <Text style={styles.titleHighlight}>Kolaborasi.</Text>
          </Text>

          <Text style={styles.description}>
            Rasakan kemitraan AI transformatif yang dirancang untuk membantu mahasiswa menguasai subjek kompleks melalui sinergi rekan sejawat dan dukungan kognitif tingkat lanjut.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonStack}>
            <CustomButton 
              title="Mulai Sekarang" 
              onPress={handleGetStarted} 
              style={styles.primaryButton}
            />
            <CustomButton 
              title="Tonton Intro" 
              variant="secondary"
              onPress={() => {}} 
              style={styles.secondaryButton}
            />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12rb+</Text>
            <Text style={styles.statLabel}>Pelajar Aktif</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Tingkat Keberhasilan</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Dukungan AI</Text>
          </View>
        </View>

        {/* Mock Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.laptopScreen}>
            {/* Mock Dashboard UI Inside */}
            <View style={styles.mockHeader} />
            <View style={styles.mockBody} />
            {/* Floating Bubble */}
            <View style={styles.floatingBubble}>
               <View style={styles.bubbleAvatars}>
                 <View style={[styles.avatarMicro, {backgroundColor: '#B4C6FC'}]} />
                 <View style={[styles.avatarMicro, {backgroundColor: '#EAC2FF', marginLeft: -8}]} />
                 <View style={[styles.avatarMicro, {backgroundColor: '#F3F4F6', marginLeft: -8, alignItems: 'center', justifyContent: 'center'}]}>
                    <Text style={{fontSize: 6, fontWeight: 'bold'}}>+3</Text>
                 </View>
               </View>
               <Text style={styles.bubbleTitle}>Grup Belajar Alpha</Text>
               <Text style={styles.bubbleSub}>Sesi putih Mekanika Kuantum</Text>
            </View>
            <View style={styles.floatingIconRight}>
              <Ionicons name="chatbubbles" size={14} color="#4F46E5" />
            </View>
            <View style={styles.floatingIconLeft}>
               <Ionicons name="location" size={14} color="#4F46E5" />
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          
          {/* Card 1 */}
          <View style={styles.featureCardBig}>
            <Text style={styles.featureCardTitle}>Peta Jalan AI Terpersonalisasi</Text>
            <Text style={styles.featureCardDesc}>
              AI kami tidak hanya menjawab pertanyaan—ia menganalisis gaya belajarmu dan merancang jalur unik menuju penguasaan, mengidentifikasi celah pengetahuan secara real-time.
            </Text>
            <TouchableOpacity style={styles.featureLinkRow}>
              <Text style={styles.featureLink}>Jelajahi pembelajaran adaptif</Text>
              <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          {/* Card 2 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="people" size={20} color="#E11D48" />
            </View>
            <Text style={styles.featureCardTitleSmall}>Sesi Rekan Sejawat</Text>
            <Text style={styles.featureCardDesc}>
              Cocokkan secara instan dengan mahasiswa di seluruh dunia yang menghadapi tantangan yang sama. Belajar bersama, tumbuh bersama.
            </Text>
          </View>

          {/* Card 3 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="school" size={20} color="#9333EA" />
            </View>
            <Text style={styles.featureCardTitleSmall}>Catatan Pintar</Text>
            <Text style={styles.featureCardDesc}>
              Rekam kuliah langsung dan biarkan AI kami mengekstraksi ringkasan terstruktur, flashcard, dan kuis secara otomatis.
            </Text>
          </View>

        </View>

        {/* CTA Card Big */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Belajar Kapan Saja, Di Mana Saja</Text>
          <Text style={styles.ctaDesc}>
            Beralih mulus antara desktop dan seluler dengan kemajuan yang disinkronkan di cloud dan kemampuan luring untuk sesi yang terfokus.
          </Text>
          
          <View style={styles.storeButtons}>
             <TouchableOpacity style={styles.storeBtn}>
               <Ionicons name="logo-apple" size={14} color="#FFF" style={styles.storeBtnIcon}/>
               <Text style={styles.storeBtnText}>App Store</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.storeBtn}>
               <Ionicons name="logo-google-playstore" size={14} color="#FFF" style={styles.storeBtnIcon}/>
               <Text style={styles.storeBtnText}>Play Store</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.ctaDeviceBox}>
             <Ionicons name="laptop-outline" size={32} color="#FFF" />
             <View style={styles.phoneIconMock}>
                <View style={styles.phoneIconInner} />
             </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 EduPartner AI. Meningkatkan standar pembelajaran.</Text>
          <View style={styles.footerLinksRow}>
            <TouchableOpacity><Text style={styles.footerLink}>Kebijakan Privasi</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Ketentuan Layanan</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Hubungi Dukungan</Text></TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE', 
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  heroSection: {
    marginBottom: 40,
  },
  badge: {
    backgroundColor: '#EBE2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 44,
    marginBottom: 20,
    letterSpacing: -1,
  },
  titleHighlight: {
    color: '#4F46E5',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonStack: {
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#E5E7EB', // matching CustomButton
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    maxWidth: 60,
    lineHeight: 16,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  laptopScreen: {
    width: width * 0.85,
    height: 180,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    borderBottomWidth: 10,
    borderBottomColor: '#475569',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 8,
  },
  mockHeader: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    width: '40%',
    marginBottom: 16,
  },
  mockBody: {
    height: 60,
    backgroundColor: '#334155',
    borderRadius: 8,
    width: '100%',
  },
  floatingBubble: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bubbleAvatars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatarMicro: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  bubbleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  bubbleSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  floatingIconRight: {
    position: 'absolute',
    right: -10,
    top: 80,
    backgroundColor: '#FFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingIconLeft: {
    position: 'absolute',
    left: 40,
    top: -10,
    backgroundColor: '#FFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresContainer: {
    marginBottom: 40,
    gap: 16,
  },
  featureCardBig: {
    backgroundColor: '#F3F4F6', // Light gray background
    borderRadius: 24,
    padding: 24,
  },
  featureCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  featureCardDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  featureLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureCardTitleSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  ctaCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  ctaDesc: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  storeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  storeBtn: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  storeBtnIcon: {
    marginRight: 6,
  },
  storeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ctaDeviceBox: {
    width: 100,
    height: 100,
    backgroundColor: '#6366F1',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  phoneIconMock: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 14,
    height: 24,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  phoneIconInner: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  footerLinksRow: {
    flexDirection: 'row',
    gap: 16,
  },
  footerLink: {
    fontSize: 11,
    color: '#6B7280',
  }
});
