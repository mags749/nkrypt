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
import { Button } from "@shared/components/ui";
import { Radius, Spacing, Typography } from "@shared/constants/design";

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
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Terms of Use
        </Text>
        <Text style={[styles.sub, { color: colors.textTertiary }]}>
          Please read and accept before continuing
        </Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {s.title}
            </Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {s.body}
            </Text>
          </View>
        ))}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <TouchableOpacity
          style={styles.agreeRow}
          onPress={onToggleAgreed}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: agreed ? colors.accent : colors.border,
                backgroundColor: agreed ? colors.accent : "transparent",
              },
            ]}
          >
            {agreed && (
              <BxIcon
                name="bx-check"
                size={13}
                color={colors.accentForeground}
              />
            )}
          </View>
          <Text style={[styles.agreeText, { color: colors.textPrimary }]}>
            I have read and agree to the Terms of Use
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          label="Accept & Continue"
          onPress={onAccept}
          loading={isLoading}
          disabled={!agreed}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  sub: { ...Typography.bodyMD },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing["2xl"],
    gap: Spacing.xl,
  },
  section: { gap: Spacing.xs },
  sectionTitle: { fontSize: 15, fontWeight: "600" },
  sectionBody: { ...Typography.bodyMD, lineHeight: 22 },
  divider: { height: 1, marginVertical: Spacing.sm },
  agreeRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  agreeText: { ...Typography.bodyMD, flex: 1, lineHeight: 22 },
  footer: { padding: Spacing["2xl"], paddingTop: Spacing.sm },
});
