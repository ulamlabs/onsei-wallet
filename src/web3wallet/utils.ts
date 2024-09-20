import { Account, useSettingsStore } from "@/store";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import { CHAIN_ID } from "./consts";
import { web3wallet } from "./init";

export function getNamespaces(
  proposal: Web3WalletTypes.SessionProposal,
  account: Account,
) {
  return buildApprovedNamespaces({
    proposal: proposal.params,
    supportedNamespaces: {
      cosmos: {
        accounts: [`${CHAIN_ID}:${account.address}`],
        methods: [
          "cosmos_getAccounts",
          "cosmos_signDirect",
          "cosmos_signAmino",
        ],
        chains: [CHAIN_ID],
        events: ["chainChanged", "accountsChanged"],
      },
      eip155: {
        chains: ["eip155:1329", "eip155:1"],
        methods: [
          "eth_accounts",
          "eth_requestAccounts",
          "eth_sendRawTransaction",
          "eth_sign", // eth_sign is not supported because Infura doesn't store the user's private key required for the signature. DEPRECATED
          "eth_signTransaction",
          "eth_signTypedData",
          "eth_signTypedData_v3",
          "eth_signTypedData_v4",
          "eth_sendTransaction",
          "personal_sign",
          "wallet_switchEthereumChain",
          "wallet_addEthereumChain",
          "wallet_getPermissions",
          "wallet_requestPermissions",
          "wallet_registerOnboarding",
          "wallet_watchAsset",
          "wallet_scanQRCode",
          "wallet_sendCalls",
          "wallet_getCallsStatus",
          "wallet_showCallsStatus",
          "wallet_getCapabilities",
        ],
        accounts: [
          `eip155:1329:${account.evmAddress}`,
          `eip155:1:${account.evmAddress}`,
        ],
        events: [
          "chainChanged",
          "accountsChanged",
          "message",
          "disconnect",
          "connect",
        ],
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

export function findAccount(accounts: Account[], address: string) {
  return accounts.find(
    (a) =>
      a.address.toLowerCase() === address.toLowerCase() ||
      a.evmAddress.toLowerCase() === address.toLowerCase(),
  );
}
