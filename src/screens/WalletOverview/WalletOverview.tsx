import {
  Column,
  Headline,
  Loader,
  Paragraph,
  Row,
  SafeLayout,
  SecondaryButton,
} from "@/components";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatTokenAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowDown2,
  Copy,
  DirectboxReceive,
  DirectboxSend,
  Scan,
  Setting2,
} from "iconsax-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TokensList } from "../account";

type WalletOverviewProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Wallet"
>;

export default function WalletOverview({ navigation }: WalletOverviewProps) {
  const { activeAccount } = useAccountsStore();
  const { sei } = useTokensStore();
  const {
    settings: { node },
  } = useSettingsStore();

  function onReceive() {
    navigation.push("Receive");
  }
  function onSend() {
    navigation.push("Send", {});
  }

  function openSettings() {
    navigation.push("Settings");
  }

  function onScan() {
    navigation.push("ScanModal");
  }

  return (
    <SafeLayout>
      <Column style={{ alignItems: "center" }}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <TouchableOpacity onPress={openSettings}>
            <Setting2 size={22} color={Colors.text100} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push("AccountsModal")}
            style={{ flexDirection: "row", gap: 4 }}
          >
            <Paragraph
              style={{
                color: Colors.text,
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {activeAccount?.name}
            </Paragraph>
            <ArrowDown2 color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Copy size={22} color={Colors.text100} />
          </TouchableOpacity>
        </View>
        {node === "TestNet" && (
          <View
            style={{
              borderRadius: 50,
              backgroundColor: Colors.warning,
              paddingHorizontal: 20,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12 }}>TestNet</Text>
          </View>
        )}

        {activeAccount ? (
          <>
            <Paragraph style={{ marginBottom: 16 }}>
              {activeAccount.address}
            </Paragraph>
            <Headline>
              {formatTokenAmount(sei.balance, sei.decimals)} SEI
            </Headline>
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
          icon={DirectboxReceive}
        />
        <SecondaryButton title="Send" onPress={onSend} icon={DirectboxSend} />
        <SecondaryButton title="Scan" onPress={onScan} icon={Scan} />
      </Row>
      <TokensList />
    </SafeLayout>
  );
}
