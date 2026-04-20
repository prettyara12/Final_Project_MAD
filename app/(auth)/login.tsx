import React, { useState } from 'react';
import { Image } from 'react-native';
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
} from 'react-native';
import { useRouter } from 'expo-router';
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
      updateProfile({ email: email });
      router.replace('/HomeScreen');
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.container}>

            <View style={styles.header}>
              <Image 
                source={require('../../assets/images/logo.jpeg')} 
                style={styles.logo}
              />

              <Text style={styles.title}>
                Smart Learning Starts with
              </Text>

              <Text style={[styles.title, styles.titleHighlight]}>
                Partnership
              </Text>

              <Text style={styles.subtitle}>
                Lanjutkan perjalanan akademikmu hari ini.
              </Text>
            </View>

            <View style={styles.cardContainer}>

              {/* INPUT EMAIL */}
              <InputField
                label="Email"
                placeholder="alex@kampus.ac.id"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Text style={styles.errorText}>{errors.email || ' '}</Text>

              {/* INPUT PASSWORD */}
              <InputField
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Text style={styles.errorText}>{errors.password || ' '}</Text>

              {/* BUTTON LOGIN */}
              <CustomButton
                title="Masuk"
                onPress={handleLogin}
                style={styles.loginBtnStyle}
              />

              {/* DIVIDER */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ATAU</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* GOOGLE BUTTON (DI BAWAH) */}
              <TouchableOpacity
                style={styles.googleBtn}
                activeOpacity={0.7}
                onPress={() => console.log('Google login')}
              >
                <Image 
                  source={require('../../assets/images/goggle.png')} 
                  style={styles.googleIcon}
                />
                <Text style={styles.googleText}>
                  Lanjutkan dengan Google
                </Text>
              </TouchableOpacity>

            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Daftar</Text>
              </TouchableOpacity>
            </View>

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

  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  bgCircle1: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#E0E7FF',
    opacity: 0.6,
  },

  bgCircle2: {
    position: 'absolute',
    top: height * 0.2,
    right: -width * 0.3,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#F3E8FF',
    opacity: 0.5,
  },

  keyboardView: { flex: 1 },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
    textAlign: 'center',
  },

  titleHighlight: {
    color: '#4F46E5',
  },

  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 6,
  },

  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  googleText: {
    color: '#3C4043',
    fontWeight: '500',
    fontSize: 14,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: '#9CA3AF',
  },

  errorText: {
    color: 'red',
    fontSize: 11,
    marginBottom: 8,
  },

  loginBtnStyle: {
    marginTop: 10,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  registerText: { 
    color: '#6B7280',
    fontSize: 12,
  },

  registerLink: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 12,
  },
});