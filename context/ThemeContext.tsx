import React, { createContext, useContext, useState, useCallback } from 'react';

// Color tokens for light and dark themes
export const LIGHT_THEME = {
  background: '#FAFAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',
  surfaceHover: '#F3F4F6',
  text: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#F3F4F6',
  borderAlt: '#E5E7EB',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryLighter: '#E0E7FF',
  accent: '#9333EA',
  accentLight: '#F3E8FF',
  card: '#FFFFFF',
  cardShadow: '#000',
  tabBar: '#FFFFFF',
  tabBarBorder: '#F3F4F6',
  inputBg: '#F9FAFB',
  inputBorder: '#E5E7EB',
  headerBg: '#FAFAFC',
  avatarBg: '#1E293B',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  success: '#16A34A',
  successLight: '#F0FDF4',
  isDark: false,
};

export const DARK_THEME = {
  background: '#0F0F14',
  surface: '#1A1A24',
  surfaceAlt: '#22222E',
  surfaceHover: '#2A2A38',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textMuted: '#64748B',
  border: '#2A2A38',
  borderAlt: '#334155',
  primary: '#6366F1',
  primaryLight: '#1E1B4B',
  primaryLighter: '#312E81',
  accent: '#A855F7',
  accentLight: '#2E1065',
  card: '#1A1A24',
  cardShadow: '#000',
  tabBar: '#1A1A24',
  tabBarBorder: '#2A2A38',
  inputBg: '#22222E',
  inputBorder: '#334155',
  headerBg: '#0F0F14',
  avatarBg: '#334155',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  success: '#22C55E',
  successLight: '#052E16',
  isDark: true,
};

export type ThemeColors = typeof LIGHT_THEME;

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: LIGHT_THEME,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const colors = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
