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
import { ArrowUp, ArrowDown } from "iconsax-react-native";
import React from "react";
import { TokensList } from "../tokens";

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const { updateBalances, tokens } = useTokensStore();
  const { refreshRegistryCache } = useTokenRegistryStore();
  const {
    settings: { selectedGasPrice },
    setSetting,
  } = useSettingsStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.push("Your SEI address");
  }
  function onSend() {
    setSetting("selectedGasPrice", {
      ...selectedGasPrice,
      local: selectedGasPrice.global,
    });
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
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: FontSizes.base,
                fontFamily: FontWeights.bold,
                color: Colors.markerText,
              }}
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
        <SecondaryButton title="Send" onPress={onSend} icon={ArrowUp} />
        <SecondaryButton title="Receive" onPress={onReceive} icon={ArrowDown} />
      </Row>
      <TokensList />
    </SafeLayout>
  );
}
