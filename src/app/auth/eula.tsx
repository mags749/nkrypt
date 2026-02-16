import React from "react";
import { useEula } from "@features/auth/hooks/useEula";
import { EulaView } from "@features/auth/views/EulaView";

export default function EulaScreen() {
  const { agreed, setAgreed, isLoading, handleAccept } = useEula();
  return (
    <EulaView
      agreed={agreed}
      onToggleAgreed={() => setAgreed((v) => !v)}
      isLoading={isLoading}
      onAccept={() => {
        void handleAccept();
      }}
    />
  );
}
