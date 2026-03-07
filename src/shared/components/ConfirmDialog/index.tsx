import React from "react";
import { Dialog, XStack, YStack, Text } from "tamagui";
import { useColors } from "@context/providers/themeStore";
import { Button } from "@shared/components/ui";
import { Spacing } from "@shared/constants/design";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  titleColor?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  titleColor,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const colors = useColors();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          transition="fast"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0,0,0,0.5)"
        />
        <Dialog.Content
          transition="fast"
          enterStyle={{ opacity: 0, scale: 0.95 }}
          exitStyle={{ opacity: 0, scale: 0.95 }}
          backgroundColor={colors.surfaceElevated}
          borderRadius={16}
          padding={Spacing["2xl"]}
          maxWidth={340}
          width="90%"
          unstyled
          elevate
        >
          <YStack gap={Spacing.md}>
            <Dialog.Title
              color={titleColor ?? colors.textPrimary}
              fontSize={18}
              fontWeight="700"
            >
              {title}
            </Dialog.Title>
            <Dialog.Description color={colors.textSecondary} fontSize={14}>
              {description}
            </Dialog.Description>
            <XStack
              gap={Spacing.md}
              justifyContent="flex-end"
              marginTop={Spacing.sm}
            >
              {onCancel !== undefined || cancelLabel ? (
                <Button
                  label={cancelLabel}
                  variant="ghost"
                  size="sm"
                  onPress={() => {
                    onCancel?.();
                    onOpenChange(false);
                  }}
                />
              ) : null}
              <Button
                label={confirmLabel}
                variant={variant === "danger" ? "danger" : "primary"}
                size="sm"
                onPress={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
              />
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
