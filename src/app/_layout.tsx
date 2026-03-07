import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";
import {
  ToastProvider,
  Toast,
  useToastState,
  ToastViewport,
} from "@tamagui/toast";

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
      segments[0] === "settings" ||
      segments[0] === "modals";

    if (status === "unauthenticated" && inProtected) {
      router.replace("/auth/index");
    }
  }, [status, segments, router]);

  return null;
}

// ─── CurrentToast ─────────────────────────────────────────────────────────────

function CurrentToast() {
  const toast = useToastState();
  const isDark = useThemeStore((s) => s.isDark);

  if (!toast || toast.isHandledNatively) return null;

  // Theme-aware: black bg on light, white bg on dark
  const toastBg = isDark ? "#FFFFFF" : "#0A0A0B";
  const toastTextColor = isDark ? "#0A0A0B" : "#FFFFFF";

  return (
    <Toast
      key={toast.id}
      duration={toast.duration}
      viewportName={toast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.95, y: -8 }}
      exitStyle={{ opacity: 0, scale: 0.95, y: -8 }}
      transition="fast"
      backgroundColor={toastBg}
      borderRadius={100}
      paddingHorizontal={20}
      paddingVertical={10}
      shadowColor="#000"
      shadowOpacity={0.18}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 3 }}
      elevation={8}
    >
      <Toast.Title
        color={toastTextColor}
        fontSize={13}
        fontWeight="600"
        textAlign="center"
      >
        {toast.title}
      </Toast.Title>
      {!!toast.message && (
        <Toast.Description
          color={toastTextColor}
          fontSize={12}
          opacity={0.85}
          textAlign="center"
        >
          {toast.message}
        </Toast.Description>
      )}
    </Toast>
  );
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
}
