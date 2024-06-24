import { useSettingsStore } from "@/store";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import { CHAIN_ID } from "./consts";
import { web3wallet } from "./init";

export function getNamespaces(
  proposal: Web3WalletTypes.SessionProposal,
  address: string,
) {
  return buildApprovedNamespaces({
    proposal: proposal.params,
    supportedNamespaces: {
      cosmos: {
        accounts: [`${CHAIN_ID}:${address}`],
        methods: [
          "cosmos_getAccounts",
          "cosmos_signDirect",
          "cosmos_signAmino",
        ],
        chains: [CHAIN_ID],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });
}

export function disconnectApp(sessionTopic: string) {
  const { settings, setSetting } = useSettingsStore.getState();
  web3wallet.disconnectSession({
    topic: sessionTopic,
    reason: getSdkError("USER_DISCONNECTED"),
  });

  const storedSessions = settings["walletConnet.sessions"];
  setSetting(
    "walletConnet.sessions",
    storedSessions.filter((s) => s.topic !== sessionTopic),
  );
}
