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
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../../components/InputField';
import { CustomButton } from '../../components/CustomButton';
import { useProfile } from '../../context/ProfileContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = () => {
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
      // Update global profile with login data
      updateProfile({
        email: email,
      });

      // Simulate login success and redirect to Dashboard Home
      router.replace('/HomeScreen' as any);
    }
  };

  const navigateToRegister = () => {
    router.push('/register' as any);
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
          
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.appName}>EduPartner AI</Text>
            </View>
            <Text style={styles.title}>Selamat Datang{'\n'}Kembali👋</Text>
            <Text style={styles.subtitle}>
              Lanjutkan perjalanan akademikmu yang menakjubkan hari ini.
            </Text>
          </View>

          {/* Floating Aesthetic Glass-like Card for Form */}
          <View style={styles.cardContainer}>
             
             {/* Google Login */}
             <View style={styles.googleSection}>
               <CustomButton
                 variant="secondary"
                 title="Lanjutkan dengan Google"
                 icon={<Ionicons name="logo-google" size={20} color="#111827" />}
                 onPress={() => console.log('Google login')}
                 style={styles.googleBtn}
               />
             </View>

             {/* Divider */}
             <View style={styles.dividerContainer}>
               <View style={styles.dividerLine} />
               <Text style={styles.dividerText}>ATAU LOG IN DENGAN</Text>
               <View style={styles.dividerLine} />
             </View>

             {/* Form Inputs */}
             <View style={styles.formContainer}>
               <InputField
                 label="Alamat Email"
                 placeholder="alex@universitas.ac.id"
                 value={email}
                 onChangeText={setEmail}
                 keyboardType="email-address"
                 autoCapitalize="none"
               />
               <Text style={styles.errorText}>{errors.email ? errors.email : ' '}</Text>

               <InputField
                 label="Kata Sandi"
                 placeholder="••••••••"
                 value={password}
                 onChangeText={setPassword}
                 secureTextEntry
                 rightLinkText="Lupa Sandi?"
                 onRightLinkPress={() => console.log('Forgot password')}
               />
               <Text style={styles.errorText}>{errors.password ? errors.password : ' '}</Text>

               <View style={styles.mainButtonContainer}>
                 <CustomButton
                   title="Masuk ke Atrium"
                   onPress={handleLogin}
                   style={styles.loginBtnStyle}
                 />
               </View>
             </View>
             
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Daftar Sekarang</Text>
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
    backgroundColor: '#F3F4F6', // Soft light gray
  },
  bgCircle1: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#E0E7FF', // very light indigo
    opacity: 0.6,
  },
  bgCircle2: {
    position: 'absolute',
    top: height * 0.2,
    right: -width * 0.3,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#F3E8FF', // very light purple
    opacity: 0.5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#4F46E5', // indigo main
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    transform: [{ rotate: '-10deg' }]
  },
  appName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827', 
    letterSpacing: 0.5,
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
  googleSection: {
    marginBottom: 24,
  },
  googleBtn: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6', 
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF', 
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  formContainer: {
    marginBottom: 8,
  },
  mainButtonContainer: {
    marginTop: 24,
  },
  loginBtnStyle: {
    paddingVertical: 18,
    borderRadius: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '800',
  }
});
