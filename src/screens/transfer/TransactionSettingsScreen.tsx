import {
  Column,
  FeeBox,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

type TransactionSettingscreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transaction settings"
>;

export default function TransactionSettingscreen({
  navigation,
  route: {
    params: { tokenId },
  },
}: TransactionSettingscreenProps) {
  return (
    <SafeLayout>
      <Column style={{ minHeight: "100%", justifyContent: "space-between" }}>
        <Column style={{ gap: 32 }}>
          <View>
            <Headline size="base" style={{ textAlign: "left" }}>
              Transaction fee
            </Headline>
            <Paragraph>
              The blockchain network charges the fee, and increasing it speeds
              up your transaction. Our wallet is free to use.
            </Paragraph>
            <Column style={{ marginTop: 16 }}>
              <FeeBox title="Low" tokenId={tokenId} />
            </Column>
          </View>
          <View>
            <Headline size="base" style={{ textAlign: "left" }}>
              Gas limit
            </Headline>
            <Paragraph>
              Setting a gas limit ensures that your transaction fee won't exceed
              this amount.
            </Paragraph>
          </View>
        </Column>
        <PrimaryButton
          title="Save settings"
          onPress={() => navigation.goBack()}
        />
      </Column>
    </SafeLayout>
  );
}
