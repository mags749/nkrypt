import React from "react";
import { useLogin } from "@features/auth/hooks/useLogin";
import { LoginView } from "@features/auth/views/LoginView";

export default function LoginScreen() {
  const hook = useLogin();
  return (
    <LoginView
      passPhrase={hook.passPhrase}
      onPassPhraseChange={(v) => {
        hook.setPassPhrase(v);
        hook.setError(null);
      }}
      showPassPhrase={hook.showPassPhrase}
      onTogglePassPhrase={() => hook.setShowPassPhrase((v) => !v)}
      passKey={hook.passKey}
      onPassKeyChange={(v) => {
        hook.setPassKey(v);
        hook.setError(null);
      }}
      isLoading={hook.isLoading}
      loadingMsg={hook.loadingMsg}
      error={hook.error}
      bioVerified={hook.bioVerified}
      bioInfo={hook.bioInfo}
      isBiometricEnabled={hook.isBiometricEnabled}
      shakeAnim={hook.shakeAnim}
      onLogin={() => {
        void hook.handleLogin();
      }}
      onBiometric={() => {
        void hook.handleBiometricPrompt();
      }}
    />
  );
}
