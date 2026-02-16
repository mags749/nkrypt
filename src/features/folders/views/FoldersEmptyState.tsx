import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing, Typography } from "@shared/constants/design";

export const FoldersEmptyState = () => {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <BxIcon name="bx-folder" size={42} color={colors.textTertiary} />
      <Text style={[styles.text, { color: colors.textTertiary }]}>
        {"No folders yet.\nTap + to create one."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 80, gap: Spacing.md },
  text: { ...Typography.bodyMD, textAlign: "center", lineHeight: 24 },
});
