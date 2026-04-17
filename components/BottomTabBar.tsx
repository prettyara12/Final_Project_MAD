import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const { colors, isDark } = useTheme();

  const TABS_CONFIG = [
    { id: 'HomeScreen', label: 'Beranda', iconActive: 'home', iconInactive: 'home-outline' },
    { id: 'TutorListScreen', label: 'Cari', iconActive: 'search', iconInactive: 'search-outline' },
    { id: 'SubjectScreen', label: 'Sesi', iconActive: 'book', iconInactive: 'book-outline' },
    { id: 'AIChatScreen', label: 'Chat AI', iconActive: 'chatbubbles', iconInactive: 'chatbubbles-outline' },
    { id: 'ProfileScreen', label: 'Profil', iconActive: 'person', iconInactive: 'person-outline' },
  ] as const;

  return (
    <View style={[styles.bottomTabBar, { 
      backgroundColor: colors.tabBar, 
      borderTopColor: colors.tabBarBorder 
    }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Find match in config for icons
        const config = TABS_CONFIG.find(c => c.id === route.name);
        if (!config) return null;

        return (
          <TouchableOpacity 
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[
              styles.iconContainer, 
              isFocused ? { backgroundColor: colors.primaryLight } : null
            ]}>
              <Ionicons 
                name={isFocused ? config.iconActive : config.iconInactive} 
                size={22} 
                color={isFocused ? colors.primary : colors.textMuted} 
              />
            </View>
            <Text style={[
              styles.tabLabel, 
              { color: colors.textMuted },
              isFocused && { color: colors.primary, fontWeight: '700' }
            ]}>
              {config.label}
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
