import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ScanResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  const extractedText = (params.extractedText as string) || '';
  const analysis = (params.analysis as string) || '';
  const imageUri = (params.imageUri as string) || '';

  const handleAskMore = () => {
    router.push({
      pathname: '/(tabs)/AIChatScreen' as any,
      params: { initialMessage: `Jelaskan lebih lanjut tentang: ${extractedText.substring(0, 100)}` }
    });
  };

  // Extract subject from analysis text if possible
  const subjectMatch = analysis.match(/\[SUBJECT:\s*(.*?)\]/);
  const detectedSubject = subjectMatch ? subjectMatch[1].trim() : '';
  
  // Clean analysis text for display (remove the tag)
  const displayAnalysis = analysis.replace(/\[SUBJECT:\s*.*?\]/g, '').trim();

  const handleFindTutor = () => {
    // Use detected subject if available, otherwise fallback to extracted text
    const searchSubject = detectedSubject || extractedText.split(' ').slice(0, 3).join(' ');
    router.push({
      pathname: '/(tabs)/TutorListScreen' as any,
      params: { subject: searchSubject }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Hasil Analisis</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Image Preview (if available) */}
        {imageUri ? (
          <View style={[styles.imageCard, { borderColor: colors.border }]}>
            <Image source={{ uri: imageUri }} style={styles.imageThumb} resizeMode="cover" />
          </View>
        ) : null}

        {/* Extracted Text Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="document-text" size={18} color="#3B82F6" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Instruksi Anda</Text>
          </View>
          <View style={[styles.extractedTextBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.extractedText, { color: colors.text }]}>{extractedText}</Text>
          </View>
        </View>

        {/* AI Analysis Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="sparkles" size={18} color="#4F46E5" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Penjelasan AI</Text>
          </View>
          <Text style={[styles.analysisText, { color: colors.textSecondary }]}>{displayAnalysis}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#4F46E5' }]}
            onPress={handleAskMore}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>Tanya Lebih Lanjut</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
            onPress={handleFindTutor}
          >
            <Ionicons name="search" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>Cari Tutor untuk Topik Ini</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/ScannerScreen' as any)}
          >
            <Ionicons name="scan" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Pindai Lagi</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  imageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
  },
  imageThumb: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  extractedTextBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  extractedText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
