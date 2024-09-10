import {
  Column,
  Headline,
  Loader,
  ResultHeader,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import { deliverTxResponseToTxResponse, parseTx } from "@/modules/transactions";
import { storeNewTransaction } from "@/modules/transactions/storage";
import { transferToken } from "@/services/cosmos/tx";
import { getEvmClient } from "@/services/evm";
import { useAccountsStore, useTokensStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { formatAmount, resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { isAddress } from "viem";

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
    try {
      if (
        isAddress(transfer.recipient.address) &&
        transfer.evmTransaction !== "0x" &&
        transfer.evmTransaction
      ) {
        const evmClient = await getEvmClient(
          getMnemonic(activeAccount?.address!),
        );
        const { walletClient } = evmClient;
        const hash = await walletClient.sendRawTransaction({
          serializedTransaction: transfer.evmTransaction,
        });
        return;
      }
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
        parsedTx.amount = BigInt(transfer.intAmount);
        parsedTx.from = activeAccount!.address;
        parsedTx.to = transfer.recipient.address;
        parsedTx.token = transfer.tokenId;
        parsedTx.type = "sent";
      }

      storeNewTransaction(activeAccount!.address, parsedTx);
      const amount = formatAmount(intAmount, token.decimals);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigation.navigate("transferSent", {
        tx,
        amount,
        symbol: token.symbol,
      });
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
      const tokensToUpdate = [sei];
      if (token.id !== sei.id) {
        tokensToUpdate.push(token);
      }
      updateBalances(tokensToUpdate);
    }
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
