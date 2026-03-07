import React from "react";
import { useChangePassKey } from "@features/settings/hooks/useChangePassKey";
import { ChangePassKeyView } from "@features/settings/views/ChangePassKeyView";

export default function ChangePassKeyScreen() {
  const hook = useChangePassKey();
  return (
    <ChangePassKeyView
      step={hook.step}
      passPhrase={hook.passPhrase}
      onPassPhraseChange={(v) => {
        hook.setPassPhrase(v);
      }}
      showPassPhrase={hook.showPassPhrase}
      onToggleShowPassPhrase={() => hook.setShowPassPhrase((v) => !v)}
      currentKey={hook.currentKey}
      onCurrentKeyChange={(v) => {
        hook.setCurrentKey(v);
      }}
      newKey={hook.newKey}
      onNewKeyChange={(v) => {
        hook.setNewKey(v);
      }}
      newKeyConfirm={hook.newKeyConfirm}
      onNewKeyConfirmChange={(v) => {
        hook.setNewKeyConfirm(v);
      }}
      isLoading={hook.isLoading}
      errors={hook.errors}
      verifyAttempts={hook.verifyAttempts}
      onBack={hook.onBack}
      onVerify={hook.onVerify}
      onSave={hook.onSave}
    />
  );
}
