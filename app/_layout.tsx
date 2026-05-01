import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { ProfileProvider } from "../context/ProfileContext";
import { TutorSettingsProvider } from "../context/TutorSettingsContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
console.log("Initializing Convex with URL:", convexUrl);

if (!convexUrl) {
  console.error("EXPO_PUBLIC_CONVEX_URL is not defined! Check your .env.local file.");
}

const convex = new ConvexReactClient(convexUrl!);

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={AsyncStorage}>
      <ThemeProvider>
        <LanguageProvider>
          <ProfileProvider>
            <TutorSettingsProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </TutorSettingsProvider>
          </ProfileProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

