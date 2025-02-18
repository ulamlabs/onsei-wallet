import { MergedRoute } from "@/modules/mergedBridgeData/types";
import { StyleSheet, View } from "react-native";
import { NoData } from "../components/NoData";
import { useState } from "react";
import { RouteDetails } from "./RouteDetails";

type Props = {
  routes: MergedRoute[];
};

export function RoutesList({ routes }: Props) {
  const [open, setOpen] = useState<number | undefined>(0);

  return (
    <View style={styles.container}>
      {routes.map((route, idx) => (
        <RouteDetails
          isBestOffer={
            idx === 0 &&
            routes.length > 1 &&
            routes[0].expectedReceive !== routes[1].expectedReceive
          }
          key={route.bridge}
          open={open === idx}
          route={route}
          onPress={() => setOpen(idx === open ? undefined : idx)}
        />
      ))}
      {routes.length === 0 && (
        <NoData
          label={"No routes found for this token pair"}
          secondaryLabel={
            "Please select a different token configuration for available offers."
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
