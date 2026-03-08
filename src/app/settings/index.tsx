import React from "react";
import { useSettings } from "@features/settings/hooks/useSettings";
import { SettingsView } from "@features/settings/views/SettingsView";

const SettingsScreen = () => {
  const hook = useSettings();
  return (
    <SettingsView
      isDark={hook.isDark}
      isLoading={hook.isLoading}
      loadingMsg={hook.loadingMsg}
      bioInfo={hook.bioInfo}
      isBiometricEnabled={hook.isBiometricEnabled}
      onToggleTheme={hook.toggleTheme}
      onToggleBiometrics={() => {
        void hook.onToggleBiometrics();
      }}
      onChangePin={hook.onChangePin}
      onChangePassKey={hook.onChangePassKey}
      onLockVault={hook.onLockVault}
      onCategories={hook.onCategories}
      onEula={hook.onEula}
      onWipeData={hook.onWipeData}
      onBack={hook.onBack}
      lockDialogOpen={hook.lockDialogOpen}
      setLockDialogOpen={hook.setLockDialogOpen}
      onConfirmLock={hook.onConfirmLock}
      wipeDialogOpen={hook.wipeDialogOpen}
      setWipeDialogOpen={hook.setWipeDialogOpen}
      onConfirmWipe={hook.onConfirmWipe}
      biometricErrorVisible={hook.biometricErrorVisible}
      setBiometricErrorVisible={hook.setBiometricErrorVisible}
    />
  );
};

export default SettingsScreen;
