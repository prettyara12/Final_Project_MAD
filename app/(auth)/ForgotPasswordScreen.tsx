import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../../components/InputField';
import { CustomButton } from '../../components/CustomButton';
import { useLanguage } from '../../context/LanguageContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1); // 1: Verify Email, 2: New Password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mutations
  const resetPassword = useMutation(api.users.resetPasswordByEmail);
  const verifyEmail = useMutation(api.users.checkUserExists);

  const handleVerifyEmail = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError(t('error_email_required'));
      return;
    }
    if (!normalizedEmail.includes('@')) {
      setError(t('error_email_invalid'));
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const exists = await verifyEmail({ email: normalizedEmail });
      if (exists) {
        setStep(2);
      } else {
        setError(t('user_not_found'));
      }
    } catch (e) {
      setError(t('error_system'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!newPassword) {
      setError(t('error_password_required'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('error_password_length'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('error_password_mismatch'));
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ email: normalizedEmail, newPassword });
      Alert.alert(
        t('berhasil'),
        t('password_reset_success'),
        [{ text: 'OK', onPress: () => router.replace('/login' as any) }]
      );
    } catch (e) {
      Alert.alert(t('error'), (e as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => step === 1 ? router.back() : setStep(1)}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name={step === 1 ? "mail-outline" : "lock-closed-outline"} size={40} color="#4F46E5" />
            </View>
            <Text style={styles.title}>{step === 1 ? t('forgot_password') : t('reset_password_btn')}</Text>
            <Text style={styles.subtitle}>
              {step === 1 ? t('forgot_password_desc') : t('confirm_password_placeholder')}
            </Text>
          </View>

          <View style={styles.cardContainer}>
            {step === 1 ? (
              <>
                <InputField
                  label={t('email_label')}
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.buttonWrapper}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#4F46E5" />
                  ) : (
                    <CustomButton
                      title={t('verify_email_btn')}
                      onPress={handleVerifyEmail}
                      style={styles.actionBtn}
                    />
                  )}
                </View>
              </>
            ) : (
              <>
                <InputField
                  label={t('password_label')}
                  placeholder={t('password_placeholder')}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <View style={{ height: 16 }} />
                <InputField
                  label={t('confirm_password_label')}
                  placeholder={t('confirm_password_placeholder')}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.buttonWrapper}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#4F46E5" />
                  ) : (
                    <CustomButton
                      title={t('reset_password_btn')}
                      onPress={handleResetPassword}
                      style={styles.actionBtn}
                    />
                  )}
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.footerLink} onPress={() => router.replace('/login' as any)}>
            <Text style={styles.footerLinkText}>{t('back_to_login')}</Text>
          </TouchableOpacity>
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginTop: 20, width: 40, height: 40, justifyContent: 'center' },
  header: { marginTop: 20, alignItems: 'center', marginBottom: 30 },
  iconContainer: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  cardContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 32, padding: 24, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3 },
  buttonWrapper: { marginTop: 24 },
  actionBtn: { paddingVertical: 18, borderRadius: 16, backgroundColor: '#111827' },
  errorText: { color: '#EF4444', fontSize: 13, marginTop: 8, fontWeight: '600' },
  footerLink: { marginTop: 32, alignItems: 'center' },
  footerLinkText: { color: '#4F46E5', fontSize: 16, fontWeight: '700' }
});
