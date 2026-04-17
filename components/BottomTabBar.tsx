import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

interface BottomTabBarProps {
  activeRoute: 'home' | 'search' | 'session' | 'chat' | 'profile';
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeRoute }) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const TABS = [
    { id: 'home', label: 'Beranda', iconActive: 'home', iconInactive: 'home-outline', route: '/HomeScreen' },
    { id: 'search', label: 'Cari', iconActive: 'search', iconInactive: 'search-outline', route: '/TutorListScreen' },
    { id: 'session', label: 'Sesi', iconActive: 'book', iconInactive: 'book-outline', route: '/SubjectScreen' },
    { id: 'chat', label: 'Chat AI', iconActive: 'chatbubbles', iconInactive: 'chatbubbles-outline', route: '/AIChatScreen' },
    { id: 'profile', label: 'Profil', iconActive: 'person', iconInactive: 'person-outline', route: '/ProfileScreen' },
  ] as const;

  return (
    <View style={[styles.bottomTabBar, { 
      backgroundColor: colors.tabBar, 
      borderTopColor: colors.tabBarBorder 
    }]}>
      {TABS.map((tab) => {
        const isActive = activeRoute === tab.id;
        return (
          <TouchableOpacity 
            key={tab.id}
            style={styles.tabItem} 
            onPress={() => {
              if (!isActive) {
                router.replace(tab.route as any);
              }
            }}
          >
            <View style={[
              styles.iconContainer, 
              isActive && [styles.activeTabIconWrap, { backgroundColor: colors.primaryLight }]
            ]}>
              <Ionicons 
                name={isActive ? tab.iconActive : tab.iconInactive} 
                size={22} 
                color={isActive ? colors.primary : colors.textMuted} 
              />
            </View>
            <Text style={[
              styles.tabLabel, 
              { color: colors.textMuted },
              isActive && { color: colors.primary, fontWeight: '700' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  iconContainer: {
    width: 48,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 4,
  },
  activeTabIconWrap: {},
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
