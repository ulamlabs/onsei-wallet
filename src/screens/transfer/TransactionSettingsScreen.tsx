import {
  Column,
  FeeBox,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { useFeeStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

type TransactionSettingscreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transaction settings"
>;

function FeeBoxList({ tokenId }: { tokenId: string }) {
  const { selectedGasPrice, gasPrices } = useFeeStore();

  return gasPrices.map((option) => (
    <FeeBox
      key={option.speed.toLowerCase()}
      title={option.speed}
      tokenId={tokenId}
      selected={selectedGasPrice.speed === option.speed}
    />
  ));
}

export default function TransactionSettingscreen({
  navigation,
  route: {
    params: { tokenId },
  },
}: TransactionSettingscreenProps) {
  return (
    <SafeLayout>
      <Column style={{ minHeight: "100%", justifyContent: "space-between" }}>
        <View>
          <Headline size="base" style={{ textAlign: "left" }}>
            Transaction fee
          </Headline>
          <Paragraph>
            The blockchain network charges the fee, and increasing it speeds up
            your transaction. Our wallet is free to use.
          </Paragraph>
          <Column style={{ marginTop: 16, gap: 10 }}>
            <FeeBoxList tokenId={tokenId} />
          </Column>
        </View>
        <PrimaryButton
          title="Save settings"
          onPress={() => navigation.goBack()}
        />
      </Column>
    </SafeLayout>
  );
}
