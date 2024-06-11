import { NODE_URL } from "@/const";
import { useAppIsActive } from "@/hooks";
import { parseTx, websocketTxToTxResponse } from "@/modules/transactions";
import { useAccountsStore, useSettingsStore } from "@/store";
import { useEffect, useRef } from "react";
import { notifyTx } from "./pushNotifications";

export function NotificationsWebsocket({ address }: { address: string }) {
  const { accounts } = useAccountsStore();
  const isActive = useAppIsActive();

  const {
    settings: { node },
  } = useSettingsStore();

  const websocket = useRef<WebSocket>();

  useEffect(() => {
    return () => websocket.current?.close();
  }, []);

  useEffect(() => {
    if (websocket.current) {
      websocket.current.close();
    }
    websocket.current = getNewWebsocket();
  }, [node]);

  function getNewWebsocket() {
    const websocket = new WebSocket(`wss://rpc.${NODE_URL[node]}/websocket`);

    websocket.onopen = onOpen;
    websocket.onmessage = onMessage;
    websocket.onerror = onError as any;
    websocket.onclose = onClose;

    return websocket;
  }

  function onOpen() {
    const queries = [
      `transfer.recipient='${address}'`, // receiving token
      `wasm.to='${address}'`, // receiving CW20
    ];
    for (const query of queries) {
      const message = {
        jsonrpc: "2.0",
        method: "subscribe",
        id: 0,
        params: { query },
      };
      websocket.current!.send(JSON.stringify(message));
    }
  }

  function onMessage(e: WebSocketMessageEvent) {
    const data = JSON.parse(e.data);
    if (data.result?.data && data.result?.events) {
      const tx = parseTx(websocketTxToTxResponse(data.result));
      const addresses = new Set(accounts.map((account) => account.address));
      notifyTx(tx, addresses, isActive);
    }
  }

  function onError(e: WebSocketErrorEvent) {
    console.error("websocket error", e.message);
  }

  function onClose(e: WebSocketCloseEvent) {
    console.debug(`websocket closed on account ${address}`, e.code, e.reason);
  }

  return <></>;
}
