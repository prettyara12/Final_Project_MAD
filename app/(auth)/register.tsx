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
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../../components/InputField';
import { CustomButton } from '../../components/CustomButton';
import { useProfile } from '../../context/ProfileContext';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleRegister = () => {
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
      // Update global profile with registration data
      updateProfile({
        name: name,
        email: email,
      });
      
      // Simulate registration
      router.replace('/HomeScreen' as any);
    }
  };

  const navigateToLogin = () => {
    router.back(); // Goes back to the login screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Decorative Abstract Background Elements */}
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

          {/* Form Card */}
          <View style={styles.cardContainer}>
            
             <View style={styles.formContainer}>
               <InputField
                 label="Nama Lengkap"
                 placeholder="Cth: Nadiem Makarim"
                 value={name}
                 onChangeText={setName}
               />
               <Text style={styles.errorText}>{errors.name ? errors.name : ' '}</Text>

               <InputField
                 label="Alamat Email"
                 placeholder="kamu@universitas.ac.id"
                 value={email}
                 onChangeText={setEmail}
                 keyboardType="email-address"
                 autoCapitalize="none"
               />
               <Text style={styles.errorText}>{errors.email ? errors.email : ' '}</Text>

               <InputField
                 label="Kata Sandi"
                 placeholder="Minimal 6 Karakter"
                 value={password}
                 onChangeText={setPassword}
                 secureTextEntry
               />
               <Text style={styles.errorText}>{errors.password ? errors.password : ' '}</Text>

               <InputField
                 label="Konfirmasi Kata Sandi"
                 placeholder="Ulangi Kata Sandi"
                 value={confirmPassword}
                 onChangeText={setConfirmPassword}
                 secureTextEntry
               />
               <Text style={styles.errorText}>{errors.confirmPassword ? errors.confirmPassword : ' '}</Text>

               <View style={styles.mainButtonContainer}>
                 <CustomButton
                   title="Daftar Sekarang"
                   onPress={handleRegister}
                   style={styles.registerBtnStyle}
                 />
               </View>

               <Text style={styles.termsText}>
                 Dengan mendaftar, kamu menyetujui <Text style={styles.termsHighlight}>Ketentuan Layanan</Text> dan <Text style={styles.termsHighlight}>Kebijakan Privasi</Text> kami.
               </Text>
             </View>
             
          </View>

          {/* Login Link */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6', 
  },
  bgCircle1: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: '#E0E7FF',
    opacity: 0.6,
  },
  bgCircle2: {
    position: 'absolute',
    top: height * 0.1,
    left: -width * 0.4,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#FCE7F3', // very light pink for variety
    opacity: 0.6,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 8,
  },
  mainButtonContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  registerBtnStyle: {
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: '#111827', // Black premium button
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  termsHighlight: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  }
});
