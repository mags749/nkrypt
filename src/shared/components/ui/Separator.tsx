import React from "react";
import { View } from "tamagui";

import { useColors } from "@context/providers/themeStore";

export const Separator = () => {
  const colors = useColors();
  return <View height={1} backgroundColor={colors.separator} />;
};
