import {
  Column,
  Headline,
  Loader,
  PrimaryButton,
  SafeLayoutBottom,
  Text,
} from "@/components";
import { deliverTxResponseToTxResponse, parseTx } from "@/modules/transactions";
import { storeNewTransaction } from "@/modules/transactions/storage";
import { transferToken } from "@/services/cosmos/tx";
import { useAccountsStore, useTokensStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { formatAmount, resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

type TransferSendingScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSending"
>;

export default function TransferSendingScreen({
  navigation,
  route,
}: TransferSendingScreenProps) {
  const { activeAccount } = useAccountsStore();
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
      const tx = await transferToken({ ...transfer, token, intAmount });
      storeNewTransaction(
        activeAccount!.address,
        parseTx(deliverTxResponseToTxResponse(tx)),
      );
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigation.navigate("transferSent", {
        tx,
        amount: formatAmount(intAmount, token.decimals),
        token,
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
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Text>{error}</Text>
          </View>
          <PrimaryButton title="OK" onPress={done} />
        </>
      );
    }

    return <></>;
  }

  return (
    <SafeLayoutBottom>
      <Column style={{ justifyContent: "center", flex: 1 }}>
        {getContent()}
      </Column>
    </SafeLayoutBottom>
  );
}
