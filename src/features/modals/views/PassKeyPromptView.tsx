import React from "react";
import { Text, View, XStack, YStack } from "tamagui";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@context/providers/themeStore";
import { BlurModal } from "@shared/components/BlurModal";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { Button } from "@shared/components/ui";
import { Spacing, Radius } from "@shared/constants/design";
import { useEffect } from "react";

interface PassKeyPromptViewProps {
  mode?: "copy" | "reveal" | "copy-username";
  passKey: string;
  onPassKeyChange: (v: string) => void;
  error: string | null;
  isLoading: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  toastVisible: boolean;
  toastMessage: string;
  attemptCount: number;
}

export const PassKeyPromptView = ({
  mode,
  passKey,
  onPassKeyChange,
  error,
  isLoading,
  onConfirm,
  onDismiss,
  toastVisible,
  toastMessage,
  attemptCount,
}: PassKeyPromptViewProps) => {
  const colors = useColors();
  const modeLabel =
    mode === "copy" || mode === "copy-username" ? "Copy" : "Reveal";
  const subtitle =
    mode === "copy"
      ? "Enter your Pass Key to copy the credentials."
      : mode === "copy-username"
        ? "Enter your Pass Key to copy the username."
        : "Enter your Pass Key to reveal the credentials.";

  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(20);

  useEffect(() => {
    if (toastVisible) {
      toastOpacity.value = withTiming(1, { duration: 200 });
      toastTranslateY.value = withTiming(0, { duration: 200 });
    } else {
      toastOpacity.value = withTiming(0, { duration: 300 });
      toastTranslateY.value = withTiming(20, { duration: 300 });
    }
  }, [toastVisible]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  const isLastAttemptWarning = attemptCount === 2;

  return (
    <BlurModal visible onDismiss={onDismiss} position="flex-end">
      <YStack gap={Spacing.xs} marginBottom={Spacing["2xl"]}>
        <Text
          fontSize={22}
          fontWeight="700"
          letterSpacing={-0.3}
          color={colors.textPrimary}
        >
          Verify Pass Key
        </Text>
        <Text fontSize={15} color={colors.textSecondary}>
          {subtitle}
        </Text>
      </YStack>

      <YStack alignItems="center" marginBottom={Spacing.lg} gap={Spacing.sm}>
        <PassKeyInput value={passKey} onChange={onPassKeyChange} autoFocus />
        {error && (
          <Text color={colors.error} fontSize={12} textAlign="center">
            {error}
          </Text>
        )}
        {isLastAttemptWarning && !error && (
          <Text color={colors.error} fontSize={12} textAlign="center" fontWeight="600">
            ⚠️ Last attempt before logout
          </Text>
        )}
      </YStack>

      <XStack
        alignItems="center"
        justifyContent="flex-end"
        gap={Spacing.lg}
        marginTop={Spacing.sm}
      >
        <XStack onPress={onDismiss} pressStyle={{ opacity: 0.7 }}>
          <Text
            color={colors.textSecondary}
            fontSize={12}
            fontWeight="600"
            letterSpacing={1.5}
          >
            CANCEL
          </Text>
        </XStack>
        <Button
          label={modeLabel}
          onPress={onConfirm}
          loading={isLoading}
          loadingLabel="Verifying…"
          size="md"
        />
      </XStack>

      {/* Toast notification */}
      <Animated.View
        style={[
          toastStyle,
          {
            position: "absolute",
            bottom: -16,
            left: 0,
            right: 0,
            alignItems: "center",
            pointerEvents: "none",
          },
        ]}
      >
        <View
          backgroundColor={attemptCount >= 3 ? colors.error : colors.surfaceElevated}
          paddingHorizontal={Spacing.lg}
          paddingVertical={Spacing.sm}
          borderRadius={Radius.full}
          maxWidth="90%"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            fontSize={13}
            fontWeight="600"
            color={attemptCount >= 3 ? "#fff" : colors.textPrimary}
            textAlign="center"
          >
            {toastMessage}
          </Text>
        </View>
      </Animated.View>
    </BlurModal>
  );
};
