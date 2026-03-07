import React from "react";
import { usePassKeyPrompt } from "@features/modals/hooks/usePassKeyPrompt";
import { PassKeyPromptView } from "@features/modals/views/PassKeyPromptView";

export default function PassKeyPromptModal() {
  const hook = usePassKeyPrompt();
  return (
    <PassKeyPromptView
      mode={hook.mode}
      passKey={hook.passKey}
      onPassKeyChange={(v) => {
        hook.setPassKey(v);
        hook.setError(null);
      }}
      error={hook.error}
      isLoading={hook.isLoading}
      onConfirm={() => {
        void hook.onConfirm();
      }}
      onDismiss={hook.onDismiss}
      attemptCount={hook.attemptCount}
    />
  );
}
