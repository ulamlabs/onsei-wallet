import { BridgeEnum } from "@/modules/mergedBridgeData/types";
import { bridgeNameMap, bridgeUrlMap } from "./utils";
import { AggregatorState, useAggregatorStore } from "@/store/bridgeAggregator";
import { toQueryString } from "@/utils/toQueryString";
import { Linking, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";

type Props = { bridge: BridgeEnum };

export function BridgeLink({ bridge }: Props) {
  const store = useAggregatorStore();
  return (
    <Pressable
      style={styles.pressable}
      onPress={() => {
        Linking.openURL(buildBridgeLink(bridge, store));
      }}
    >
      <Text style={styles.text}>{`Use ${bridgeNameMap[bridge]}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: Colors.grey50,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: "center",
  },
  text: {
    color: Colors.grey801,
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.2,
  },
});

const buildBridgeLink = (bridge: BridgeEnum, store: AggregatorState) => {
  let params;
  switch (bridge) {
    case "Skip":
      params = {
        amount_in: store.amount,
        src_asset: store.fromAsset?.skipDenom,
        src_chain: store.fromChain,
        dest_asset: store.toAsset?.skipDenom,
        dest_chain: store.toChain,
      };
      return bridgeUrlMap["Skip"] + toQueryString(params);
    case "Squid":
      // https://docs.squidrouter.com/building-with-squid-v2/widgets/widget/set-default-chains-and-tokens-via-url
      params = {
        chains: [store.fromChain ?? "", store.toChain ?? ""],
        tokens: [
          store.fromAsset?.squidAddress ?? "",
          store.toAsset?.squidAddress ?? "",
        ],
      };
      return bridgeUrlMap["Squid"] + toQueryString(params);

    case "Symbiosis":
      params = {
        chains: [store.fromChain ?? "", store.toChain ?? ""],
        tokens: [
          store.fromAsset?.symbiosisAddress ?? "",
          store.toAsset?.symbiosisAddress ?? "",
        ],
      };
      return bridgeUrlMap["Symbiosis"] + toQueryString(params);
  }
};
