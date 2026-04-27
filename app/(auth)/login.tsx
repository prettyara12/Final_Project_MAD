import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../../components/InputField';
import { CustomButton } from '../../components/CustomButton';
import { useProfile } from '../../context/ProfileContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { updateProfile, clearProfile } = useProfile();

  const [activeRole, setActiveRole] = useState<'learner' | 'tutor'>('learner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Kita gunakan query untuk mencari user berdasarkan email (logic simulasi login)
  // Di real app, gunakan Convex Auth untuk keamanan yang sebenarnya
  const user = useQuery(api.users.getUserByEmail, { email: email });

  const handleLogin = async () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Alamat Email harus diisi';
      valid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Format email tidak valid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Kata sandi harus diisi';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);

      // Simulasi delay login
      setTimeout(() => {
        if (user) {
          // Periksa role user
          const userRole = user.role || 'learner'; // fallback jika role tidak ada
          if (userRole !== activeRole) {
            Alert.alert("Error", `Akun ini terdaftar sebagai ${userRole}, bukan ${activeRole}.`);
            setIsLoading(false);
            return;
          }

          // Jika user ditemukan di database, update profile context
          // Reset dulu ke default baru timpa dengan data user baru agar data lama tidak tertinggal
          clearProfile();
          updateProfile({
            name: user.name,
            email: user.email,
            phone: user.phone || '-',
            address: user.address || '-',
            university: user.university || '-',
            major: user.major || '-',
            year: user.year || '-',
            profileImage: user.profileImage || undefined,
          });

          if (activeRole === 'tutor') {
            router.replace('/tutor/TutorDashboardScreen' as any);
          } else {
            router.replace('/HomeScreen' as any);
          }
        } else {
          Alert.alert("Error", "User tidak ditemukan. Silakan daftar terlebih dahulu.");
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  const navigateToRegister = () => {
    if (activeRole === 'tutor') {
      router.push('/TutorRegisterScreen' as any);
    } else {
      router.push('/register' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {activeRole === 'tutor' ? 'Selamat\nDatang Tutor 👋' : 'Selamat\nDatang 👋'}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit>
              {activeRole === 'tutor' ? 'Masuk untuk mulai mengajar dan berbagi ilmu.' : 'Masuk untuk melanjutkan perjalanan belajarmu dengan AI.'}
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.formContainer}>
              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[styles.roleButton, activeRole === 'learner' && styles.roleButtonActive]}
                  onPress={() => setActiveRole('learner')}
                >
                  <Text style={[styles.roleButtonText, activeRole === 'learner' && styles.roleButtonTextActive]}>Pelajar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, activeRole === 'tutor' && styles.roleButtonActive]}
                  onPress={() => setActiveRole('tutor')}
                >
                  <Text style={[styles.roleButtonText, activeRole === 'tutor' && styles.roleButtonTextActive]}>Tutor</Text>
                </TouchableOpacity>
              </View>

              <InputField label="Alamat Email" placeholder="Masukkan alamat email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <Text style={styles.errorText}>{errors.email ? errors.email : ' '}</Text>

              <InputField label="Kata Sandi" placeholder="Masukkan kata sandi" value={password} onChangeText={setPassword} secureTextEntry />
              <Text style={styles.errorText}>{errors.password ? errors.password : ' '}</Text>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Lupa Kata Sandi?</Text>
              </TouchableOpacity>

              <View style={styles.mainButtonContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#4F46E5" />
                ) : (
                  <CustomButton title={activeRole === 'tutor' ? "Masuk Sebagai Tutor" : "Masuk Sekarang"} onPress={handleLogin} style={styles.loginBtnStyle} />
                )}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ATAU LOG IN DENGAN</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Image source={require('../../assets/images/google-logo.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-apple" size={24} color="#000000" /></TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              {activeRole === 'tutor' ? 'Belum memiliki akun Tutor? ' : 'Belum memiliki akun? '}
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>
                {activeRole === 'tutor' ? 'Daftar sebagai tutor' : 'Daftar di sini'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  bgCircle1: { position: 'absolute', top: -height * 0.1, left: -width * 0.2, width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, backgroundColor: '#E0E7FF', opacity: 0.6 },
  bgCircle2: { position: 'absolute', bottom: height * 0.1, right: -width * 0.4, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: '#F3E8FF', opacity: 0.6 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 60 : 40, paddingBottom: 40 },
  header: { marginBottom: 32, minHeight: 110 },
  title: { fontSize: 36, fontWeight: '900', color: '#111827', marginBottom: 12, lineHeight: 44 },
  subtitle: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  cardContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 32, padding: 24, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, marginBottom: 32 },
  roleSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 24 },
  roleButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  roleButtonActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  roleButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  roleButtonTextActive: { color: '#4F46E5' },
  formContainer: { marginBottom: 8 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: '#4F46E5', fontSize: 14, fontWeight: '600' },
  mainButtonContainer: { marginBottom: 32 },
  loginBtnStyle: { paddingVertical: 18, borderRadius: 16 },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: -12, marginBottom: 12, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#9CA3AF', fontSize: 10, fontWeight: '700' },
  socialButtonsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', minHeight: 24 },
  registerText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  registerLink: { color: '#111827', fontSize: 14, fontWeight: '800' }
});
