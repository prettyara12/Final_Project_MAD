import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../components/BottomTabBar';
import { useTheme } from '../../context/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="TutorListScreen"
        options={{
          title: 'Cari',
        }}
      />
      <Tabs.Screen
        name="SubjectScreen"
        options={{
          title: 'Sesi',
        }}
      />
      <Tabs.Screen
        name="AIChatScreen"
        options={{
          title: 'AI Chat',
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profil',
        }}
      />

      {/* Screens that share the tab layout but are not primary tabs */}
      <Tabs.Screen
        name="BookingScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="NotificationScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="ProgressScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="SubjectDetailScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="TutorProfileScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="AIPreferenceScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="AIResultScreen"
        options={{ href: null }}
      />
    </Tabs>
  );
}
