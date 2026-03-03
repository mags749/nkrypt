import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Modal } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Radius, Shadow, Spacing } from "@shared/constants/design";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({
  visible,
  message = "Processing…",
}: LoadingOverlayProps) => {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      statusBarTranslucent
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            borderRadius: Radius.xl,
            paddingVertical: Spacing["3xl"],
            paddingHorizontal: Spacing["4xl"],
            alignItems: "center",
            gap: Spacing.lg,
            minWidth: 160,
            backgroundColor: colors.surface,
            ...Shadow.xl,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <ActivityIndicator size="large" color={colors.textPrimary} />
          <Text color={colors.textSecondary} fontSize={15} textAlign="center">
            {message}
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export const InlineSpinner = ({ color }: { color: string }) => (
  <ActivityIndicator size="small" color={color} />
);
