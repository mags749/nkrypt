import React from "react";
import Svg, { Polygon } from "react-native-svg";

interface NkryptLogoProps {
  size?: number;
  color?: string;
}

/**
 * nkrypt logo — three concentric decagons (10-sided polygons)
 * matching the splash screen design exactly.
 */
export function NkryptLogo({ size = 160, color = "#000000" }: NkryptLogoProps) {
  const cx = size / 2;
  const cy = size / 2;

  function decagonPoints(radius: number): string {
    const points: string[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(" ");
  }

  const outerR = (size / 2) * 0.9;
  const middleR = (size / 2) * 0.72;
  const innerR = (size / 2) * 0.55;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring — bold */}
      <Polygon
        points={decagonPoints(outerR)}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
      />
      {/* Middle ring */}
      <Polygon
        points={decagonPoints(middleR)}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.65}
      />
      {/* Inner ring — lightest */}
      <Polygon
        points={decagonPoints(innerR)}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.35}
      />
    </Svg>
  );
}

// ─── Small icon variant (used in headers, login) ──────────────────────────────

interface NkryptIconProps {
  size?: number;
  color?: string;
}

export function NkryptIcon({ size = 44, color = "#000000" }: NkryptIconProps) {
  const cx = size / 2;
  const cy = size / 2;

  function points(radius: number): string {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
      return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
    }).join(" ");
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon
        points={points((size / 2) * 0.88)}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
      />
      <Polygon
        points={points((size / 2) * 0.62)}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        opacity={0.5}
      />
    </Svg>
  );
}
