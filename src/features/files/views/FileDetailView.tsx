import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";

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
  usernameRevealed: boolean;
  decryptedUsername: string | null;
  onBack: () => void;
  onEdit: () => void;
  onNewFile: () => void;
  onReveal: () => void;
  onRevealUsername: () => void;
  onCopyCredentials: () => void;
  onCopyUsername: () => void;
  onCopyField: (value: string) => void;
}

export const FileDetailView = ({
  file,
  folderName,
  credentialsRevealed,
  decryptedCredentials,
  usernameRevealed,
  decryptedUsername,
  onBack,
  onEdit,
  onNewFile,
  onReveal,
  onRevealUsername,
  onCopyCredentials,
  onCopyUsername,
  onCopyField,
}: FileDetailViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={Spacing.lg}
        paddingVertical={Spacing.md}
        gap={Spacing.md}
      >
        <XStack onPress={onBack} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
        </XStack>
        <Text
          fontSize={20}
          fontWeight="600"
          letterSpacing={-0.3}
          color={colors.textPrimary}
          numberOfLines={1}
        >
          {file.site}
        </Text>
        <XStack onPress={onEdit} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-edit" size={20} color={colors.textPrimary} />
        </XStack>
      </XStack>

      <ScrollView
        contentContainerStyle={{ padding: Spacing["2xl"], paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <FieldRow
          label="Site"
          value={file.site}
          onCopy={() => onCopyField(file.site)}
          onOpen={() => {}}
        />
        <View height={1} backgroundColor={colors.separator} />

        <FieldRow
          label="Username"
          value={usernameRevealed ? (decryptedUsername ?? "") : ""}
          masked
          revealed={usernameRevealed}
          onReveal={onRevealUsername}
          onCopy={onCopyUsername}
        />
        <View height={1} backgroundColor={colors.separator} />

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

      <XStack
        onPress={onNewFile}
        position="absolute"
        bottom={Spacing["3xl"]}
        right={Spacing["2xl"]}
        width={56}
        height={56}
        borderRadius={28}
        backgroundColor={colors.accent}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ opacity: 0.85 }}
        style={Shadow.lg}
      >
        <BxIcon name="bx-plus" size={26} color={colors.accentForeground} />
      </XStack>
    </SafeAreaView>
  );
};
