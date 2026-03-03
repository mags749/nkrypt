import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Button } from "@shared/components/ui";
import { Radius, Spacing } from "@shared/constants/design";

const SECTIONS = [
  {
    title: "1. Agreement",
    body: "By using nkrypt, you agree to this End User License Agreement. nkrypt is provided for personal, offline use to store and manage encrypted data securely on your device.",
  },
  {
    title: "2. Data Responsibility",
    body: "You are solely responsible for the security of your Pass Phrase and Pass Key. nkrypt stores no data in the cloud. All data lives exclusively on this device.",
  },
  {
    title: "3. Encryption",
    body: "nkrypt uses AES-256 encryption to protect your stored credentials. Only your Pass Key is used for encryption and decryption.",
  },
  {
    title: "4. No Recovery",
    body: "If you lose your Pass Key, your encrypted data cannot be recovered by any means. There is no cloud backup, no password reset, and no customer support pathway.",
  },
  {
    title: "5. Liability",
    body: 'nkrypt is provided "as is" without warranty. The developers shall not be liable for any data loss. Use at your own risk.',
  },
  {
    title: "6. Privacy",
    body: "nkrypt collects no personal data, no usage analytics, and makes no network requests. All processing occurs entirely on-device.",
  },
];

interface EulaViewProps {
  agreed: boolean;
  onToggleAgreed: () => void;
  isLoading: boolean;
  onAccept: () => void;
}

export const EulaView = ({
  agreed,
  onToggleAgreed,
  isLoading,
  onAccept,
}: EulaViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <YStack
        paddingHorizontal={Spacing["2xl"]}
        paddingTop={Spacing["3xl"]}
        paddingBottom={Spacing.lg}
        gap={Spacing.xs}
      >
        <Text
          fontSize={28}
          fontWeight="700"
          letterSpacing={-0.5}
          color={colors.textPrimary}
        >
          Terms of Use
        </Text>
        <Text fontSize={15} color={colors.textTertiary}>
          Please read and accept before continuing
        </Text>
      </YStack>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: Spacing["2xl"],
          paddingBottom: Spacing["2xl"],
          gap: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((s) => (
          <YStack key={s.title} gap={Spacing.xs}>
            <Text fontSize={15} fontWeight="600" color={colors.textPrimary}>
              {s.title}
            </Text>
            <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
              {s.body}
            </Text>
          </YStack>
        ))}

        <View
          height={1}
          backgroundColor={colors.border}
          marginVertical={Spacing.sm}
        />

        <XStack
          onPress={onToggleAgreed}
          alignItems="flex-start"
          gap={Spacing.md}
          pressStyle={{ opacity: 0.7 }}
        >
          <XStack
            width={22}
            height={22}
            borderRadius={Radius.sm}
            borderWidth={1.5}
            borderColor={agreed ? colors.accent : colors.border}
            backgroundColor={agreed ? colors.accent : "transparent"}
            alignItems="center"
            justifyContent="center"
            marginTop={2}
            flexShrink={0}
          >
            {agreed && (
              <BxIcon
                name="bx-check"
                size={13}
                color={colors.accentForeground}
              />
            )}
          </XStack>
          <Text
            flex={1}
            fontSize={15}
            color={colors.textPrimary}
            lineHeight={22}
          >
            I have read and agree to the Terms of Use
          </Text>
        </XStack>
      </ScrollView>

      <YStack
        padding={Spacing["2xl"]}
        paddingTop={Spacing.sm}
        backgroundColor={colors.background}
      >
        <Button
          label="Accept & Continue"
          onPress={onAccept}
          loading={isLoading}
          disabled={!agreed}
          fullWidth
        />
      </YStack>
    </SafeAreaView>
  );
};
