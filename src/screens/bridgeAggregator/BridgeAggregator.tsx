import { SafeLayout } from "@/components";
import { getChains } from "@/modules/squidApi/getChains";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import React, { useEffect, useState } from "react";

type BridgeAggregatorProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Bridge"
>;

export default function BridgeAggregator({
  navigation,
}: BridgeAggregatorProps) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    console.log("before");
    getChains()
      .then((response) => {
        console.log("in then");
        console.log(JSON.stringify(response.data, undefined, 2));
      })
      .catch((err) => {
        console.log("in err");
      });
  }, []);

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Onsei bridge aggregator" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 80 }}></SafeLayout>
    </>
  );
}
