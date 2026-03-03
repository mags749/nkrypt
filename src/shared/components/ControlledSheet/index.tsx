import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing } from "@shared/constants/design";
import React from "react";
import { Sheet, Spacer, YStack } from "tamagui";

interface CustomSheetProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxWidth?: number | string;
}

export const ControlledSheet = ({
  children,
  open,
  onOpenChange,
  maxWidth = 400,
}: CustomSheetProps) => {
  const colors = useColors();

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      dismissOnSnapToBottom
      transition="medium"
      modal
      snapPointsMode="fit"
    >
      <Sheet.Overlay
        transition="slow"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0,0,0,0.5)" // Semi-transparent black
      />
      <Sheet.Handle />
      <Sheet.Frame
        paddingHorizontal={Spacing["2xl"]}
        justifyContent="center"
        alignItems="center"
        // Constraints
        maxWidth={maxWidth}
        alignSelf="center"
        // This ensures the frame doesn't stretch to full screen on web/tablet
        width="100%"
        backgroundColor={colors.surfaceElevated}
        height="auto"
        flex={0}
        borderTopLeftRadius={Radius.xl}
        borderTopRightRadius={Radius.xl}
      >
        <YStack width="100%" height="auto">
          <Spacer size="$4" />
          {children}
          <Spacer size="$6" />
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
