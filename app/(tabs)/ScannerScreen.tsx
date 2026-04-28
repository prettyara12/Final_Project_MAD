import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { analyzeScannedText } from '../../services/gemini';

const { width } = Dimensions.get('window');

export default function ScannerScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<'capture' | 'review'>('capture');

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin Diperlukan', 'Aplikasi membutuhkan akses kamera untuk memindai.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
      setStep('review');
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
      setStep('review');
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim()) {
      Alert.alert('Teks Kosong', 'Silakan masukkan atau koreksi teks yang terdeteksi sebelum menganalisis.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeScannedText(extractedText, imageBase64 || undefined);
      if (analysis) {
        router.push({
          pathname: '/(tabs)/ScanResultScreen' as any,
          params: {
            extractedText: extractedText,
            analysis: analysis,
            imageUri: imageUri || '',
          }
        });
      } else {
        Alert.alert('Gagal', 'AI tidak dapat menganalisis teks saat ini. Coba lagi.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat menganalisis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImageUri(null);
    setImageBase64(null);
    setExtractedText('');
    setStep('capture');
  };

  // Mock OCR: In production, replace with a real OCR API (Google Cloud Vision, etc.)

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Scanner</Text>
        <View style={{ width: 24 }} />
      </View>

      {step === 'capture' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Intro */}
          <View style={styles.introSection}>
            <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="scan" size={36} color="#3B82F6" />
            </View>
            <Text style={[styles.mainTitle, { color: colors.text }]}>Pindai & Analisis</Text>
            <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
              Ambil foto soal, catatan, atau materi pelajaran dan biarkan AI menjelaskannya untukmu.
            </Text>
          </View>

          {/* Action Cards */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleCamera}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="camera" size={28} color="#4F46E5" />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Buka Kamera</Text>
              <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
                Ambil foto langsung dari kamera
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleGallery}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="images" size={28} color="#F59E0B" />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Pilih dari Galeri</Text>
              <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
                Upload gambar yang sudah ada
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Tips */}
          <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips untuk hasil terbaik:</Text>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Pastikan pencahayaan cukup terang</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Posisikan teks sejajar dengan kamera</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Hindari bayangan pada teks</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Image Preview */}
          {imageUri && (
            <View style={[styles.imagePreviewContainer, { borderColor: colors.border }]}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="contain" />
              <TouchableOpacity style={styles.retakeBtn} onPress={handleReset}>
                <Ionicons name="refresh" size={16} color="#FFF" />
                <Text style={styles.retakeBtnText}>Ambil Ulang</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Extracted Text Input */}
          <View style={[styles.textSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.textSectionHeader}>
              <View style={styles.textSectionLeft}>
                <Ionicons name="document-text" size={18} color={colors.primary} />
                <Text style={[styles.textSectionTitle, { color: colors.text }]}>Catatan atau Instruksi</Text>
              </View>
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Berikan instruksi tambahan (misal: 'Jelaskan soal nomor 5') atau biarkan kosong jika ingin menganalisis seluruh gambar..."
              placeholderTextColor={colors.textMuted}
              value={extractedText}
              onChangeText={setExtractedText}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            style={[styles.analyzeBtn, { backgroundColor: '#3B82F6' }, isAnalyzing && { opacity: 0.7 }]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <View style={styles.analyzingRow}>
                <ActivityIndicator color="#FFF" />
                <Text style={styles.analyzeBtnText}>  AI Sedang Menganalisis...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.analyzeBtnText}>Analisis dengan AI</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
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
  introSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  tipsCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    flex: 1,
  },
  imagePreviewContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: '#F9FAFB',
  },
  retakeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  retakeBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  textSection: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  textSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  textSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  ocrBtn: {
    fontSize: 12,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    minHeight: 140,
    lineHeight: 22,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  analyzeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  analyzingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
