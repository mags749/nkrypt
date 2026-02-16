import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon, type BxIconName } from "@shared/components/BxIcon";

interface ActionBtnProps {
  icon: BxIconName;
  onPress: () => void;
  colorOverride?: string;
}

export const ActionBtn = ({ icon, onPress, colorOverride }: ActionBtnProps) => {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.btn, { backgroundColor: colorOverride ?? colors.accent }]}
    >
      <BxIcon name={icon} size={17} color={colors.accentForeground} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
