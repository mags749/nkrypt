import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { FieldRow } from "@shared/components/FileDetail/FieldRow";
import { MetaGrid } from "@shared/components/FileDetail/MetaGrid";
import { Shadow, Spacing } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";

interface FileDetailViewProps {
  file: NkryptFile;
  folderName: string;
  credentialsRevealed: boolean;
  decryptedCredentials: string | null;
  onBack: () => void;
  onEdit: () => void;
  onNewFile: () => void;
  onReveal: () => void;
  onCopyCredentials: () => void;
  onCopyField: (value: string) => void;
}

export const FileDetailView = ({
  file,
  folderName,
  credentialsRevealed,
  decryptedCredentials,
  onBack,
  onEdit,
  onNewFile,
  onReveal,
  onCopyCredentials,
  onCopyField,
}: FileDetailViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {file.site}
        </Text>
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
          <BxIcon name="bx-edit" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FieldRow
          label="Site"
          value={file.site}
          onCopy={() => onCopyField(file.site)}
          onOpen={() => {}}
        />
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <FieldRow
          label="Username"
          value={file.username}
          onCopy={() => onCopyField(file.username)}
        />
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <FieldRow
          label="Credentials"
          value={decryptedCredentials ?? ""}
          masked
          revealed={credentialsRevealed}
          onReveal={onReveal}
          onCopy={onCopyCredentials}
        />
        <MetaGrid
          createdAt={file.createdAt}
          updatedAt={file.updatedAt}
          folderName={folderName}
        />
      </ScrollView>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }, Shadow.lg]}
        onPress={onNewFile}
        activeOpacity={0.85}
      >
        <BxIcon name="bx-plus" size={26} color={colors.accentForeground} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  title: { flex: 1, fontSize: 20, fontWeight: "600", letterSpacing: -0.3 },
  content: { padding: Spacing["2xl"], paddingBottom: 120 },
  divider: { height: 1 },
  fab: {
    position: "absolute",
    bottom: Spacing["3xl"],
    right: Spacing["2xl"],
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
