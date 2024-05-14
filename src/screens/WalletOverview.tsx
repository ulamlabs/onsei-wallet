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
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { formatTokenAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DirectboxReceive, DirectboxSend } from "iconsax-react-native";
import { Text, View } from "react-native";
import { TokensList } from "./account";

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

      <AccountsList />

      <TokensList />
    </SafeLayout>
  );
}
