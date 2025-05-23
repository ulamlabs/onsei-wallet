import { Column, Option, OptionGroup, Row, Text } from "@/components";
import {
  signAminoTxn,
  signDirectTxn,
  signGetAccountTxn,
} from "@/services/cosmos/tx";
import {
  personalSign,
  sendDirectTx,
  sendRawTransaction,
  signTransaction,
  signTypedData,
} from "@/services/evm/tx";
import { useAccountsStore, useModalStore, useSettingsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { isCorrectAddress } from "@/utils";
import { getSdkError } from "@walletconnect/utils";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import { useEffect, useMemo, useState } from "react";
import { Image, Linking } from "react-native";
import { createWeb3Wallet, onConnect, web3wallet } from "./init";
import { WalletConnectSession } from "./types";
import { disconnectApp, findAccount, getNamespaces } from "./utils";

export default function Web3WalletController() {
  const { activeAccount, accounts } = useAccountsStore();
  const { settings, setSetting } = useSettingsStore();
  const [proposal, setProposal] =
    useState<Web3WalletTypes.SessionProposal | null>(null);
  const [requestEvent, setRequestEvent] =
    useState<Web3WalletTypes.SessionRequest | null>(null);
  const { ask, alert } = useModalStore();

  useEffect(() => {
    loadWeb3Wallet();
    Linking.addEventListener("url", handleURL);

    return () => Linking.removeAllListeners("url");
  }, []);

  useEffect(() => {
    if (proposal) {
      proposeConnection();
    }
  }, [proposal]);

  useEffect(() => {
    if (requestEvent) {
      onRequest();
    }
  }, [requestEvent]);

  async function loadWeb3Wallet() {
    await createWeb3Wallet();
    setupWalletListeners();
  }

  function handleURL(url: string | { url: string } | null) {
    if (url) {
      const address =
        typeof url === "string"
          ? url.split("onseiwallet://")[1]
          : url?.url?.split("onseiwallet://")[1];
      if (address) {
        onConnect(address);
      }
    }
  }

  const getInitialURL = async () => {
    const initialUrl = await Linking.getInitialURL();
    handleURL(initialUrl);
  };

  function setupWalletListeners() {
    if (web3wallet) {
      web3wallet.on("session_proposal", (proposal) => {
        setProposal(proposal);
      });

      web3wallet.on("session_request", (requestEvent) => {
        setRequestEvent(requestEvent);
      });

      web3wallet.on("session_delete", (session) => {
        disconnectApp(session.topic);
      });

      getInitialURL();
    }
  }

  async function proposeConnection() {
    const yesno = await ask({
      title: "Connect with dApp",
      question: (
        <Column
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
            paddingTop: 14,
          }}
        >
          <Image
            source={{
              uri: proposal?.params.proposer.metadata.icons[0] || "",
            }}
            style={{ width: 50, height: 50 }}
          />
          <Text
            style={{
              fontSize: FontSizes.xl,
              fontFamily: FontWeights.bold,
              textAlign: "center",
            }}
          >
            {proposal?.params.proposer.metadata.name} wants to connect with your
            wallet.
          </Text>
          <Text style={{ color: Colors.text100, fontSize: FontSizes.sm }}>
            {proposal?.params.proposer.metadata.url}
          </Text>
        </Column>
      ),
      yes: "Connect",
      no: "Cancel",
      primary: "yes",
      showCloseButton: true,
    });
    if (yesno) {
      acceptProposal();
    } else {
      rejectProposal();
    }
  }

  async function acceptProposal() {
    if (!proposal) {
      return;
    }
    if (
      !proposal.params.optionalNamespaces.cosmos &&
      !proposal.params.requiredNamespaces.cosmos &&
      !proposal.params.requiredNamespaces.eip155 &&
      !proposal.params.optionalNamespaces.eip155
    ) {
      return alert({
        title: "Unable to connect",
        description: "This dApp doesn't support SEI and EVM chain",
      });
    }

    try {
      const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces: getNamespaces(proposal, activeAccount!),
      });

      await web3wallet.respondSessionRequest({
        topic: session.topic,
        response: {
          id: proposal!.id,
          result: "session approved",
          jsonrpc: "2.0",
        },
      });

      const currentSessions = settings["walletConnet.sessions"] || [];
      const newSession = {
        account: activeAccount!.address,
        appName: proposal.params.proposer.metadata.name,
        icon: proposal.params.proposer.metadata.icons[0],
        timestamp: Date.now().toString(),
        topic: session.topic,
      } as WalletConnectSession;
      setSetting("walletConnet.sessions", [newSession, ...currentSessions]);
    } catch (e: any) {
      return alert({
        title: "Error on connecting",
        description: e.message,
      });
    } finally {
      setProposal(null);
    }
  }

  async function rejectProposal() {
    await web3wallet.rejectSession({
      id: proposal!.id,
      reason: getSdkError("USER_REJECTED"),
    });
    setProposal(null);
  }

  const requestAccount = useMemo(() => {
    if (!requestEvent?.params?.request?.params) {
      return undefined;
    }

    const [param0, param1] = requestEvent.params.request.params;

    const address =
      param0?.from ||
      (isCorrectAddress(param0) ? param0 : param1) ||
      param0?.from;

    if (!address) {
      return undefined;
    }

    return findAccount(accounts, address);
  }, [requestEvent]);

  async function onRequest() {
    if (!isTopicKnown()) {
      rejectRequest(getSdkError("USER_DISCONNECTED").message);
      return;
    }

    const yesno = await ask({
      title: "Incoming transaction to sign",
      question: (
        <Column style={{ marginVertical: 32 }}>
          <OptionGroup>
            <Option>
              <Row>
                <Text style={{ color: Colors.text100 }}>Account</Text>
                <Text style={{ flex: 1, textAlign: "right" }}>
                  {requestAccount?.name ?? "?"}
                </Text>
              </Row>
            </Option>
            <Option>
              <Row>
                <Text style={{ color: Colors.text100 }}>Source</Text>
                <Text style={{ flex: 1, textAlign: "right" }}>
                  {requestEvent?.verifyContext.verified.origin || "?"}
                </Text>
              </Row>
            </Option>
          </OptionGroup>
        </Column>
      ),
      yes: "Sign",
      no: "Abort",
      primary: "yes",
      showCloseButton: true,
    });
    if (yesno) {
      acceptRequest();
    } else {
      rejectRequest();
    }
  }

  function isTopicKnown() {
    // There may be a case that user removes a session on our wallet but dApp won't catch it and will still try to send requests. They should be ignored
    const knownTopics = new Set(
      (settings["walletConnet.sessions"] || []).map((s) => s.topic),
    );
    return knownTopics.has(requestEvent!.topic);
  }

  async function acceptRequest() {
    const { params, id, topic } = requestEvent!;
    const { request } = params;
    let sig: any;
    if (!requestAccount) {
      throw new Error("Requested account has not been found");
    }
    try {
      switch (request.method) {
        case "cosmos_getAccounts":
          sig = await signGetAccountTxn();
          break;
        case "cosmos_signDirect":
          sig = await signDirectTxn(request.params);
          break;
        case "cosmos_signAmino":
          sig = await signAminoTxn(request.params);
          break;
        case "eth_sendTransaction":
          sig = await sendDirectTx(request.params[0], requestAccount);
          break;
        case "personal_sign":
          sig = await personalSign(request.params[0], requestAccount);
          break;
        case "eth_signTransaction":
          sig = await signTransaction(request.params[0], requestAccount);
          break;
        case "eth_signTypedData":
          sig = await signTypedData(request.params, requestAccount);
          break;
        case "eth_signTypedData_v4":
          sig = await signTypedData(request.params, requestAccount);
          break;
        case "eth_sendRawTransaction":
          sig = await sendRawTransaction(request.params, requestAccount);
          break;
        default:
          throw new Error(getSdkError("INVALID_METHOD").message);
      }

      await web3wallet.respondSessionRequest({
        topic,
        response: {
          id,
          jsonrpc: "2.0",
          result: sig,
        },
      });
      setRequestEvent(null);
    } catch (e: any) {
      alert({
        title: "Error on signing",
        description:
          e.info.error.message.replace(/^:\s*/, "") || "Something went wrong",
      });
      rejectRequest();
    }
  }

  async function rejectRequest(message = getSdkError("USER_REJECTED").message) {
    await web3wallet.respondSessionRequest({
      topic: requestEvent!.topic,
      response: {
        id: requestEvent!.id,
        jsonrpc: "2.0",
        error: {
          code: 5000,
          message,
        },
      },
    });
    setRequestEvent(null);
  }

  return <></>;
}
