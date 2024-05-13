import { Column, Loader, Paragraph, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { CosmToken, fetchCW20Token } from "@/services/cosmos";
import { useSettingsStore, useTokensStore } from "@/store";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { useEffect, useState } from "react";
import TokenToggleBox from "./TokenToggleBox";
import { searchTokens } from "@/utils";

export default function ManageTokensScreen() {
  const searchInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tokensStore = useTokensStore();
  const [tokens, setTokens] = useState(tokensStore.cw20Tokens);
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

    setTokens(searchTokens(tokensStore.cw20Tokens, searchInput.value));
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

  function onToggle(token: CosmToken) {
    if (tokensStore.tokenMap.has(token.id)) {
      tokensStore.removeToken(token);
    } else {
      tokensStore.addToken(token);
    }
  }

  return (
    <SafeLayout>
      <Column>
        <TextInput
          placeholder="Enter token name or contract address"
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

        {tokens.map((token) => (
          <TokenToggleBox
            token={token}
            key={token.id}
            selected={tokensStore.tokenMap.has(token.id)}
            onToggle={() => onToggle(token)}
          />
        ))}
      </Column>
    </SafeLayout>
  );
}
