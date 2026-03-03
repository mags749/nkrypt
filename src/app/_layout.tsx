import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

import tamaguiConfig from "../../tamagui.config";
import { useColors, useThemeStore } from "@context/providers/themeStore";
import { useCategoryStore } from "@features/categories/store/categoryStore";
import { useAuthStore } from "@features/auth/store/authStore";
import { bootstrapDatabase } from "@infra/database/client";

// ─── SessionGuard ─────────────────────────────────────────────────────────────

function SessionGuard() {
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    const inProtected =
      segments[0] === "folders" ||
      segments[0] === "files" ||
      segments[0] === "settings" ||
      segments[0] === "modals";

    if (status === "unauthenticated" && inProtected) {
      router.replace("/auth/index");
    }
  }, [status, segments, router]);

  return null;
}

export default function RootLayout() {
  const colors = useColors();
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    const init = async () => {
      await bootstrapDatabase();
      await useCategoryStore.getState().loadCategories();
    };
    void init();
  }, []);

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={isDark ? "dark" : "light"}
    >
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? "light" : "dark"} />
          <SessionGuard />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: "fade",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/eula" />
            <Stack.Screen name="auth/setup" />
            <Stack.Screen name="auth/index" />
            <Stack.Screen name="folders/index" />
            <Stack.Screen name="folders/[id]" />
            <Stack.Screen name="files/[id]" />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="settings/categories" />
            <Stack.Screen name="settings/change-passphrase" />
            <Stack.Screen name="settings/change-passkey" />
            <Stack.Screen
              name="modals/create-folder"
              options={{
                presentation: "transparentModal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="modals/create-file"
              options={{
                presentation: "transparentModal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="modals/passkey-prompt"
              options={{ presentation: "transparentModal", animation: "fade" }}
            />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
