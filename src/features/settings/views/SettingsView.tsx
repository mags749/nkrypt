import React from "react";
import { ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertDialog, Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { type BiometricInfo } from "@features/auth/store/authStore";
import { RowDivider } from "@features/settings/views/RowDivider";
import { SectionGroup } from "@features/settings/views/SectionGroup";
import { SettingRow } from "@features/settings/views/SettingRow";
import { BxIcon } from "@shared/components/BxIcon";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Button } from "@shared/components/ui";
import { Spacing } from "@shared/constants/design";

interface SettingsViewProps {
  isDark: boolean;
  isLoading: boolean;
  loadingMsg: string;
  bioInfo: BiometricInfo;
  isBiometricEnabled: boolean;
  onToggleTheme: () => void;
  onToggleBiometrics: () => void;
  onChangePin: () => void;
  onChangePassKey: () => void;
  onLockVault: () => void;
  onCategories: () => void;
  onEula: () => void;
  onWipeData: () => void;
  onBack: () => void;
  // Dialog state
  lockDialogOpen: boolean;
  setLockDialogOpen: (open: boolean) => void;
  onConfirmLock: () => void;
  wipeDialogOpen: boolean;
  setWipeDialogOpen: (open: boolean) => void;
  onConfirmWipe: () => void;
  biometricErrorVisible: boolean;
  setBiometricErrorVisible: (v: boolean) => void;
}

