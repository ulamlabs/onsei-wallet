import {
  Column,
  Headline,
  Loader,
  Row,
  SafeLayout,
  SecondaryButton,
  Text,
} from "@/components";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { calculateTotalBalance } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DirectboxReceive, DirectboxSend } from "iconsax-react-native";
import React from "react";
import { View } from "react-native";
import { TokensList } from "../account";

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const { updateBalances, tokens } = useTokensStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.push("Your SEI address");
  }
  function onSend() {
    navigation.push("transferSelectToken");
  }

  function render() {
    if (!activeAccount) {
      return <Loader />;
    }

    return (
      <>
        {node === "TestNet" && (
          <View
            style={{
              borderRadius: 50,
              backgroundColor: Colors.warning,
              paddingHorizontal: 20,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: Colors.background }}>
              TestNet
            </Text>
          </View>
        )}
        <Headline size="2xl" style={{ marginBottom: 0 }}>
          ${calculateTotalBalance(tokens)}
        </Headline>
      </>
    );
  }

  return (
    <SafeLayout refreshFn={() => updateBalances(undefined, true)}>
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
