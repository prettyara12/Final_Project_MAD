import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Platform, KeyboardAvoidingView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useLanguage } from '../../context/LanguageContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profileData, updateProfile } = useProfile();
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const user = useQuery(api.users.getUserByEmail, profileData?.email ? { email: profileData.email } : "skip");
  const updateUser = useMutation(api.users.updateUser);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setUniversity(user.university || '');
      setMajor(user.major || '');
      setAddress(user.address || '');
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImage(base64Image);
    }
  };

  const handleSave = async () => {
    if (!user || !name.trim()) {
      Alert.alert(t('error'), t('error_name_empty'));
      return;
    }
    setIsSaving(true);
    try {
      await updateUser({
        id: user._id,
        name: name.trim(),
        phone: phone.trim(),
        university: university.trim(),
        major: major.trim(),
        address: address.trim(),
        profileImage: profileImage || undefined,
      });
      updateProfile({ 
        ...profileData, 
        name: name.trim(),
        profileImage: profileImage || undefined
      });
      Alert.alert(t('berhasil'), t('profile_updated_success'));
      router.push('/tutor/TutorProfileScreen' as any);
    } catch (e) {
      console.error(e);
      Alert.alert(t('error'), t('profile_update_error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.push('/tutor/TutorProfileScreen' as any)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('edit_profile')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={36} color="#FFFFFF" />
              )}
            </View>
            <TouchableOpacity 
              style={[styles.changePhotoBtn, { backgroundColor: colors.primaryLight }]}
              onPress={pickImage}
            >
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>{t('change_photo')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('fullname_label')}</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]} value={name} onChangeText={setName} placeholder={t('name_placeholder')} placeholderTextColor={colors.textMuted} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('email_label')}</Text>
              <TextInput style={[styles.input, styles.inputDisabled, { backgroundColor: colors.border, color: colors.textMuted, borderColor: colors.inputBorder }]} value={user.email} editable={false} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('phone_number_label')}</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]} value={phone} onChangeText={setPhone} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" placeholderTextColor={colors.textMuted} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('university_label')}</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]} value={university} onChangeText={setUniversity} placeholder={t('university_label')} placeholderTextColor={colors.textMuted} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('major_label')}</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]} value={major} onChangeText={setMajor} placeholder={t('major_label')} placeholderTextColor={colors.textMuted} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('address_label')}</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]} value={address} onChangeText={setAddress} placeholder={t('address_label')} multiline placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: colors.primary }, isSaving && { opacity: 0.7 }]} 
            onPress={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>{t('save_changes_btn')}</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 44 : 12, paddingBottom: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  changePhotoBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#EEF2FF' },
  changePhotoText: { color: '#4F46E5', fontSize: 13, fontWeight: '700' },
  formCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#F3F4F6',
  },
  inputDisabled: { backgroundColor: '#F3F4F6', color: '#9CA3AF' },
  saveBtn: {
    backgroundColor: '#4F46E5', borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
