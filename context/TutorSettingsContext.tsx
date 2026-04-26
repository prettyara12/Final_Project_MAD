import React, { createContext, useContext, useState, useCallback } from 'react';

interface TutorSettingsContextType {
  notifications: boolean;
  sounds: boolean;
  autoAccept: boolean;
  setNotifications: (val: boolean) => void;
  setSounds: (val: boolean) => void;
  setAutoAccept: (val: boolean) => void;
}

const TutorSettingsContext = createContext<TutorSettingsContextType>({
  notifications: true,
  sounds: true,
  autoAccept: false,
  setNotifications: () => {},
  setSounds: () => {},
  setAutoAccept: () => {},
});

export const TutorSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  return (
    <TutorSettingsContext.Provider value={{
      notifications, sounds, autoAccept,
      setNotifications, setSounds, setAutoAccept,
    }}>
      {children}
    </TutorSettingsContext.Provider>
  );
};

export const useTutorSettings = () => useContext(TutorSettingsContext);
