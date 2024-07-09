import {
  Column,
  EmptyList,
  Loader,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { CosmToken, fetchCW20Token } from "@/services/cosmos";
import {
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { NavigatorParamsList } from "@/types";
import { searchTokens } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { SearchNormal } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import TokenToggleBox from "./TokenToggleBox";

const TOKENS_PER_PAGE = 20;

type Props = NativeStackScreenProps<NavigatorParamsList, "Manage Token List">;

export default function ManageTokensScreen({ navigation }: Props) {
  const searchInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tokensStore = useTokensStore();
  const { tokenRegistry } = useTokenRegistryStore();
  const [tokens, setTokens] = useState<CosmToken[]>([]);
  const [addedTokens, setAddedTokens] = useState<CosmToken[]>([]);
  const [addedTokensIds, setAddedTokensIds] = useState<string[]>([]);
  const [removedTokens, setRemovedTokens] = useState<CosmToken[]>([]);
  const [removedTokensIds, setRemovedTokensIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
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

  function isSelected(tokenId: string) {
    return (
      (tokensStore.tokenMap.has(tokenId) &&
        !removedTokensIds.includes(tokenId)) ||
      addedTokensIds.includes(tokenId)
    );
  }

  async function onToggle(token: CosmToken) {
    if (isSelected(token.id)) {
      setRemovedTokens([...removedTokens, token]);
      setRemovedTokensIds([...removedTokensIds, token.id]);
      if (addedTokensIds.includes(token.id)) {
        setAddedTokens(addedTokens.filter((t) => t.id !== token.id));
        setAddedTokensIds(addedTokensIds.filter((tId) => tId !== token.id));
      }
    } else {
      setAddedTokens([...addedTokens, token]);
      setAddedTokensIds([...addedTokensIds, token.id]);
      if (removedTokensIds.includes(token.id)) {
        setRemovedTokens(removedTokens.filter((t) => t.id !== token.id));
        setRemovedTokensIds(removedTokensIds.filter((tId) => tId !== token.id));
      }
    }
  }

  async function onSave() {
    setSaving(true);
    tokensStore.removeTokens(removedTokens);
    await tokensStore.addTokens(addedTokens);
    navigation.goBack();
  }

  return (
    <SafeLayout staticView={true}>
      <Column style={{ flexGrow: 1 }}>
        <TextInput
          placeholder="Enter token name or contract address"
          icon={SearchNormal}
          {...searchInput}
          autoCorrect={false}
          showClear
        />

        {loading && (
          <View style={{ alignItems: "center" }}>
            <Loader />
          </View>
        )}

        {error && (
          <Paragraph style={{ textAlign: "center" }}>{error}</Paragraph>
        )}

        {!error && !loading && tokens.length === 0 && searchInput.value && (
          <EmptyList
            title="No tokens found"
            description="No tokens matching the criteria"
          />
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
                  selected={isSelected(token.id)}
                  onToggle={() => onToggle(token)}
                />
              </View>
            )}
            onEndReached={addTokensToList}
            onEndReachedThreshold={0.3}
          />
        </View>
      </Column>

      <PrimaryButton
        title="Save changes"
        onPress={onSave}
        style={{ marginTop: 24 }}
        loading={saving}
      />
    </SafeLayout>
  );
}
