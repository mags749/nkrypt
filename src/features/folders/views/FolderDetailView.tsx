import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator, Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { FileItem } from "@features/folders/views/FileItem";
import { Shadow, Spacing } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";
import { ControlledSheet } from "@shared/components/ControlledSheet";
import { Button } from "@shared/components/ui";

interface FolderDetailViewProps {
  folderName: string;
  files: NkryptFile[];
  onBack: () => void;
  onMoreOptions: (flag: boolean) => void;
  onFilePress: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onNewFile: () => void;
  onEditFolder: () => void;
  onDeleteFolder: () => void;
  openMoreOptionSheet: boolean;
}

export const FolderDetailView = ({
  folderName,
  files,
  onBack,
  onMoreOptions,
  onFilePress,
  onDeleteFile,
  onNewFile,
  onEditFolder,
  onDeleteFolder,
  openMoreOptionSheet,
}: FolderDetailViewProps) => {
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
          folder
        </Text>
        <XStack
          onPress={() => onMoreOptions(true)}
          pressStyle={{ opacity: 0.7 }}
        >
          <BxIcon
            name="bx-dots-horizontal-rounded"
            size={24}
            color={colors.textPrimary}
          />
        </XStack>
      </XStack>

      <View marginHorizontal={Spacing["3xl"]} marginVertical={Spacing["2xl"]}>
        <Text
          fontSize={24}
          fontWeight={700}
          color={colors.textPrimary}
          numberOfLines={1}
        >
          {folderName}
        </Text>
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Separator
            alignSelf="stretch"
            borderWidth={0.5}
            borderColor={colors.border}
            marginHorizontal={Spacing["4xl"]}
            marginVertical={Spacing.md}
          />
        )}
        renderItem={({ item }) => (
          <FileItem
            file={item}
            onPress={() => onFilePress(item.id)}
            onDelete={() => onDeleteFile(item.id)}
          />
        )}
        ListEmptyComponent={
          <XStack alignItems="center" justifyContent="center" paddingTop={80}>
            <Text
              color={colors.textTertiary}
              fontSize={15}
              textAlign="center"
              lineHeight={24}
            >
              {"No files in this folder.\nTap + to add one."}
            </Text>
          </XStack>
        }
      />

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

      <ControlledSheet open={openMoreOptionSheet} onOpenChange={onMoreOptions}>
        <YStack rowGap={Spacing.lg} height="auto">
          <Text
            fontSize={24}
            fontWeight={700}
            color={colors.textPrimary}
            numberOfLines={1}
            marginBottom={Spacing["2xl"]}
          >
            folder actions
          </Text>
          <Button
            label={`Edit ${folderName}`}
            onPress={onEditFolder}
            fullWidth
            size="lg"
            variant="ghost"
          />
          <Button
            label={`Delete ${folderName}`}
            onPress={onDeleteFolder}
            fullWidth
            size="lg"
            variant="danger"
          />
        </YStack>
      </ControlledSheet>
    </SafeAreaView>
  );
};
