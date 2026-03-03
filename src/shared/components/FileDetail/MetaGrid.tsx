import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing } from "@shared/constants/design";

interface MetaGridProps {
  createdAt: number;
  updatedAt: number;
  folderName: string;
}

const MetaCell = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const colors = useColors();
  return (
    <YStack width="45%" gap={4}>
      <Text
        color={colors.textTertiary}
        fontSize={10}
        fontWeight="500"
        letterSpacing={0.8}
      >
        {label}
      </Text>
      {children}
    </YStack>
  );
};

export const MetaGrid = ({
  createdAt,
  updatedAt,
  folderName,
}: MetaGridProps) => {
  const colors = useColors();
  const createdStr = format(new Date(createdAt), "dd MMM yyyy");
  const modifiedStr = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
  });

  return (
    <XStack
      flexWrap="wrap"
      marginTop={Spacing["3xl"]}
      paddingTop={Spacing["2xl"]}
      borderTopWidth={1}
      borderTopColor={colors.separator}
      gap={Spacing["2xl"]}
    >
      <MetaCell label="CREATED">
        <Text color={colors.textPrimary} fontSize={15} fontWeight="500">
          {createdStr}
        </Text>
      </MetaCell>
      <MetaCell label="MODIFIED">
        <Text color={colors.textPrimary} fontSize={15} fontWeight="500">
          {modifiedStr}
        </Text>
      </MetaCell>
      <MetaCell label="ENCRYPTION">
        <XStack alignItems="center" gap={4}>
          <Text color={colors.textPrimary} fontSize={15} fontWeight="500">
            AES-256
          </Text>
          <BxIcon name="bx-lock-alt" size={14} color={colors.textTertiary} />
        </XStack>
      </MetaCell>
      <MetaCell label="FOLDER">
        <Text color={colors.textPrimary} fontSize={15} fontWeight="500">
          {folderName}
        </Text>
      </MetaCell>
    </XStack>
  );
};
