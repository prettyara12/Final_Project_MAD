import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const getTabsConfig = (t: any) => [
  { id: 'TutorDashboardScreen', label: t('tab_home'), iconActive: 'home', iconInactive: 'home-outline' },
  { id: 'RequestsScreen', label: t('tab_requests'), iconActive: 'mail', iconInactive: 'mail-outline' },
  { id: 'TutorChatListScreen', label: t('tab_messages'), iconActive: 'chatbubbles', iconInactive: 'chatbubbles-outline' },
  { id: 'TutorSessionsScreen', label: t('tab_sessions'), iconActive: 'calendar', iconInactive: 'calendar-outline' },
  { id: 'TutorProfileScreen', label: t('tab_profile'), iconActive: 'person', iconInactive: 'person-outline' },
] as const;

export const TutorTabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const { colors } = useTheme();
  const { t } = useLanguage();
  const TABS_CONFIG = getTabsConfig(t);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
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
              <View style={[
                styles.iconContainer, 
                isFocused && { backgroundColor: colors.primaryLight }
              ]}>
                <Ionicons
                  name={isFocused ? config.iconActive : config.iconInactive}
                  size={22}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? colors.primary : colors.textMuted },
                isFocused && styles.tabLabelActive,
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
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 25 : 4,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
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
    paddingTop: 8,
  },
  iconContainer: {
    width: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
