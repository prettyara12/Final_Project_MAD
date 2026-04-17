import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { ProfileProvider } from "../context/ProfileContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ProfileProvider>
    </ThemeProvider>
  );
}
