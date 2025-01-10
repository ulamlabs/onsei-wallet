import { Text, TextInput } from "@/components";
import { MergedChain } from "@/modules/mergedBridgeData/types";
import { useChainList } from "@/modules/mergedBridgeData/useMergedChains";
import { SearchNormal } from "iconsax-react-native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { getExtraChain } from "./utils";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import { NoData } from "./components/NoData";
import { iconSize } from "./components/const";

export function SelectChainView() {
  const store = useAggregatorStore();

  const navigation = useNavigation<NavigationProp>();

  const [chainQuery, setChainQuery] = useState("");

  const optionChains = useChainList();

  const searchQueryLc = chainQuery.toLowerCase();

  const filteredChains = chainQuery
    ? optionChains.filter(
        (chain) =>
          chain.chainName.toLowerCase().includes(searchQueryLc) ||
          chain.chainId.toLowerCase().includes(searchQueryLc),
      )
    : optionChains;

  return (
    <View style={styles.container}>
      <TextInput
        showClear
        placeholder="Search network"
        icon={SearchNormal}
        value={chainQuery}
        onChangeText={setChainQuery}
      />
      <View>
        {filteredChains.map((chain) => (
          <ChainButton
            key={chain.chainId}
            chain={chain}
            onPress={() => {
              store.setSelectedChainId(chain.chainId);
              store.setExtraChainId(
                getExtraChain(chain.chainId, store.extraChainId),
              );
              navigation.goBack();
            }}
          />
        ))}
        {filteredChains.length === 0 && (
          <NoData
            label={"No networks found"}
            secondaryLabel={"There are no networks matching your search query."}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});

type ChainButtonProps = { chain: MergedChain; onPress?: () => void };

function ChainButton({ chain, onPress }: ChainButtonProps) {
  return (
    <Pressable style={chainButtonStyles.container} onPress={onPress}>
      <Image
        style={chainButtonStyles.image}
        source={{ uri: chain.chainIconUri }}
      />
      <Text style={chainButtonStyles.text}>{chain.chainName}</Text>
    </Pressable>
  );
}

const chainButtonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  image: {
    height: iconSize,
    width: iconSize,
  },
  text: {
    color: Colors.text,
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * 1.2,
  },
});
