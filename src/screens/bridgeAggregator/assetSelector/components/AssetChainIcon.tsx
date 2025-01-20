import { Colors } from "@/styles";
import { Image, StyleSheet, View } from "react-native";
import { iconSize } from "./const";
import { SvgUri } from "react-native-svg";

type Props = {
  assetIconUri?: string;
  chainIconUri?: string;
};

const chainIconSize = 14;

export function AssetChainIcon({ assetIconUri, chainIconUri }: Props) {
  return (
    <View style={styles.container}>
      {!assetIconUri || assetIconUri.startsWith("ipfs") ? (
        <Image
          style={styles.assetIcon}
          source={require("../../../../../assets/token-placeholder.png")}
        />
      ) : assetIconUri.endsWith(".svg") ? (
        <SvgUri uri={assetIconUri} width={iconSize} height={iconSize} />
      ) : (
        <Image
          style={styles.assetIcon}
          source={{
            uri: assetIconUri,
          }}
        />
      )}

      {chainIconUri && (
        <View style={styles.chainIconWrapper}>
          {chainIconUri.endsWith(".svg") ? (
            <SvgUri
              uri={chainIconUri}
              width={chainIconSize}
              height={chainIconSize}
            />
          ) : (
            <Image
              source={{
                uri: chainIconUri,
              }}
              style={styles.chainIcon}
            />
          )}
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
    width: chainIconSize + 2,
    height: chainIconSize + 2,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.grey825,
    borderColor: Colors.grey825,
    borderRadius: 999,
    borderWidth: 1,
  },
  chainIcon: {
    height: chainIconSize,
    width: chainIconSize,
  },
});
