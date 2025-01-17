import { MergedRoute } from "@/modules/mergedBridgeData/types";
import { View } from "react-native";
import { NoData } from "../components/NoData";

type Props = {
  routes: MergedRoute[];
};

export function RoutesList({ routes }: Props) {
  return (
    <View>
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
