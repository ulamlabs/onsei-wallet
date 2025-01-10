import { Colors } from "@/styles";
import { Image, StyleSheet, View } from "react-native";
import { iconSize } from "./const";

type Props = {
  assetIconUri?: string;
  chainIconUri?: string;
};

export function AssetChainIcon({ assetIconUri, chainIconUri }: Props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.assetIcon}
        source={
          assetIconUri
            ? {
                uri: assetIconUri,
              }
            : require("../../../../../assets/token-placeholder.png")
        }
      />
      {chainIconUri && (
        <View style={styles.chainIconWrapper}>
          <Image
            source={{
              uri: chainIconUri,
            }}
            style={styles.chainIcon}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  assetIcon: {
    height: iconSize,
    width: iconSize,
  },
  chainIconWrapper: {
    width: 16,
    height: 16,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.grey825,
    borderColor: Colors.grey825,
    borderRadius: 999,
    borderWidth: 1,
  },
  chainIcon: {
    height: 14,
    width: 14,
  },
});
