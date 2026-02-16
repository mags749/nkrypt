import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing, Typography } from "@shared/constants/design";

interface SectionGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const SectionGroup = ({ title, children }: SectionGroupProps) => {
  const colors = useColors();
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: colors.textTertiary }]}>
          {title.toUpperCase()}
        </Text>
      )}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  title: {
    ...Typography.labelSM,
    letterSpacing: 1.0,
    paddingHorizontal: Spacing.xs,
  },
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden" },
});
