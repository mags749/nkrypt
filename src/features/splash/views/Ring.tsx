import React from "react";
import { Animated } from "react-native";
import Svg, { Polygon } from "react-native-svg";

interface RingProps {
  size: number;
  sides: number;
  color: string;
  strokeWidth: number;
  rotation: Animated.Value;
  opacity?: number;
}

export const Ring = ({
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
