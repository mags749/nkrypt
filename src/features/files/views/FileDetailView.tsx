import React from "react";
import { Linking } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { MetaGrid } from "@shared/components/FileDetail/MetaGrid";
import { Shadow, Spacing } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";

interface FileDetailViewProps {
  file: NkryptFile;
  folderName: string;
  valueRevealed: boolean;
  decryptedValue: string | null;
  onBack: () => void;
  onEdit: () => void;
  onNewFile: () => void;
  onReveal: () => void;
  onCopyValue: () => void;
  onOpenLink: () => void;
}

export const FileDetailView = ({
  file,
  folderName,
  valueRevealed,
  decryptedValue,
  onBack,
  onEdit,
  onNewFile,
  onReveal,
  onCopyValue,
  onOpenLink,
}: FileDetailViewProps) => {
  const colors = useColors();

  const displayValue =
    valueRevealed && decryptedValue !== null
      ? decryptedValue
      : file.isEncrypted
        ? null
        : file.value;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* Header */}
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
          {file.key}
        </Text>
        <XStack onPress={onEdit} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-edit" size={20} color={colors.textPrimary} />
        </XStack>
      </XStack>

      <ScrollView
        contentContainerStyle={{ padding: Spacing["2xl"], paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Key row */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={Spacing.lg}
        >
          <View flex={1}>
            <Text
              fontSize={11}
              color={colors.textTertiary}
              letterSpacing={1}
              marginBottom={4}
            >
              KEY
            </Text>
            <Text fontSize={17} color={colors.textPrimary} fontWeight="500">
              {file.key}
            </Text>
          </View>
          <XStack
            onPress={() =>
              void (navigator as any)?.clipboard?.writeText(file.key)
            }
            padding={Spacing.sm}
            pressStyle={{ opacity: 0.6 }}
          >
            <BxIcon name="bx-copy" size={18} color={colors.textTertiary} />
          </XStack>
        </XStack>

        <View height={1} backgroundColor={colors.separator} />

        {/* Value row */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={Spacing.lg}
        >
          <View flex={1}>
            <XStack alignItems="center" gap={Spacing.xs} marginBottom={4}>
              <Text fontSize={11} color={colors.textTertiary} letterSpacing={1}>
                VALUE
              </Text>
              {file.isEncrypted && (
                <BxIcon
                  name="bx-lock-alt"
                  size={11}
                  color={colors.textTertiary}
                />
              )}
              {file.isLink && (
                <BxIcon
                  name="bx-link-external"
                  size={11}
                  color={colors.textTertiary}
                />
              )}
            </XStack>
            <Text
              fontSize={17}
              color={
                displayValue !== null ? colors.textPrimary : colors.textTertiary
              }
              fontWeight="500"
            >
              {displayValue !== null ? displayValue : "••••••••••••"}
            </Text>
          </View>

          <XStack alignItems="center" gap={Spacing.sm}>
            {/* Reveal/hide toggle for encrypted */}
            {file.isEncrypted && (
              <XStack
                onPress={onReveal}
                padding={Spacing.sm}
                pressStyle={{ opacity: 0.6 }}
              >
                <BxIcon
                  name={valueRevealed ? "bx-hide" : "bx-show"}
                  size={18}
                  color={colors.textTertiary}
                />
              </XStack>
            )}
            {/* Copy button */}
            <XStack
              onPress={onCopyValue}
              padding={Spacing.sm}
              pressStyle={{ opacity: 0.6 }}
            >
              <BxIcon name="bx-copy" size={18} color={colors.textTertiary} />
            </XStack>
            {/* Open link button */}
            {file.isLink && (
              <XStack
                onPress={onOpenLink}
                padding={Spacing.sm}
                pressStyle={{ opacity: 0.6 }}
              >
                <BxIcon
                  name="bx-link-external"
                  size={18}
                  color={colors.textTertiary}
                />
              </XStack>
            )}
          </XStack>
        </XStack>

        <MetaGrid
          createdAt={file.createdAt}
          updatedAt={file.updatedAt}
          folderName={folderName}
        />
      </ScrollView>

      {/* FAB */}
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
