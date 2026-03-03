import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { BlurModal } from "@shared/components/BlurModal";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Radius, Spacing } from "@shared/constants/design";

interface CreateFileViewProps {
  isEditing: boolean;
  site: string;
  onSiteChange: (v: string) => void;
  username: string;
  onUsernameChange: (v: string) => void;
  credentials: string;
  onCredentialsChange: (v: string) => void;
  showCreds: boolean;
  onToggleCreds: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
  onSave: () => void;
  onClose: () => void;
}

export const CreateFileView = ({
  isEditing,
  site,
  onSiteChange,
  username,
  onUsernameChange,
  credentials,
  onCredentialsChange,
  showCreds,
  onToggleCreds,
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
        message={isEditing ? "Updating entry…" : "Encrypting & saving…"}
      />

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
              : "Fill in the credentials to encrypt and save."}
          </Text>
        </YStack>
        <XStack onPress={onClose} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-x" size={22} color={colors.textSecondary} />
        </XStack>
      </XStack>

      <InputField
        label="Site"
        value={site}
        onChangeText={onSiteChange}
        placeholder="e.g. github.com"
        keyboardType="url"
        autoFocus
        error={errors.site}
      />
      <InputField
        label="Username"
        value={username}
        onChangeText={onUsernameChange}
        placeholder="your@email.com"
        keyboardType="email-address"
        error={errors.username}
      />

      <View style={{ position: "relative" }}>
        <InputField
          label={
            isEditing ? "New Credentials (blank = keep current)" : "Credentials"
          }
          value={credentials}
          onChangeText={onCredentialsChange}
          placeholder="Password / secret"
          secureTextEntry={!showCreds}
          error={errors.credentials}
        />
        <XStack
          onPress={onToggleCreds}
          style={{
            position: "absolute",
            right: 0,
            bottom: Spacing.xl,
            padding: Spacing.sm,
          }}
          pressStyle={{ opacity: 0.7 }}
        >
          <BxIcon
            name={showCreds ? "bx-hide" : "bx-show"}
            size={18}
            color={colors.textTertiary}
          />
        </XStack>
      </View>

      <XStack
        alignItems="center"
        gap={Spacing.sm}
        padding={Spacing.md}
        borderRadius={8}
        marginBottom={Spacing.sm}
        backgroundColor={colors.surfaceSecondary}
      >
        <BxIcon name="bx-lock-alt" size={14} color={colors.textTertiary} />
        <Text
          color={colors.textTertiary}
          fontSize={12}
          flex={1}
          lineHeight={18}
        >
          Credentials encrypted with AES-256 using your Pass Key
        </Text>
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
          loadingLabel={isEditing ? "Updating…" : "Encrypting…"}
          onPress={onSave}
          size="md"
        />
      </XStack>
    </BlurModal>
  );
};
