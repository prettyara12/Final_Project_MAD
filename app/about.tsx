import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t, language } = useLanguage();
  const features = [
    {
      icon: 'scan-outline',
      title: t('ai_scanner_title'),
      desc: t('ai_scanner_desc'),
      color: '#3B82F6'
    },
    {
      icon: 'calendar-outline',
      title: t('study_planner_title'),
      desc: t('study_planner_desc'),
      color: '#F59E0B'
    },
    {
      icon: 'people-outline',
      title: t('expert_tutors_title'),
      desc: t('expert_tutors_desc'),
      color: '#10B981'
    }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Background Decoration */}
      <View style={[styles.bgCircle, { backgroundColor: colors.primaryLight, top: -100, right: -100 }]} />
      <View style={[styles.bgCircle, { backgroundColor: colors.primary + '10', bottom: -50, left: -50 }]} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('about_us')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={[styles.logoContainer, { shadowColor: colors.primary, backgroundColor: colors.card }]}>
             <Ionicons name="sparkles" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>EduPartner AI</Text>
          <Text style={[styles.versionText, { color: colors.textMuted }]}>{language === 'id' ? 'Versi' : 'Version'} 2.0.4 Premium</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('vision_title')}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('vision_desc')}
          </Text>
        </View>

        <Text style={[styles.subHeader, { color: colors.text }]}>{t('key_features')}</Text>
        
        {features.map((feature, index) => (
          <View key={index} style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.featureIconBox, { backgroundColor: feature.color + '20' }]}>
              <Ionicons name={feature.icon as any} size={24} color={feature.color} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{feature.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {t('developed_with')}
          </Text>
          <Text style={[styles.copyright, { color: colors.textMuted }]}>
            © 2026 EduPartner AI. {t('all_rights_reserved')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  bgCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 20,
  },
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
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 20,
  },
  appName: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  versionText: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 24, fontWeight: '500' },
  subHeader: { fontSize: 18, fontWeight: '800', marginBottom: 20, marginLeft: 4 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  featureIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  featureDesc: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  copyright: { fontSize: 11, fontWeight: '500' },
});
