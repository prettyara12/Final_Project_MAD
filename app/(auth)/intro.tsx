import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Cara Pakai EduPartner AI</Text>
        <Text style={styles.subtitle}>
          Belajar jadi lebih gampang dengan tutor + AI
        </Text>

        {/* Step 1 */}
        <View style={styles.card}>
          <Text style={styles.step}>1. Pilih Materi</Text>
          <Text style={styles.desc}>
            Pilih mata kuliah atau topik yang ingin kamu pelajari.
          </Text>
        </View>

        {/* Step 2 */}
        <View style={styles.card}>
          <Text style={styles.step}>2. Belajar dengan Tutor</Text>
          <Text style={styles.desc}>
            Tutor akan membantu menjelaskan materi sampai kamu paham.
          </Text>
        </View>

        {/* Step 3 */}
        <View style={styles.card}>
          <Text style={styles.step}>3. Gunakan AI</Text>
          <Text style={styles.desc}>
            Tanya AI kapan saja untuk bantu memahami materi lebih cepat.
          </Text>
        </View>

        {/* Step 4 */}
        <View style={styles.card}>
          <Text style={styles.step}>4. Latihan</Text>
          <Text style={styles.desc}>
            Ulangi dan latihan sampai benar-benar paham.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Mulai Sekarang 🚀</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFF',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  step: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: '#555',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '700',
  },
});