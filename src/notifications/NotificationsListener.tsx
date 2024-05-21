import { useEffect, useState } from "react";
import { useAppIsActive } from "@/hooks";
import { useAccountsStore, useTokensStore } from "@/store";
import { NotificationsWebsocket } from "./NotificationsWebsocket";
import { registerBackgroundTxPooler } from "./background";
import { poolAndNotifyNewTxs } from "./txPooler";
import { grantNotificationsPermission } from "./pushNotifications";

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

  useEffect(() => {
    registerBackgroundTxPooler();
    grantNotificationsPermission();
  }, []);

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
