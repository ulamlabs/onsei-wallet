import { SearchNormal } from "iconsax-react-native";
import { Column, Loader, Paragraph, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { CosmToken, fetchCW20Token } from "@/services/cosmos";
import {
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { useEffect, useState } from "react";
import TokenToggleBox from "./TokenToggleBox";
import { searchTokens } from "@/utils";
import { FlatList, View } from "react-native";

const TOKENS_PER_PAGE = 20;

export default function ManageTokensScreen() {
  const searchInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tokensStore = useTokensStore();
  const { tokenRegistry } = useTokenRegistryStore();
  const [tokens, setTokens] = useState<CosmToken[]>([]);
  const {
    settings: { node },
  } = useSettingsStore();

  useEffect(() => {
    setError("");
    updateTokens();
  }, [searchInput.value]);

  async function updateTokens() {
    if (isValidSeiCosmosAddress(searchInput.value)) {
      await fetchToken();
      return;
    }

    if (searchInput.value) {
      setTokens(searchTokens(tokenRegistry, searchInput.value));
    } else {
      setTokens(tokenRegistry.slice(0, TOKENS_PER_PAGE));
    }
  }

  function addTokensToList() {
    if (!searchInput.value) {
      setTokens([
        ...tokens,
        ...tokenRegistry.slice(tokens.length, tokens.length + TOKENS_PER_PAGE),
      ]);
    }
  }

  async function fetchToken() {
    setLoading(true);
    setTokens([]);
    try {
      const token = await fetchCW20Token(searchInput.value, node);
      setTokens([token]);
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }

  function onToggle(token: any) {
    if (tokensStore.tokenMap.has(token.id)) {
      tokensStore.removeToken(token);
    } else {
      tokensStore.addToken({ ...token, balance: 0n });
    }
  }

  return (
    <SafeLayout noScroll={true}>
      <Column style={{ flexGrow: 1 }}>
        <TextInput
          placeholder="Enter token name or contract address"
          icon={SearchNormal}
          {...searchInput}
          autoCorrect={false}
          showClear
        />

        {loading && <Loader />}

        {error && (
          <Paragraph style={{ textAlign: "center" }}>{error}</Paragraph>
        )}

        {!error && !loading && tokens.length === 0 && searchInput.value && (
          <Paragraph style={{ textAlign: "center" }}>
            No tokens matching the criteria
          </Paragraph>
        )}

        <View style={{ flex: 1 }}>
          <FlatList
            data={tokens}
            nestedScrollEnabled={true}
            renderItem={({ item: token }) => (
              <View style={{ marginVertical: 6 }}>
                <TokenToggleBox
                  token={token}
                  key={token.id}
                  selected={tokensStore.tokenMap.has(token.id)}
                  onToggle={() => onToggle(token)}
                />
              </View>
            )}
            onEndReached={addTokensToList}
            onEndReachedThreshold={0.3}
          />
        </View>
      </Column>
    </SafeLayout>
  );
}
