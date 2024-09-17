import {
  Column,
  Headline,
  Loader,
  ResultHeader,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import {
  Transaction,
  deliverTxResponseToTxResponse,
  parseEvmToTransaction,
  parseTx,
} from "@/modules/transactions";
import { storeNewTransaction } from "@/modules/transactions/storage";
import { transferToken } from "@/services/cosmos/tx";
import { WalletClientWithPublicActions, getEvmClient } from "@/services/evm";
import { sendEvmTx } from "@/services/evm/tx";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { formatAmount, resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { isAddress as isEvmAddress } from "viem";

type TransferSendingScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSending"
>;

export default function TransferSendingScreen({
  navigation,
  route,
}: TransferSendingScreenProps) {
  const { activeAccount, getMnemonic } = useAccountsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    settings: { node },
  } = useSettingsStore();

  const transfer = route.params;

  const { sei, updateBalances, tokenMap } = useTokensStore();

  const token = useMemo(
    () => tokenMap.get(transfer.tokenId)!,
    [transfer.tokenId],
  );

  const intAmount = useMemo(
    () => BigInt(transfer.intAmount),
    [transfer.intAmount],
  );

  useEffect(() => {
    send();
  }, []);

  async function send() {
    const amount = formatAmount(intAmount, token.decimals);
    try {
      if (
        transfer.evmTxData?.pointerContract !== "0x" ||
        isEvmAddress(transfer.recipient.address)
      ) {
        const evmClient = await getEvmClient(
          getMnemonic(activeAccount!.address!),
          node === "TestNet",
        );
        const { walletClient } = evmClient;

        if (transfer.evmTxData?.pointerContract !== "0x") {
          await handleEvmPointerTransaction(walletClient, amount);
          return;
        }

        if (transfer.evmTransaction !== "0x") {
          await handleEvmRawTransaction(walletClient, amount);
          return;
        }
      }

      await handleCosmosTransaction(amount);
    } catch (error: any) {
      setError(error.toString());
    } finally {
      finishTransaction();
    }
  }

  async function handleEvmPointerTransaction(
    walletClient: WalletClientWithPublicActions,
    amount: string,
  ) {
    const { pointerContract, privateKey, tokenAmount } = transfer.evmTxData!;
    const tx = await sendEvmTx(
      pointerContract,
      privateKey,
      transfer.recipient.address as `0x${string}`,
      BigInt(tokenAmount),
      transfer.memo,
    );

    const transaction = await walletClient.getTransaction({
      hash: tx.hash as `0x${string}`,
    });

    const parsedTx = parseEvmToTransaction(transaction, token);
    storeNewTransaction(activeAccount!.address, parsedTx);

    navigateToSuccess(tx.hash as `0x${string}`, amount);
  }

  async function handleEvmRawTransaction(
    walletClient: WalletClientWithPublicActions,
    amount: string,
  ) {
    const hash = await walletClient.sendRawTransaction({
      serializedTransaction: transfer.evmTransaction!,
    });
    const transaction = await walletClient.getTransaction({ hash });
    const parsedTx = parseEvmToTransaction(transaction, token);
    storeNewTransaction(activeAccount!.address, parsedTx);

    navigateToSuccess(hash, amount);
  }

  async function handleCosmosTransaction(amount: string) {
    const tx = await transferToken({
      ...transfer,
      token,
      intAmount,
      recipient: transfer.recipient.address,
    });

    const parsedTx = parseTx(
      deliverTxResponseToTxResponse(tx),
      transfer.memo,
      transfer.fee.amount[0].amount,
    );

    if (parsedTx.status === "fail") {
      updateParsedTxWithFailure(parsedTx);
    }

    storeNewTransaction(activeAccount!.address, parsedTx);
    queryClient.invalidateQueries({ queryKey: ["transactions"] });

    navigation.navigate("transferSent", {
      tx,
      amount,
      symbol: token.symbol,
    });
  }

  function updateParsedTxWithFailure(parsedTx: Transaction) {
    parsedTx.amount = BigInt(transfer.intAmount);
    parsedTx.from = activeAccount!.address;
    parsedTx.to = transfer.recipient.address;
    parsedTx.token = transfer.tokenId;
    parsedTx.type = "sent";
  }

  function navigateToSuccess(txHash: `0x${string}`, amount: string) {
    const sentTx = { code: 0, transactionHash: txHash };
    navigation.navigate("transferSent", {
      tx: sentTx,
      amount,
      symbol: token.symbol,
    });
  }

  function finishTransaction() {
    setLoading(false);
    const tokensToUpdate = [sei];
    if (token.id !== sei.id) {
      tokensToUpdate.push(token);
    }
    updateBalances(tokensToUpdate);
  }

  function done() {
    navigation.navigate("Home");
    resetNavigationStack(navigation);
  }

  function getContent() {
    if (loading) {
      return (
        <>
          <Loader size="large" systemLoader={false} />
          <Headline>Sending ...</Headline>
        </>
      );
    }

    if (error) {
      return (
        <>
          <ResultHeader
            type="Fail"
            header="Something went wrong"
            description={error}
          />
          <TertiaryButton onPress={done} title="Close" />
        </>
      );
    }

    return <></>;
  }

  return (
    <SafeLayoutBottom>
      <Column
        style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
      >
        {getContent()}
      </Column>
    </SafeLayoutBottom>
  );
}
