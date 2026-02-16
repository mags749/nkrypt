import React from "react";
import { useSetup } from "@features/auth/hooks/useSetup";
import { SetupView } from "@features/auth/views/SetupView";

export default function SetupScreen() {
  const hook = useSetup();
  return (
    <SetupView
      step={hook.step}
      passPhrase={hook.passPhrase}
      onPassPhraseChange={(v) => {
        hook.setPassPhrase(v);
      }}
      showPassPhrase={hook.showPassPhrase}
      onToggleShowPassPhrase={() => hook.setShowPassPhrase((v) => !v)}
      passPhraseConfirm={hook.passPhraseConfirm}
      onPassPhraseConfirmChange={(v) => {
        hook.setPassPhraseConfirm(v);
      }}
      passKey={hook.passKey}
      onPassKeyChange={(v) => {
        hook.setPassKey(v);
      }}
      passKeyConfirm={hook.passKeyConfirm}
      onPassKeyConfirmChange={(v) => {
        hook.setPassKeyConfirm(v);
      }}
      errors={hook.errors}
      isLoading={hook.isLoading}
      progressAnim={hook.progressAnim}
      onStep1={hook.handleStep1}
      onStep2={hook.handleStep2}
      onStep3={hook.handleStep3}
      onSetup={() => {
        void hook.handleSetup();
      }}
    />
  );
}
