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
import { useLanguage } from '../../context/LanguageContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width, height } = Dimensions.get('window');

export default function TutorRegisterScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const createUser = useMutation(api.users.createUser);
  const createTutorProfile = useMutation(api.tutors.createTutorProfile);
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const handleRegister = async () => {
    let valid = true;
    let newErrors = { name: '', email: '', password: '' };

    if (!name.trim()) { newErrors.name = t('error_name_required'); valid = false; }
    if (!email.trim()) { newErrors.email = t('error_email_required'); valid = false; }
    else if (!email.includes('@')) { newErrors.email = t('error_email_invalid'); valid = false; }
    if (!password) { newErrors.password = t('error_password_required'); valid = false; }
    else if (password.length < 6) { newErrors.password = t('error_password_length'); valid = false; }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);
      try {
        const normalizedEmail = email.trim().toLowerCase();
        // 1. Create user in Convex as tutor
        const userId = await createUser({
          name: name,
          email: normalizedEmail,
          password: password,
          role: "tutor",
        });
        
        // 2. Create tutor profile
        await createTutorProfile({
          userId: userId,
          subjects: [], // Diisi nanti di dashboard
          bio: `Hi, I am ${name}!`, // Default bio
          availability: "", // Diisi nanti di dashboard
        });

        // 3. Update global profile state
        updateProfile({
          name: name,
          email: email,
        });
        
        Alert.alert(t('berhasil'), t('register_success'));
        router.replace('/tutor/TutorDashboardScreen' as any);
      } catch (error) {
        console.error("Convex Mutation Error:", error);
        Alert.alert(t('error'), t('register_failed') + ": " + (error as any).message);
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
            <Text style={styles.title}>{t('register_title')} 🚀</Text>
            <Text style={styles.subtitle}>
              {t('register_subtitle_tutor')}
            </Text>
          </View>

          <View style={styles.cardContainer}>
             <View style={styles.formContainer}>
               <InputField label={t('name_label')} placeholder={t('name_placeholder')} value={name} onChangeText={setName} />
               <Text style={styles.errorText}>{errors.name ? errors.name : ' '}</Text>

               <InputField label={t('email_label')} placeholder={t('email_placeholder')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
               <Text style={styles.errorText}>{errors.email ? errors.email : ' '}</Text>

               <InputField label={t('password_label')} placeholder={t('password_placeholder')} value={password} onChangeText={setPassword} secureTextEntry />
               <Text style={styles.errorText}>{errors.password ? errors.password : ' '}</Text>

               <View style={styles.mainButtonContainer}>
                 {isLoading ? (
                   <ActivityIndicator size="large" color="#4F46E5" />
                 ) : (
                   <CustomButton title={t('register_as_tutor_btn')} onPress={handleRegister} style={styles.registerBtnStyle} />
                 )}
               </View>
             </View>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t('already_have_account_tutor')} </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>{t('login_here')}</Text>
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
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' },
  loginText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  loginLink: { color: '#111827', fontSize: 14, fontWeight: '800' }
});
