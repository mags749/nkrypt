import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

export const RowDivider = () => {
  const colors = useColors();
  return <View style={[styles.line, { backgroundColor: colors.border }]} />;
};

const styles = StyleSheet.create({
  line: { height: 1, marginLeft: Spacing.lg + 34 + Spacing.md },
});
