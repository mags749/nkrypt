import React from "react";
import { Switch } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { BlurModal } from "@shared/components/BlurModal";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Radius, Spacing } from "@shared/constants/design";

interface CreateFileViewProps {
  isEditing: boolean;
  fileKey: string;
  onKeyChange: (v: string) => void;
  value: string;
  onValueChange: (v: string) => void;
  isEncrypted: boolean;
  onEncryptedChange: (v: boolean) => void;
  isLink: boolean;
  onLinkChange: (v: boolean) => void;
  showValue: boolean;
  onToggleShowValue: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
  onSave: () => void;
  onClose: () => void;
}

export const CreateFileView = ({
  isEditing,
  fileKey,
  onKeyChange,
  value,
  onValueChange,
  isEncrypted,
  onEncryptedChange,
  isLink,
  onLinkChange,
  showValue,
  onToggleShowValue,
  isLoading,
  errors,
  onSave,
  onClose,
}: CreateFileViewProps) => {
  const colors = useColors();

  return (
    <BlurModal visible onDismiss={onClose} position="flex-end">
      <LoadingOverlay
        visible={isLoading}
        message={isEditing ? "Updating entry…" : "Saving entry…"}
      />

      {/* Header */}
      <XStack
        alignItems="flex-start"
        justifyContent="space-between"
        marginBottom={Spacing["2xl"]}
        gap={Spacing.md}
      >
        <YStack flex={1} gap={Spacing.xs}>
          <Text
            fontSize={22}
            fontWeight="700"
            letterSpacing={-0.3}
            color={colors.textPrimary}
          >
            {isEditing ? "Edit Entry" : "New Entry"}
          </Text>
          <Text fontSize={15} color={colors.textSecondary}>
            {isEditing
              ? "Update the entry details below."
              : "Add a key/value pair to this folder."}
          </Text>
        </YStack>
        <XStack onPress={onClose} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-x" size={22} color={colors.textSecondary} />
        </XStack>
      </XStack>

      {/* Key field */}
      <InputField
        label="Key"
        value={fileKey}
        onChangeText={onKeyChange}
        placeholder="e.g. Site, Username, Password"
        autoFocus
        error={errors.key}
      />

      {/* Value field */}
      <View position="relative">
        <InputField
          label={isEditing ? "Value (blank = keep current)" : "Value"}
          value={value}
          onChangeText={onValueChange}
          placeholder={isEncrypted ? "Encrypted value" : "Plain text value"}
          secureTextEntry={isEncrypted && !showValue}
          error={errors.value}
        />
        {isEncrypted && (
          <XStack
            onPress={onToggleShowValue}
            position="absolute"
            right={0}
            bottom={Spacing.xl}
            padding={Spacing.sm}
            pressStyle={{ opacity: 0.7 }}
          >
            <BxIcon
              name={showValue ? "bx-hide" : "bx-show"}
              size={18}
              color={colors.textTertiary}
            />
          </XStack>
        )}
      </View>

      {/* Toggle: Encrypted */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        padding={Spacing.md}
        borderRadius={Radius.md}
        backgroundColor={colors.surfaceSecondary}
        marginBottom={Spacing.sm}
        opacity={isLink ? 0.4 : 1}
      >
        <XStack alignItems="center" gap={Spacing.sm} flex={1}>
          <BxIcon
            name="bx-lock-alt"
            size={16}
            color={isEncrypted && !isLink ? colors.accent : colors.textTertiary}
          />
          <YStack flex={1}>
            <Text fontSize={14} fontWeight="600" color={colors.textPrimary}>
              Encrypt value
            </Text>
            <Text fontSize={12} color={colors.textTertiary} lineHeight={18}>
              {isLink
                ? "Links cannot be encrypted"
                : "Protect with AES-256 using your Pass Key"}
            </Text>
          </YStack>
        </XStack>
        <Switch
          value={isEncrypted && !isLink}
          onValueChange={(v) => !isLink && onEncryptedChange(v)}
          disabled={isLink}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </XStack>

      {/* Toggle: Link */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        padding={Spacing.md}
        borderRadius={Radius.md}
        backgroundColor={colors.surfaceSecondary}
        marginBottom={Spacing.sm}
      >
        <XStack alignItems="center" gap={Spacing.sm} flex={1}>
          <BxIcon
            name="bx-link-external"
            size={16}
            color={isLink ? colors.accent : colors.textTertiary}
          />
          <YStack flex={1}>
            <Text fontSize={14} fontWeight="600" color={colors.textPrimary}>
              Mark as link
            </Text>
            <Text fontSize={12} color={colors.textTertiary} lineHeight={18}>
              Value is a URL that can be opened
            </Text>
          </YStack>
        </XStack>
        <Switch
          value={isLink}
          onValueChange={(v) => {
            onLinkChange(v);
            if (v) onEncryptedChange(false);
          }}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </XStack>

      {errors.general && (
        <Text
          color={colors.error}
          fontSize={13}
          textAlign="center"
          marginBottom={Spacing.sm}
        >
          {errors.general}
        </Text>
      )}

      <XStack
        alignItems="center"
        justifyContent="flex-end"
        gap={Spacing.lg}
        marginTop={Spacing.sm}
      >
        <XStack onPress={onClose} pressStyle={{ opacity: 0.7 }}>
          <Text
            color={colors.textSecondary}
            fontSize={12}
            fontWeight="600"
            letterSpacing={1.5}
          >
            CANCEL
          </Text>
        </XStack>
        <Button
          label={isEditing ? "Update" : "Save"}
          loading={isLoading}
          loadingLabel={isEditing ? "Updating…" : "Saving…"}
          onPress={onSave}
          size="md"
        />
      </XStack>
    </BlurModal>
  );
};
