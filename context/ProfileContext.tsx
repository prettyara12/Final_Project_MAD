import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  university: string;
  major: string;
  year: string;
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
}

const ProfileContext = createContext<ProfileContextType>({
  profileData: DEFAULT_PROFILE,
  updateProfile: () => {},
  setProfileData: () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);

  const updateProfile = useCallback((data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
