import { Tabs } from 'expo-router';
import { TutorTabBar } from '../../components/TutorTabBar';

export default function TutorTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TutorTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="TutorDashboardScreen"
        options={{ title: 'Beranda' }}
      />
      <Tabs.Screen
        name="RequestsScreen"
        options={{ title: 'Permintaan' }}
      />
      <Tabs.Screen
        name="TutorChatListScreen"
        options={{ title: 'Pesan' }}
      />
      <Tabs.Screen
        name="TutorSessionsScreen"
        options={{ title: 'Sesi' }}
      />
      <Tabs.Screen
        name="TutorProfileScreen"
        options={{ title: 'Profil' }}
      />

      {/* Hidden screens (accessible via navigation, not shown in tab bar) */}
      <Tabs.Screen name="EditProfileScreen" options={{ href: null }} />
      <Tabs.Screen name="SubjectsScreen" options={{ href: null }} />
      <Tabs.Screen name="AvailabilityScreen" options={{ href: null }} />
      <Tabs.Screen name="SettingsScreen" options={{ href: null }} />
    </Tabs>
  );
}
