import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../../components/CustomButton';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/logo.jpeg')} 
            style={styles.logo}
          />
        </View>

        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ERA BELAJAR BARU</Text>
          </View>

          <Text style={styles.title}>
            Smart Learning Starts with{'\n'}
            <Text style={styles.titleHighlight}>Partnership</Text>
          </Text>

          <Text style={styles.description}>
            EduPartner AI hadir untuk membantu mahasiswa belajar lebih cerdas 
            dengan dukungan tutor yang siap menjelaskan dan AI yang selalu siap membantu.
            Dengan kombinasi ini, belajar jadi lebih mudah dipahami, terarah, dan nggak bikin stres.
          </Text>

          <View>
            <CustomButton
              title="Mulai Belajar 🚀"
              onPress={handleGetStarted}
            />
            <View style={{ height: 12 }} />
            <CustomButton
              title="Lihat Cara Kerja 👀"
              variant="secondary"
              onPress={() => router.push('/intro')}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statNumber}>12rb+</Text>
            <Text style={styles.statLabel}>Mahasiswa Aktif</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>90%</Text>
            <Text style={styles.statLabel}>Lebih Paham</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Siap Bantu</Text>
          </View>
        </View>

        {/* 🔥 IMPROVED ILLUSTRATION */}
        <View style={styles.illustrationContainer}>
          <View style={styles.laptopScreen}>
            <View style={styles.mockHeader} />
            <View style={styles.mockBody} />

            <View style={styles.chatBubble}>
              <View style={styles.chatDot} />
              <View>
                <Text style={styles.bubbleTitle}>Grup Belajar Santai</Text>
                <Text style={styles.bubbleSub}>
                  Bahas tugas & materi bareng 📚
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCardBig}>
            <Text style={styles.featureCardTitle}>
              AI yang Ngerti Kamu
            </Text>
            <Text style={styles.featureCardDesc}>
              AI bantu fokus ke bagian yang belum kamu pahami,
              jadi belajar lebih efektif.
            </Text>
          </View>

          <View style={{ height: 16 }} />

          <View style={styles.featureCard}>
            <Text style={styles.featureCardTitleSmall}>
              Belajar dengan Tutor
            </Text>
            <Text style={styles.featureCardDesc}>
              Dapatkan penjelasan langsung dari tutor yang siap membantu kamu memahami materi kuliah dengan lebih mudah.
            </Text>
          </View>
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>
            Smarter Learning with AI and Tutors.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFF',
  },

  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },

  heroSection: {
    marginBottom: 32,
    alignItems: 'center',
  },

  badge: {
    backgroundColor: '#EBE2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },

  titleHighlight: {
    color: '#4F46E5',
  },

  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  statLabel: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
  },

  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  laptopScreen: {
    width: width * 0.85,
    height: 170,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 14,
    justifyContent: 'flex-end',
  },

  mockHeader: {
    height: 6,
    backgroundColor: '#334155',
    marginBottom: 10,
    borderRadius: 4,
  },

  mockBody: {
    height: 50,
    backgroundColor: '#334155',
    borderRadius: 6,
  },

  // 🔥 NEW CHAT BUBBLE
  chatBubble: {
    position: 'absolute',
    bottom: -20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: 200,
  },

  chatDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
    marginRight: 10,
  },

  bubbleTitle: {
    fontSize: 13,
    fontWeight: '800',
  },

  bubbleSub: {
    fontSize: 11,
    color: '#666',
  },

  featuresContainer: {
    marginBottom: 32,
    width: '100%',
  },

  featureCardBig: {
    backgroundColor: '#F3F4F6',
    padding: 18,
    borderRadius: 18,
  },

  featureCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 18,
  },

  featureCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },

  featureCardTitleSmall: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },

  featureCardDesc: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },

  ctaCard: {
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },

  ctaTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});