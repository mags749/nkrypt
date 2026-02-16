/**
 * PassKeyInput — Numeric passcode input using the device's native number pad.
 *
 * Requirements:
 *   - Numeric only, 4-6 digits, max value 999999
 *   - Uses native numeric keypad (not a custom PinPad)
 *   - Shows masked dots for entered digits
 *   - Optional biometric shortcut button
 */

import React, { useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing } from "@shared/constants/design";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  const dots = Array.from({ length: maxLength }, (_, i) => i < value.length);

  return (
    <View style={styles.dots}>
      {dots.map((filled, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: filled ? colors.textPrimary : "transparent",
              borderColor: filled ? colors.textPrimary : colors.border,
            },
          ]}
        />
      ))}
    </View>
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

  const handleChange = (text: string) => {
    // Strip non-digits
    const digits = text.replace(/\D/g, "");
    // Enforce max length
    const clamped = digits.slice(0, maxLength);
    // Enforce max value (999999)
    if (clamped.length > 0 && parseInt(clamped, 10) > PASSKEY_MAX_VALUE) return;
    onChange(clamped);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
    >
      {/* Hidden text input that drives the keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
        maxLength={maxLength}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hiddenInput}
        textContentType="oneTimeCode"
        importantForAutofill="no"
      />

      {/* Visual dot display */}
      <PassKeyDots value={value} maxLength={maxLength} />

      {/* Hint text */}
      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        {value.length === 0
          ? `Tap to enter ${PASSKEY_MIN_LENGTH}–${maxLength} digit PIN`
          : value.length < PASSKEY_MIN_LENGTH
            ? `${PASSKEY_MIN_LENGTH - value.length} more digit${PASSKEY_MIN_LENGTH - value.length !== 1 ? "s" : ""} required`
            : ""}
      </Text>

      {/* Biometric button */}
      {showBiometric && onBiometric && (
        <TouchableOpacity
          onPress={onBiometric}
          activeOpacity={0.7}
          style={[
            styles.bioBtn,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <BxIcon
            name={biometricType === "facial" ? "bxs-face" : "bx-fingerprint"}
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.md,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  dots: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  hint: {
    fontSize: 12,
    letterSpacing: 0.3,
    height: 16,
  },
  bioBtn: {
    marginTop: Spacing.sm,
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