export const SettingsView = ({
  isDark,
  isLoading,
  loadingMsg,
  bioInfo,
  isBiometricEnabled,
  onToggleTheme,
  onToggleBiometrics,
  onChangePin,
  onChangePassKey,
  onLockVault,
  onCategories,
  onEula,
  onWipeData,
  onBack,
  lockDialogOpen,
  setLockDialogOpen,
  onConfirmLock,
  wipeDialogOpen,
  setWipeDialogOpen,
  onConfirmWipe,
  biometricErrorVisible,
  setBiometricErrorVisible,
}: SettingsViewProps) => {
  const colors = useColors();
  const isFace = bioInfo.types.includes("facial");
  const bioLabel = isFace ? "Face ID" : "Fingerprint / Device PIN";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <LoadingOverlay visible={isLoading} message={loadingMsg} />
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={Spacing.lg}
        paddingVertical={Spacing.md}
      >
        <XStack onPress={onBack} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
        </XStack>
        <Text
          fontSize={20}
          fontWeight="600"
          letterSpacing={-0.3}
          color={colors.textPrimary}
        >
          Settings
        </Text>
        <View width={26} />
      </XStack>

      <ScrollView
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingBottom: 60,
          gap: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SectionGroup title="Appearance">
          <SettingRow
            icon={isDark ? "bx-moon" : "bx-sun"}
            label="Dark Mode"
            sublabel={isDark ? "On" : "Off"}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={onToggleTheme}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.accentForeground}
              />
            }
          />
        </SectionGroup>

        <SectionGroup title="Security">
          <SettingRow
            icon="bx-hash"
            label="Change PIN"
            sublabel="Numeric PIN used for login verification"
            onPress={onChangePin}
          />
          <RowDivider />
          <SettingRow
            icon="bx-key"
            label="Change Pass Key"
            sublabel="AES-256 encryption key — re-encrypts all files"
            onPress={onChangePassKey}
          />
          <RowDivider />
          {bioInfo.available && bioInfo.enrolled && (
            <>
              <SettingRow
                icon={isFace ? "bxs-face" : "bx-fingerprint"}
                label={`${bioLabel} Unlock`}
                sublabel={
                  isBiometricEnabled
                    ? "Enabled — tap to disable"
                    : "Disabled — tap to enable"
                }
                rightElement={
                  <Switch
                    value={isBiometricEnabled}
                    onValueChange={onToggleBiometrics}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor={colors.accentForeground}
                  />
                }
              />
              <RowDivider />
            </>
          )}
          <SettingRow
            icon="bx-log-out"
            label="Lock Vault"
            sublabel="Returns to login screen"
            onPress={onLockVault}
          />
        </SectionGroup>

        <SectionGroup title="Data">
          <SettingRow
            icon="bx-tag"
            label="Manage Categories"
            sublabel="Add, edit or reorder folder categories"
            onPress={onCategories}
          />
        </SectionGroup>

        <SectionGroup title="About">
          <SettingRow
            icon="bx-file-blank"
            label="Terms of Use"
            onPress={onEula}
          />
          <RowDivider />
          <SettingRow
            icon="bx-info-circle"
            label="Version"
            sublabel="nkrypt v2.0.0"
            rightElement={<View />}
          />
          <RowDivider />
          <SettingRow
            icon="bx-shield"
            label="Encryption"
            sublabel="AES-256-CTR, offline-only, zero telemetry"
            rightElement={<View />}
          />
        </SectionGroup>

        <SectionGroup title="Danger Zone">
          <SettingRow
            icon="bx-trash-alt"
            label="Wipe All Data"
            sublabel="Permanently deletes everything"
            onPress={onWipeData}
            danger
          />
        </SectionGroup>
      </ScrollView>

      {/* Lock Vault confirmation */}
      <AlertDialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            key="content"
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.95 }}
            exitStyle={{ opacity: 0, scale: 0.95 }}
            backgroundColor={colors.surfaceElevated}
            borderRadius={16}
            padding={Spacing["2xl"]}
            maxWidth={340}
            width="90%"
          >
            <YStack gap={Spacing.md}>
              <AlertDialog.Title color={colors.textPrimary} fontSize={18} fontWeight="700">
                Lock Vault
              </AlertDialog.Title>
              <AlertDialog.Description color={colors.textSecondary} fontSize={14}>
                You will be returned to the login screen. Your data remains encrypted.
              </AlertDialog.Description>
              <XStack gap={Spacing.md} justifyContent="flex-end" marginTop={Spacing.sm}>
                <AlertDialog.Cancel asChild>
                  <Button label="Cancel" variant="ghost" size="sm" onPress={() => setLockDialogOpen(false)} />
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button label="Lock" size="sm" onPress={onConfirmLock} />
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      {/* Wipe All Data confirmation */}
      <AlertDialog open={wipeDialogOpen} onOpenChange={setWipeDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            key="content"
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.95 }}
            exitStyle={{ opacity: 0, scale: 0.95 }}
            backgroundColor={colors.surfaceElevated}
            borderRadius={16}
            padding={Spacing["2xl"]}
            maxWidth={340}
            width="90%"
          >
            <YStack gap={Spacing.md}>
              <AlertDialog.Title color={colors.error} fontSize={18} fontWeight="700">
                Wipe All Data
              </AlertDialog.Title>
              <AlertDialog.Description color={colors.textSecondary} fontSize={14}>
                This permanently deletes ALL folders, files, and credentials. Cannot be undone.
              </AlertDialog.Description>
              <XStack gap={Spacing.md} justifyContent="flex-end" marginTop={Spacing.sm}>
                <AlertDialog.Cancel asChild>
                  <Button label="Cancel" variant="ghost" size="sm" onPress={() => setWipeDialogOpen(false)} />
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button label="Wipe Everything" variant="danger" size="sm" onPress={() => void onConfirmWipe()} />
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      {/* Biometric error */}
      <AlertDialog open={biometricErrorVisible} onOpenChange={setBiometricErrorVisible}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            key="content"
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.95 }}
            exitStyle={{ opacity: 0, scale: 0.95 }}
            backgroundColor={colors.surfaceElevated}
            borderRadius={16}
            padding={Spacing["2xl"]}
            maxWidth={340}
            width="90%"
          >
            <YStack gap={Spacing.md}>
              <AlertDialog.Title color={colors.textPrimary} fontSize={18} fontWeight="700">
                Biometrics Failed
              </AlertDialog.Title>
              <AlertDialog.Description color={colors.textSecondary} fontSize={14}>
                Could not enable biometric unlock. Please try again.
              </AlertDialog.Description>
              <XStack justifyContent="flex-end" marginTop={Spacing.sm}>
                <AlertDialog.Action asChild>
                  <Button label="OK" size="sm" onPress={() => setBiometricErrorVisible(false)} />
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </SafeAreaView>
  );
};
