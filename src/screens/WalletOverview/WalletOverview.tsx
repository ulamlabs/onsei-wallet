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
  Setting2,
} from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AccountsModal from "./AccountsModal";

type WalletOverviewProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Wallet"
>;

export default function WalletOverview({ navigation }: WalletOverviewProps) {
  const { activeAccount } = useAccountsStore();
  const [open, setOpen] = useState(false);
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

  function openAccounts() {
    setOpen(true);
  }

  function closeAccounts() {
    setOpen(false);
  }

  return (
    <SafeLayout style={{ paddingTop: 24 }}>
      <Column style={{ alignItems: "center" }}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={openSettings}>
            <Setting2 size={22} color={Colors.text100} />
          </TouchableOpacity>
          <AccountsModal onBackdropPress={closeAccounts} open={open}>
            <TouchableOpacity
              onPress={openAccounts}
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
          </AccountsModal>
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
      </Row>
    </SafeLayout>
  );
}
