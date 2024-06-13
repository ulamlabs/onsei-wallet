import {
  Column,
  Headline,
  Loader,
  Row,
  SafeLayout,
  SecondaryButton,
  Text,
} from "@/components";
import {
  useAccountsStore,
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { calculateTotalBalance } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DirectboxReceive, DirectboxSend } from "iconsax-react-native";
import React from "react";
import { TokensList } from "../tokens";

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const { updateBalances, tokens } = useTokensStore();
  const { refreshRegistryCache } = useTokenRegistryStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.push("Your SEI address");
  }
  function onSend() {
    navigation.push("transferSelectToken");
  }
  async function onRefresh() {
    await refreshRegistryCache();
    updateBalances();
  }

  function render() {
    if (!activeAccount) {
      return <Loader />;
    }

    return (
      <>
        {node === "TestNet" && (
          <Row
            style={{
              backgroundColor: Colors.markerBackground,
              paddingVertical: 12,
              justifyContent: "center",
              width: "100%",
              borderRadius: 22,
            }}
          >
            <Text
              style={{ fontSize: FontSizes.base, fontFamily: FontWeights.bold }}
            >
              Testnet mode
            </Text>
          </Row>
        )}
        <Headline size="2xl" style={{ marginBottom: 0 }}>
          ${calculateTotalBalance(tokens)}
        </Headline>
      </>
    );
  }

  return (
    <SafeLayout refreshFn={onRefresh}>
      <Column style={{ alignItems: "center" }}>{render()}</Column>
      <Row
        style={{
          justifyContent: "space-around",
          marginVertical: 30,
        }}
      >
        <SecondaryButton
          title="Receive"
          onPress={onReceive}
          icon={DirectboxReceive}
        />
        <SecondaryButton title="Send" onPress={onSend} icon={DirectboxSend} />
      </Row>
      <TokensList />
    </SafeLayout>
  );
}
