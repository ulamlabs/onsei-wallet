import { ChainId, MergedChain } from "@/modules/mergedBridgeData/types";
import {
  useChainById,
  useChainList,
} from "@/modules/mergedBridgeData/useMergedChains";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { frequentChains } from "../utils";
import { Colors, FontSizes } from "@/styles";
import { Text } from "@/components";
import { Header } from "./Header";
import { SvgUri } from "react-native-svg";

type Props = {
  extraChainId: ChainId;
  selectedChain?: MergedChain;
  onOpenSelectChain: () => void;
  onChainSelect: (value: ChainId) => void;
};

export function QuickChainSelector({
  extraChainId,
  selectedChain,
  onOpenSelectChain,
  onChainSelect,
}: Props) {
  const chains = useChainList();

  const remaining = chains.length - frequentChains.length;

  const quickAccessChains = [...frequentChains, extraChainId];

  return (
    <View style={styles.container}>
      <Header>{`Select network: ${selectedChain?.chainName}`}</Header>
      <View style={styles.buttons}>
        {quickAccessChains.map((chainId, i) => (
          <NetworkButton
            key={`${chainId}-${i}`}
            active={selectedChain?.chainId === chainId}
            chainId={chainId}
            onPress={() => onChainSelect(chainId)}
          />
        ))}
        {remaining > 0 && (
          <MoreNetworksButton count={remaining} onPress={onOpenSelectChain} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  buttons: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function NetworkButton({
  active,
  chainId,
  onPress,
}: {
  active: boolean;
  chainId: ChainId;
  onPress: () => void;
}) {
  const chain = useChainById(chainId);

  return (
    <Pressable
      style={[
        networkButtonStyles.button,
        { borderColor: active ? Colors.grey50 : Colors.grey826 },
      ]}
      onPress={onPress}
    >
      {chain?.chainIconUri.startsWith("ipfs") ? (
        <Image
          style={networkButtonStyles.image}
          source={require("../../../../../assets/token-placeholder.png")}
        />
      ) : chain?.chainIconUri.endsWith(".svg") ? (
        <SvgUri uri={chain?.chainIconUri} width={iconSize} height={iconSize} />
      ) : (
        <Image
          source={{ uri: chain?.chainIconUri }}
          style={networkButtonStyles.image}
        />
      )}
    </Pressable>
  );
}

const iconSize = 28;

const networkButtonStyles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
    width: 52,
    height: 52,
    backgroundColor: Colors.grey826,
  },
  image: {
    width: iconSize,
    height: iconSize,
  },
});

function MoreNetworksButton({
  count,
  onPress,
}: {
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={moreNetworksButtonStyles.button} onPress={onPress}>
      <Text style={moreNetworksButtonStyles.text}>{`+${count}`}</Text>
    </Pressable>
  );
}

const moreNetworksButtonStyles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    width: 52,
    height: 52,
    backgroundColor: Colors.grey826,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.text,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.5,
  },
});
