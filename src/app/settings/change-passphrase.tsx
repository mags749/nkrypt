import React from "react";
import { useChangePassPhrase } from "@features/settings/hooks/useChangePassPhrase";
import { ChangePassPhraseView } from "@features/settings/views/ChangePassPhraseView";

export default function ChangePassPhraseScreen() {
  const hook = useChangePassPhrase();
  return (
    <ChangePassPhraseView
      step={hook.step}
      currentPhrase={hook.currentPhrase}
      onPhraseChange={(v) => {
        hook.currentSetter(v);
        hook.setError(null);
      }}
      showPhrase={hook.showPhrase}
      onToggleShow={() => hook.setShowPhrase((v) => !v)}
      isLoading={hook.isLoading}
      error={hook.error}
      verifyAttempts={hook.verifyAttempts}
      primaryLabel={hook.primaryLabel}
      onPrimary={hook.onPrimary}
      onBack={hook.onBack}
    />
  );
}
