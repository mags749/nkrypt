import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing } from "@shared/constants/design";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

// ─── PinDots ──────────────────────────────────────────────────────────────────

const PinDots = ({
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

// ─── PinKey ───────────────────────────────────────────────────────────────────

const PinKey = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const colors = useColors();

  if (!label) return <View style={styles.key} />;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[
        styles.key,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <Text
        style={[
          styles.keyText,
          { color: label === "⌫" ? colors.error : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ─── PinPad ───────────────────────────────────────────────────────────────────

export const PinPad = ({ value, onChange, maxLength = 6 }: PinPadProps) => {
  const handlePress = (key: string) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
    } else if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <View style={styles.container}>
      <PinDots value={value} maxLength={maxLength} />
      <View style={styles.grid}>
        {KEYS.map((key, i) => (
          <PinKey key={i} label={key} onPress={() => handlePress(key)} />
        ))}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: Spacing["2xl"] },
  dots: { flexDirection: "row", gap: Spacing.lg },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
    width: 264,
  },
  key: {
    width: 80,
    height: 68,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: { fontSize: 24, fontWeight: "300" },
});
