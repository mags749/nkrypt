import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { type BiometricInfo } from "@features/auth/store/authStore";
import { RowDivider } from "@features/settings/views/RowDivider";
import { SectionGroup } from "@features/settings/views/SectionGroup";
import { SettingRow } from "@features/settings/views/SettingRow";
import { BxIcon } from "@shared/components/BxIcon";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
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
}: SettingsViewProps) => {
  const colors = useColors();
  const isFace = bioInfo.types.includes("facial");
  const bioLabel = isFace ? "Face ID" : "Fingerprint / Device PIN";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <LoadingOverlay visible={isLoading} message={loadingMsg} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: { fontSize: 20, fontWeight: "600", letterSpacing: -0.3 },
  content: { padding: Spacing.lg, paddingBottom: 60, gap: Spacing.xl },
});
