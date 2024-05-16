import { Column, Paragraph, TextInput } from "@/components";
import { useTokensStore } from "@/store";
import { TokenBalanceBox } from "@/components";
import { CosmToken } from "@/services/cosmos";
import { SafeLayout } from "@/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { useInputState } from "@/hooks";
import { useEffect, useState } from "react";
import { searchTokens } from "@/utils";

type TransferSelectTokenScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSelectToken"
>;

export default function TransferSelectTokenScreen({
  navigation,
}: TransferSelectTokenScreenProps) {
  const searchInput = useInputState();
  const tokensStore = useTokensStore();
  const [tokens, setTokens] = useState(tokensStore.tokens);

  useEffect(() => {
    setTokens(searchTokens(tokensStore.tokens, searchInput.value));
  }, [searchInput.value]);

  function select(token: CosmToken) {
    navigation.navigate("transferSelectAddress", {
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
