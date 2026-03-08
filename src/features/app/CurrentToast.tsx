import React from "react";
import { Toast, useToastState } from "@tamagui/toast";
import { useThemeStore } from "@context/providers/themeStore";

export const CurrentToast = () => {
  const toast = useToastState();
  const isDark = useThemeStore((s) => s.isDark);

  if (!toast || toast.isHandledNatively) return null;

  const toastBg = isDark ? "#FFFFFF" : "#0A0A0B";
  const toastTextColor = isDark ? "#0A0A0B" : "#FFFFFF";

  return (
    <Toast
      key={toast.id}
      duration={toast.duration}
      viewportName={toast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.95, y: -8 }}
      exitStyle={{ opacity: 0, scale: 0.95, y: -8 }}
      transition="fast"
      backgroundColor={toastBg}
      borderRadius={100}
      paddingHorizontal={20}
      paddingVertical={10}
      shadowColor="#000"
      shadowOpacity={0.18}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 3 }}
      elevation={8}
    >
      <Toast.Title
        color={toastTextColor}
        fontSize={13}
        fontWeight="600"
        textAlign="center"
      >
        {toast.title}
      </Toast.Title>
      {!!toast.message && (
        <Toast.Description
          color={toastTextColor}
          fontSize={12}
          opacity={0.85}
          textAlign="center"
        >
          {toast.message}
        </Toast.Description>
      )}
    </Toast>
  );
};
