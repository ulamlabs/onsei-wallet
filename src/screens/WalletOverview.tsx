import {
  AccountsList,
  Column,
  Headline,
  Loader,
  Paragraph,
  Row,
  SafeLayout,
  SecondaryButton,
} from "@/components";
import { useAccountsStore, useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatTokenAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DirectboxReceive, DirectboxSend } from "iconsax-react-native";
import React from "react";
import { Text, View } from "react-native";

type WalletOverviewProps = NativeStackScreenProps<
  NavigatorParamsList,
  "My wallet"
>;

export default function WalletOverview({ navigation }: WalletOverviewProps) {
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

  return (
    <SafeLayout>
      <Column style={{ alignItems: "center" }}>
        {node === "TestNet" && (
          <View
            style={{
              borderRadius: 50,
              backgroundColor: Colors.warning,
              paddingHorizontal: 20,
              paddingVertical: 8,
            }}
          >
            <Text>TestNet</Text>
          </View>
        )}
        <Headline>PORTFOLIO</Headline>

        {activeAccount ? (
          <>
            <Paragraph style={{ marginBottom: 16 }}>
              {activeAccount.address}
            </Paragraph>
            <Headline>{formatTokenAmount(activeAccount.balance)} SEI</Headline>
            <Paragraph>
              ${formatTokenAmount(activeAccount.usdBalance)}
            </Paragraph>
          </>
        ) : (
          <Loader />
        )}
      </Column>

      <Row
        style={{
          justifyContent: "space-around",
          marginVertical: 30,
        }}
      >
        <SecondaryButton
          title="Receive"
          onPress={onReceive}
          icon={<DirectboxReceive size={20} color="white" />}
        />
        <SecondaryButton
          title="Send"
          onPress={onSend}
          icon={<DirectboxSend size={20} color="white" />}
        />
      </Row>

      <AccountsList />
    </SafeLayout>
  );
}
