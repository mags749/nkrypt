import React from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Polygon } from "react-native-svg";
import { Text, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

interface RingProps {
  size: number;
  sides: number;
  color: string;
  strokeWidth: number;
  rotation: Animated.Value;
  opacity?: number;
}

const Ring = ({
  size,
  sides,
  color,
  strokeWidth,
  rotation,
  opacity = 1,
}: RingProps) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - strokeWidth;
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(3)},${(cy + radius * Math.sin(angle)).toFixed(3)}`;
  }).join(" ");
  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        opacity,
        transform: [{ rotate }],
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    </Animated.View>
  );
};

interface SplashViewProps {
  fadeAnim: Animated.Value;
  rot0: Animated.Value;
  rot1: Animated.Value;
  rot2: Animated.Value;
  onToggleTheme: () => void;
}

export const SplashView = ({
  fadeAnim,
  rot0,
  rot1,
  rot2,
  onToggleTheme,
}: SplashViewProps) => {
  const colors = useColors();
  const SIZE = 200;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: Spacing["3xl"],
      }}
      edges={["top", "bottom"]}
    >
      <YStack flex={1} justifyContent="center" alignItems="center">
        <XStack
          width={SIZE}
          height={SIZE}
          alignItems="center"
          justifyContent="center"
        >
          <Ring
            size={SIZE}
            sides={12}
            color={colors.textPrimary}
            strokeWidth={2.2}
            rotation={rot0}
            opacity={1.0}
          />
          <Ring
            size={SIZE * 0.77}
            sides={11}
            color={colors.textPrimary}
            strokeWidth={1.8}
            rotation={rot1}
            opacity={0.6}
          />
          <Ring
            size={SIZE * 0.56}
            sides={10}
            color={colors.textPrimary}
            strokeWidth={1.4}
            rotation={rot2}
            opacity={0.3}
          />
        </XStack>
        <Animated.View
          style={{
            alignItems: "center",
            marginTop: Spacing["3xl"],
            gap: Spacing.sm,
            opacity: fadeAnim,
          }}
        >
          <Text
            fontSize={36}
            fontWeight="300"
            letterSpacing={8}
            color={colors.textPrimary}
          >
            nkrypt
          </Text>
          <Text
            fontSize={11}
            fontWeight="600"
            letterSpacing={4}
            color={colors.textTertiary}
          >
            SECURE ENCRYPTION
          </Text>
        </Animated.View>
      </YStack>
      <Animated.View style={{ paddingBottom: Spacing.xl, opacity: fadeAnim }}>
        <XStack onPress={onToggleTheme} pressStyle={{ opacity: 0.6 }}>
          <Text
            fontSize={11}
            fontWeight="600"
            letterSpacing={2}
            color={colors.textTertiary}
          >
            TOGGLE APPEARANCE
          </Text>
        </XStack>
      </Animated.View>
    </SafeAreaView>
  );
};
