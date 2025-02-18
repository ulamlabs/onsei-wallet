import { Colors } from "@/styles";
import { Image, StyleSheet, View } from "react-native";
import { iconSize } from "./const";
import { SvgUri } from "react-native-svg";
import { useState } from "react";

type Props = {
  assetIconUri?: string;
  chainIconUri?: string;
};

const chainIconSize = 14;
const placeholder = require("../../../../../assets/token-placeholder.png");

export function AssetChainIcon({ assetIconUri, chainIconUri }: Props) {
  const [isValid, setIsValid] = useState<boolean>(true);

  if (!isValid || assetIconUri?.startsWith("ipfs")) {
    return <Image style={styles.assetIcon} source={placeholder} />;
  }

  return (
    <View style={styles.container}>
      {!assetIconUri || assetIconUri.startsWith("ipfs") ? (
        <Image
          style={styles.assetIcon}
          source={placeholder}
          onError={() => setIsValid(false)}
        />
      ) : assetIconUri.endsWith(".svg") ? (
        <SvgUri
          uri={assetIconUri}
          width={iconSize}
          height={iconSize}
          fallback={<Image style={styles.assetIcon} source={placeholder} />}
          onError={(error) => {
            console.log("Cannot load svg icon", error);
          }}
        />
      ) : (
        <Image
          style={styles.assetIcon}
          source={{
            uri: assetIconUri,
          }}
          onError={() => setIsValid(false)}
        />
      )}

      {chainIconUri && (
        <View style={styles.chainIconWrapper}>
          {chainIconUri.endsWith(".svg") ? (
            <SvgUri
              uri={chainIconUri}
              width={chainIconSize}
              height={chainIconSize}
              fallback={<Image style={styles.assetIcon} source={placeholder} />}
              onError={(error) => {
                console.log("Cannot load svg icon", error);
              }}
            />
          ) : (
            <Image
              source={{
                uri: chainIconUri,
              }}
              style={styles.chainIcon}
              onError={() => setIsValid(true)}
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
