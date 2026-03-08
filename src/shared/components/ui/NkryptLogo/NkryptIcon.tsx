import React from "react";
import NkryptSvg from "assets/nkrypt-logo.svg";
// ─── Small icon variant (used in headers, login) ──────────────────────────────

interface NkryptIconProps {
  size?: number;
}

const NkryptIcon = ({ size = 44 }: NkryptIconProps) => (
  <NkryptSvg width={size} height={size} />
);

export default NkryptIcon;
