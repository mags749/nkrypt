import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";

import tamaguiConfig from "../../tamagui.config";
import { useColors, useThemeStore } from "@context/providers/themeStore";
import { useCategoryStore } from "@features/categories/store/categoryStore";
import { bootstrapDatabase } from "@infra/database/client";
import { CurrentToast, SessionGuard } from "@features/app";

const RootLayout = () => {
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
      <ToastProvider swipeDirection="up" duration={3000} native={false}>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
              <Stack.Screen name="settings/index" />
              <Stack.Screen name="settings/categories" />
              <Stack.Screen name="settings/change-passphrase" />
              <Stack.Screen name="settings/change-passkey" />
              <Stack.Screen
                name="modals/create-folder"
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/create-file"
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/passkey-prompt"
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
            </Stack>

            {/* Global top toast viewport */}
            <ToastViewport
              flexDirection="column"
              top="$4"
              left={0}
              right={0}
              alignItems="center"
              zIndex={1000000}
              position="absolute"
              pointerEvents="none"
            />
            <CurrentToast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ToastProvider>
    </TamaguiProvider>
  );
};

export default RootLayout;
