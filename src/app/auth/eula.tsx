import React from "react";
import { useEula } from "@features/auth/hooks/useEula";
import { EulaView } from "@features/auth/views/EulaView";

const EulaScreen = () => {
  const { agreed, setAgreed, isLoading, handleAccept, isEulaAccepted } =
    useEula();
  return (
    <EulaView
      agreed={agreed}
      isEulaAccepted={isEulaAccepted}
      onToggleAgreed={() => setAgreed((v) => !v)}
      isLoading={isLoading}
      onAccept={() => {
        void handleAccept();
      }}
    />
  );
};

export default EulaScreen;
