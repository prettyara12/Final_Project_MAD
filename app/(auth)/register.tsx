import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputField } from '../../components/InputField';
import { CustomButton } from '../../components/CustomButton';
import { useProfile } from '../../context/ProfileContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const createUser = useMutation(api.users.createUser);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleRegister = async () => {
    let valid = true;
    let newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!name.trim()) {
       newErrors.name = 'Nama lengkap diperlukan';
       valid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);
      console.log("Registering user:", { name, email });
      try {
        // Simpan ke Convex Database
        const result = await createUser({
          name: name,
          email: email,
          role: "learner", 
        });
        
        console.log("Successfully created user in Convex. ID:", result);

        // Update global profile state
        updateProfile({
          name: name,
          email: email,
        });
        
        router.replace('/HomeScreen' as any);
      } catch (error) {
        console.error("Convex Mutation Error:", error);
        Alert.alert("Error", "Gagal mendaftarkan akun ke database: " + (error as any).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Buat Akun{'\n'}Baru 🚀</Text>
            <Text style={styles.subtitle}>
              Bergabunglah dengan ekosistem belajar paling mutakhir saat ini.
            </Text>
          </View>

          <View style={styles.cardContainer}>
             <View style={styles.formContainer}>
               <InputField label="Nama Lengkap" placeholder="Cth: Nadiem Makarim" value={name} onChangeText={setName} />
               <Text style={styles.errorText}>{errors.name ? errors.name : ' '}</Text>

               <InputField label="Alamat Email" placeholder="kamu@universitas.ac.id" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
               <Text style={styles.errorText}>{errors.email ? errors.email : ' '}</Text>

               <InputField label="Kata Sandi" placeholder="Minimal 6 Karakter" value={password} onChangeText={setPassword} secureTextEntry />
               <Text style={styles.errorText}>{errors.password ? errors.password : ' '}</Text>

               <InputField label="Konfirmasi Kata Sandi" placeholder="Ulangi Kata Sandi" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
               <Text style={styles.errorText}>{errors.confirmPassword ? errors.confirmPassword : ' '}</Text>

               <View style={styles.mainButtonContainer}>
                 {isLoading ? (
                   <ActivityIndicator size="large" color="#4F46E5" />
                 ) : (
                   <CustomButton title="Daftar Sekarang" onPress={handleRegister} style={styles.registerBtnStyle} />
                 )}
               </View>

               <Text style={styles.termsText}>
                 Dengan mendaftar, kamu menyetujui <Text style={styles.termsHighlight}>Ketentuan Layanan</Text> dan <Text style={styles.termsHighlight}>Kebijakan Privasi</Text> kami.
               </Text>
             </View>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah memiliki akun? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  bgCircle1: { position: 'absolute', bottom: -height * 0.1, right: -width * 0.2, width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, backgroundColor: '#E0E7FF', opacity: 0.6 },
  bgCircle2: { position: 'absolute', top: height * 0.1, left: -width * 0.4, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: '#FCE7F3', opacity: 0.6 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 40 },
  header: { marginBottom: 32 },
  title: { fontSize: 36, fontWeight: '900', color: '#111827', marginBottom: 12, lineHeight: 44 },
  subtitle: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
  cardContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 32, padding: 24, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, marginBottom: 32 },
  formContainer: { marginBottom: 8 },
  mainButtonContainer: { marginTop: 24, marginBottom: 20 },
  registerBtnStyle: { paddingVertical: 18, borderRadius: 16, backgroundColor: '#111827' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: -12, marginBottom: 12, fontWeight: '600' },
  termsText: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 16, paddingHorizontal: 10 },
  termsHighlight: { color: '#4F46E5', fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' },
  loginText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  loginLink: { color: '#111827', fontSize: 14, fontWeight: '800' }
});
