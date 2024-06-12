import { useAppIsActive } from "@/hooks";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { useEffect, useState } from "react";
import { NotificationsWebsocket } from "./NotificationsWebsocket";
import { registerBackgroundTxPooler } from "./background";
import { grantNotificationsPermission } from "./pushNotifications";
import { poolAndNotifyNewTxs } from "./txPooler";

function useRefreshOnActivation() {
  const [firstActivation, setFirstActivation] = useState(true);
  const isActive = useAppIsActive();
  const { updateBalances } = useTokensStore();

  useEffect(() => {
    if (!isActive) {
      return;
    }
    setFirstActivation(false);
    poolAndNotifyNewTxs();
    if (!firstActivation) {
      updateBalances();
    }
  }, [isActive]);
}

export default function NotificationsListener() {
  const { accounts } = useAccountsStore();
  const {
    settings: { allowNotifications },
    setSetting,
  } = useSettingsStore();

  useRefreshOnActivation();

  useEffect(() => {
    if (!allowNotifications) {
      return;
    }
    grantNotificationsPermission().then((status) => {
      if (status !== "granted") {
        setSetting("allowNotifications", false);
        return;
      }
      setSetting("allowNotifications", true);
    });
    registerBackgroundTxPooler();
  }, [allowNotifications]);

  if (!allowNotifications) {
    return;
  }

  return (
    <>
      {accounts.map((account) => (
        <NotificationsWebsocket
          address={account.address}
          key={account.address}
        />
      ))}
    </>
  );
}
