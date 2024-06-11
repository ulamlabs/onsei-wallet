import { useAccountsStore, useModalStore, useSettingsStore } from "@/store";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import { getSdkError } from "@walletconnect/utils";
import { createWeb3Wallet, web3wallet } from "./init";
import {
  signAminoTxn,
  signDirectTxn,
  signGetAccountTxn,
} from "@/services/cosmos/tx";
import { Column, OptionGroup, Option, Text, Row } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { disconnectApp, getNamespaces } from "./utils";
import { WalletConnectSession } from "./types";

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
      !proposal.params.requiredNamespaces.cosmos
    ) {
      return alert({
        title: "Unable to connect",
        description: "This dApp doesn't support SEI chain",
      });
    }

    try {
      const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces: getNamespaces(proposal, activeAccount!.address),
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
                  {accounts.find(
                    (a) =>
                      a.address ===
                      requestEvent?.params.request.params.signerAddress,
                  )?.name ?? "?"}
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
        description: e.message,
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
