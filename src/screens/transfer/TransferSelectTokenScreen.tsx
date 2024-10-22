import {
  Column,
  Paragraph,
  SafeLayout,
  TextInput,
  TokenBalanceBox,
} from "@/components";
import { useInputState } from "@/hooks";
import { CosmToken } from "@/services/cosmos";
import { getSeiAddress } from "@/services/evm";
import { useModalStore, useTokensStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { searchTokens } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { isAddress as isEvmAddress } from "viem";

type TransferSelectTokenScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSelectToken"
>;

export default function TransferSelectTokenScreen({
  navigation,
  route: {
    params: { recipient },
  },
}: TransferSelectTokenScreenProps) {
  const searchInput = useInputState();
  const tokensStore = useTokensStore();
  const [tokens, setTokens] = useState(tokensStore.tokens);
  const [linkedToSei, setLinkedToSei] = useState(false);
  const { alert } = useModalStore();

  useEffect(() => {
    async function checkLinked() {
      if (isEvmAddress(recipient.address)) {
        const isLinkedToSei = await getSeiAddress(recipient.address);
        setLinkedToSei(!!isLinkedToSei);
        return;
      }
      setLinkedToSei(true);
    }

    checkLinked();
  }, []);

  useEffect(() => {
    setTokens(searchTokens(tokensStore.tokens, searchInput.value));
  }, [searchInput.value]);

  function select(token: CosmToken) {
    if (token.type === "cw20" && !linkedToSei) {
      alert({
        description:
          "You cannot transfer CW20 tokens to an address that is not linked to SEI",
        title: "Cannot transfer CW20 token",
      });
      return;
    }

    navigation.navigate("transferAmount", {
      recipient,
      tokenId: token.id,
    });
  }

  return (
    <SafeLayout>
      <Column>
        <TextInput
          placeholder="Search token"
          {...searchInput}
          autoCorrect={false}
          showClear
        />

        {tokens.map((token) => (
          <TokenBalanceBox token={token} onPress={select} key={token.id} />
        ))}

        {tokens.length === 0 && (
          <Paragraph style={{ textAlign: "center" }}>
            No tokens matching given criteria
          </Paragraph>
        )}
      </Column>
    </SafeLayout>
  );
}
