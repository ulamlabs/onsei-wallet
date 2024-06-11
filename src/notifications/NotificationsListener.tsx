import { useAppIsActive } from "@/hooks";
import { useAccountsStore, useTokensStore } from "@/store";
import { useEffect, useMemo, useState } from "react";
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

  useRefreshOnActivation();

  const allowNotificationsStatus = useMemo(
    () => accounts.map((account) => account.allowNotifications),
    [accounts],
  );

  useEffect(() => {
    registerBackgroundTxPooler();
    grantNotificationsPermission();
  }, [allowNotificationsStatus]);

  return (
    <>
      {accounts.map((account) => {
        if (!account.allowNotifications) {
          return;
        }
        return (
          <NotificationsWebsocket
            address={account.address}
            key={account.address}
          />
        );
      })}
    </>
  );
}
