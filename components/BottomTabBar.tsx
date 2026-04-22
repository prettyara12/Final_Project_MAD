import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const { colors } = useTheme();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  const TABS_CONFIG = [
    { id: 'HomeScreen', label: 'Beranda', iconActive: 'home', iconInactive: 'home-outline' },
    { id: 'TutorListScreen', label: 'Cari', iconActive: 'search', iconInactive: 'search-outline' },
    { id: 'SubjectScreen', label: 'Sesi', iconActive: 'book', iconInactive: 'book-outline' },
    { id: 'AIChatScreen', label: 'Chat AI', iconActive: 'chatbubbles', iconInactive: 'chatbubbles-outline' },
    { id: 'ProfileScreen', label: 'Profil', iconActive: 'person', iconInactive: 'person-outline' },
  ] as const;

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.tabBar, 
      borderTopColor: colors.tabBarBorder,
    }]}>
      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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

          const config = TABS_CONFIG.find(c => c.id === route.name);
          if (!config) return null;

          return (
            <TouchableOpacity 
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isFocused ? config.iconActive : config.iconInactive} 
                size={24} 
                color={isFocused ? colors.primary : colors.textMuted} 
              />
              <Text style={[
                styles.tabLabel, 
                { color: isFocused ? colors.primary : colors.textMuted }
              ]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
});
