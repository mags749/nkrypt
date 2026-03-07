import React from "react";
import { ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { type BiometricInfo } from "@features/auth/store/authStore";
import { RowDivider } from "@features/settings/views/RowDivider";
import { SectionGroup } from "@features/settings/views/SectionGroup";
import { SettingRow } from "@features/settings/views/SettingRow";
import { BxIcon } from "@shared/components/BxIcon";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Spacing } from "@shared/constants/design";
import { ConfirmDialog } from "@shared/components/ConfirmDialog";

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
            label="Change Pass Phrase"
            sublabel="Pass Phrase used for login verification"
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
      <ConfirmDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        title="Lock Vault"
        description="You will be returned to the login screen. Your data remains encrypted."
        confirmLabel="Lock"
        cancelLabel="Cancel"
        onConfirm={onConfirmLock}
        onCancel={() => setLockDialogOpen(false)}
      />

      {/* Wipe All Data confirmation */}
      <ConfirmDialog
        open={wipeDialogOpen}
        onOpenChange={setWipeDialogOpen}
        title="Wipe All Data"
        description="This permanently deletes ALL folders, files, and credentials. Cannot be undone."
        confirmLabel="Wipe Everything"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => void onConfirmWipe()}
        onCancel={() => setWipeDialogOpen(false)}
      />

      {/* Biometric error */}
      <ConfirmDialog
        open={biometricErrorVisible}
        onOpenChange={setBiometricErrorVisible}
        title="Biometrics Failed"
        description="Could not enable biometric unlock. Please try again."
        confirmLabel="OK"
        onConfirm={() => setBiometricErrorVisible(false)}
      />
    </SafeAreaView>
  );
};
