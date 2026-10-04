import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  SourceSerif4_400Regular,
  SourceSerif4_600SemiBold,
  SourceSerif4_700Bold,
} from "@expo-google-fonts/source-serif-4";
import { queryClient } from "@/config/queryClient";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import "../global.css";
import { useColorScheme } from "nativewind";
import { useThemeColors } from "@/theme/useThemeColors";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { colorScheme } = useColorScheme();
  const colors = useThemeColors();
  const isBootstrapping = useProtectedRoute();
  const [fontsLoaded] = useFonts({
    SourceSerif4_400Regular,
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
  });

  useEffect(() => {
    if (!isBootstrapping && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isBootstrapping, fontsLoaded]);

  if (isBootstrapping || !fontsLoaded) return null;

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { color: colors.foreground },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}