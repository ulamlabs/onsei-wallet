import { useAppIsActive } from "@/hooks";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { useEffect } from "react";
import { NotificationsWebsocket } from "./NotificationsWebsocket";
import { registerBackgroundTxPooler } from "./background";
import { grantNotificationsPermission } from "./pushNotifications";
import { poolAndNotifyNewTxs } from "./txPooler";

function useRefreshOnActivation() {
  const isActive = useAppIsActive();
  const { updateBalances } = useTokensStore();

  useEffect(() => {
    if (!isActive) {
      return;
    }
    poolAndNotifyNewTxs();
    updateBalances();
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
      setSetting("allowNotifications", false);
      return;
    }
    grantNotificationsPermission().then((status) => {
      setSetting("allowNotifications", status === "granted");
    });
    registerBackgroundTxPooler();
  }, [allowNotifications]);

  if (!allowNotifications) {
    return <></>;
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
