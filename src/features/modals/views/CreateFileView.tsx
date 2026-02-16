import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { BlurModal } from "@shared/components/BlurModal";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Spacing, Typography } from "@shared/constants/design";

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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isEditing ? "Edit Entry" : "New Entry"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isEditing
              ? "Update the entry details below."
              : "Fill in the credentials to encrypt and save."}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <BxIcon name="bx-x" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Fields */}
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
      <View style={styles.credsWrapper}>
        <InputField
          label={
            isEditing
              ? "New Credentials (blank = keep current)"
              : "Credentials"
          }
          value={credentials}
          onChangeText={onCredentialsChange}
          placeholder="Password / secret"
          secureTextEntry={!showCreds}
          error={errors.credentials}
        />
        <TouchableOpacity
          onPress={onToggleCreds}
          style={styles.eyeBtn}
          activeOpacity={0.7}
        >
          <BxIcon
            name={showCreds ? "bx-hide" : "bx-show"}
            size={18}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[styles.note, { backgroundColor: colors.surfaceSecondary }]}
      >
        <BxIcon name="bx-lock-alt" size={14} color={colors.textTertiary} />
        <Text style={[styles.noteText, { color: colors.textTertiary }]}>
          Credentials encrypted with AES-256 using your Pass Key
        </Text>
      </View>

      {errors.general ? (
        <Text style={[styles.genErr, { color: colors.error }]}>
          {errors.general}
        </Text>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={[styles.cancel, { color: colors.textSecondary }]}>
            CANCEL
          </Text>
        </TouchableOpacity>
        <Button
          label={isEditing ? "Update" : "Save"}
          loading={isLoading}
          loadingLabel={isEditing ? "Updating…" : "Encrypting…"}
          onPress={onSave}
          size="md"
        />
      </View>
    </BlurModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
    gap: Spacing.md,
  },
  titleBlock: { flex: 1, gap: Spacing.xs },
  title: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  subtitle: { ...Typography.bodyMD },
  credsWrapper: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 0,
    bottom: Spacing.xl,
    padding: Spacing.sm,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  noteText: { fontSize: 12, flex: 1, lineHeight: 18 },
  genErr: { fontSize: 13, textAlign: "center", marginBottom: Spacing.sm },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  cancel: { ...Typography.labelLG, letterSpacing: 1.5 },
});
