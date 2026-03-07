import React, { useEffect, useRef } from "react";
import { Platform, TextInput, TouchableWithoutFeedback } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing } from "@shared/constants/design";

export const PASSKEY_MIN_LENGTH = 4;
export const PASSKEY_MAX_LENGTH = 6;
export const PASSKEY_MAX_VALUE = 999999;

// ─── PassKeyDots ──────────────────────────────────────────────────────────────

const PassKeyDots = ({
  value,
  maxLength,
}: {
  value: string;
  maxLength: number;
}) => {
  const colors = useColors();
  const visibleCount = Math.min(value.length + 1, maxLength);

  return (
    <XStack gap={Spacing.lg}>
      {Array.from({ length: visibleCount }, (_, i) => {
        const isFilled = i < value.length;
        return (
          <View
            key={i}
            width={16}
            height={16}
            borderRadius={8}
            borderWidth={2}
            backgroundColor={isFilled ? colors.textPrimary : "transparent"}
            borderColor={isFilled ? colors.textPrimary : colors.border}
          />
        );
      })}
    </XStack>
  );
};

// ─── PassKeyInput ─────────────────────────────────────────────────────────────

interface PassKeyInputProps {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  autoFocus?: boolean;
  showBiometric?: boolean;
  biometricType?: "fingerprint" | "facial";
  onBiometric?: () => void;
}

export const PassKeyInput = ({
  value,
  onChange,
  maxLength = PASSKEY_MAX_LENGTH,
  autoFocus = false,
  showBiometric = false,
  biometricType = "fingerprint",
  onBiometric,
}: PassKeyInputProps) => {
  const colors = useColors();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    const clamped = digits.slice(0, maxLength);
    if (clamped.length > 0 && parseInt(clamped, 10) > PASSKEY_MAX_VALUE) return;
    onChange(clamped);
  };

  const hint =
    value.length === 0
      ? `Tap to enter ${PASSKEY_MIN_LENGTH}–${maxLength} digit PIN`
      : value.length < PASSKEY_MIN_LENGTH
        ? `${PASSKEY_MIN_LENGTH - value.length} more digit${PASSKEY_MIN_LENGTH - value.length !== 1 ? "s" : ""} required`
        : "";

  return (
    <YStack alignItems="center" gap={Spacing.md}>
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View
          alignItems="center"
          paddingVertical={Spacing.md}
          paddingHorizontal={32}
          minWidth={200}
          minHeight={72}
          justifyContent="center"
        >
          <PassKeyDots value={value} maxLength={maxLength} />
          <Text
            color={colors.textTertiary}
            fontSize={12}
            letterSpacing={0.3}
            marginTop={Spacing.sm}
          >
            {hint}
          </Text>

          {/* Transparent full-area TextInput overlay */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={maxLength}
            caretHidden
            autoFocus={Platform.OS === "ios" ? autoFocus : false}
            showSoftInputOnFocus
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              color: "transparent",
            }}
            textContentType="oneTimeCode"
            importantForAutofill="no"
          />
        </View>
      </TouchableWithoutFeedback>

      {showBiometric && onBiometric && (
        <XStack
          onPress={onBiometric}
          width={52}
          height={52}
          borderRadius={Radius.lg}
          borderWidth={1}
          borderColor={colors.border}
          backgroundColor={colors.surface}
          alignItems="center"
          justifyContent="center"
          marginTop={Spacing.sm}
          pressStyle={{ opacity: 0.7 }}
        >
          <BxIcon
            name={biometricType === "facial" ? "bxs-face" : "bx-fingerprint"}
            size={22}
            color={colors.textPrimary}
          />
        </XStack>
      )}
    </YStack>
  );
};
