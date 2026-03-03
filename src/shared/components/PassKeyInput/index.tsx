import React, { useRef } from "react";
import { Platform, TextInput } from "react-native";
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

  const displayDots = Array.from({ length: visibleCount }, (_, i) => {
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
  });

  return <XStack gap={Spacing.lg}>{displayDots}</XStack>;
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

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    const clamped = digits.slice(0, maxLength);
    if (clamped.length > 0 && parseInt(clamped, 10) > PASSKEY_MAX_VALUE) return;
    onChange(clamped);
  };

  return (
    <YStack
      alignItems="center"
      gap={Spacing.md}
      onPress={() => inputRef.current?.focus()}
    >
      {/* Hidden native input drives the keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
        maxLength={maxLength}
        autoFocus={autoFocus}
        caretHidden
        style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
        textContentType="oneTimeCode"
        importantForAutofill="no"
      />

      <PassKeyDots value={value} maxLength={maxLength} />

      <Text
        color={colors.textTertiary}
        fontSize={12}
        letterSpacing={0.3}
        height={16}
      >
        {value.length === 0
          ? `Tap to enter ${PASSKEY_MIN_LENGTH}–${maxLength} digit PIN`
          : value.length < PASSKEY_MIN_LENGTH
            ? `${PASSKEY_MIN_LENGTH - value.length} more digit${PASSKEY_MIN_LENGTH - value.length !== 1 ? "s" : ""} required`
            : ""}
      </Text>

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
