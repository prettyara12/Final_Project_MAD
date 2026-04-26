import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  university: string;
  major: string;
  year: string;
  profileImage?: string;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Pelajar EduPartner',
  email: '-',
  phone: '-',
  address: '-',
  university: '-',
  major: '-',
  year: '-',
};

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profileData: DEFAULT_PROFILE,
  updateProfile: () => {},
  setProfileData: () => {},
  clearProfile: () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);

  const updateProfile = useCallback((data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  }, []);

  const clearProfile = useCallback(() => {
    setProfileData(DEFAULT_PROFILE);
  }, []);

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile, setProfileData, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
