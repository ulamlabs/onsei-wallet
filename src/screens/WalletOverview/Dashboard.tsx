import {
  Column,
  Headline,
  Loader,
  Row,
  SafeLayout,
  SecondaryButton,
  Text,
} from "@/components";
import { useAccountsStore, useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatTokenAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DirectboxReceive, DirectboxSend } from "iconsax-react-native";
import React from "react";
import { View } from "react-native";
import { TokensList } from "../account";
import DashboardTopBar from "./DashboardTopBar";

type DashboardProps = NativeStackScreenProps<NavigatorParamsList, "Wallet">;

export default function Dashboard({ navigation }: DashboardProps) {
  const { activeAccount } = useAccountsStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.push("Receive");
  }
  function onSend() {
    navigation.push("Send", {});
  }

  function render() {
    if (!activeAccount) {
      return <Loader />;
    }

    return (
      <>
        <DashboardTopBar activeAccount={activeAccount} />
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
        <Headline style={{ fontSize: 40, marginBottom: 0 }}>
          {formatTokenAmount(activeAccount.balance)} SEI
        </Headline>
      </>
    );
  }

  return (
    <SafeLayout>
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
