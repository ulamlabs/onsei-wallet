import { MergedRoute } from "@/modules/mergedBridgeData/types";
import { Colors } from "@/styles";
import { Pressable, StyleSheet, View } from "react-native";
import { BridgeLogo } from "./components/BridgeLogo";
import { ExpectedTime } from "./components/ExpectedTime";
import { BestOfferPill } from "./components/BestOfferPill";
import { RouteDetailsHeader } from "./RouteDetailsHeader";
import { RouteDetailsBody } from "./RouteDetailsBody";

type Props = {
  isBestOffer: boolean;
  open: boolean;
  route: MergedRoute;
  onPress: () => void;
};

export function RouteDetails({
  isBestOffer,
  open,
  route: {
    bridge,
    expectedReceive,
    expectedReceiveUsd,
    expectedTime,
    minReceive,
  },
  onPress,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        open
          ? {
              backgroundColor: Colors.grey800,
              borderColor: Colors.grey50,
            }
          : {
              backgroundColor: Colors.grey826,
              borderColor: Colors.grey825,
            },
      ]}
    >
      <Pressable style={styles.pressable} onPress={onPress}>
        <View style={styles.bridgeLogoOuterContainer}>
          <View style={styles.bridgeLogoInnerContainer}>
            <BridgeLogo bridge={bridge} />
            <ExpectedTime time={expectedTime} />
          </View>
          <BestOfferPill isBestOffer={isBestOffer} />
        </View>
        <RouteDetailsHeader
          expectedReceive={expectedReceive}
          expectedReceiveUsd={expectedReceiveUsd}
          open={open}
        />
      </Pressable>
      <RouteDetailsBody
        bridge={bridge}
        expectedReceive={expectedReceive}
        minReceive={minReceive}
        open={open}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
  },
  pressable: {
    gap: 16,
  },
  bridgeLogoOuterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bridgeLogoInnerContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
