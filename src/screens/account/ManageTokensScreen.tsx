import { Column, Loader, Paragraph, SafeLayout, TextInput } from "@/components";
import { useInputState } from "@/hooks";
import { CosmToken, fetchCW20Token } from "@/services/cosmos";
import { useSettingsStore, useTokensStore } from "@/store";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { useEffect, useState } from "react";
import TokenToggle from "./TokenToggle";

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

    const textLowered = searchInput.value.toLowerCase();
    setTokens(
      tokensStore.cw20Tokens.filter(
        (t) =>
          t.name.toLowerCase().includes(textLowered) ||
          t.symbol.toLowerCase().includes(textLowered),
      ),
    );
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
    if (tokensStore.tokenMap.has(token.address)) {
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
          <TokenToggle
            token={token}
            key={token.address}
            selected={tokensStore.tokenMap.has(token.address)}
            onToggle={() => onToggle(token)}
          />
        ))}
      </Column>
    </SafeLayout>
  );
}
