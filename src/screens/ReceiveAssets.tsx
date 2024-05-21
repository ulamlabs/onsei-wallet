import {
  Column,
  CopyButton,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type Props = NativeStackScreenProps<NavigatorParamsList, "Your SEI address">;

export default function ReceiveAssets({ navigation }: Props) {
  const { activeAccount } = useAccountsStore();

  return (
    <SafeLayout>
      <Column
        style={{ gap: 0, justifyContent: "space-between", height: "100%" }}
      >
        <View style={{ alignItems: "center" }}>
          <Headline>Scan SEI address</Headline>
          <Paragraph size="base">
            Use this address to receive tokens on SEI
          </Paragraph>
          <View
            style={{
              padding: 12,
              marginTop: 60,
              marginBottom: 20,
              backgroundColor: Colors.text,
              borderRadius: 23,
            }}
          >
            <QRCode value={activeAccount!.address} size={220} />
          </View>

          <CopyButton
            title={trimAddress(activeAccount!.address)}
            toCopy={activeAccount!.address}
          />
        </View>
        <View>
          <PrimaryButton title="Done" onPress={() => navigation.goBack()} />
        </View>
      </Column>
    </SafeLayout>
  );
}
