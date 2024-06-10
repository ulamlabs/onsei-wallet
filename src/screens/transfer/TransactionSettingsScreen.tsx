import {
  Column,
  FeeBox,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

type TransactionSettingscreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transaction settings"
>;

function FeeBoxList({ gas }: { gas: number }) {
  const {
    settings: { selectedGasPrice },
  } = useSettingsStore();
  const gasPrices: { speed: "Low" | "Medium" | "High"; multiplier: number }[] =
    [
      { speed: "Low", multiplier: 1 },
      { speed: "Medium", multiplier: 1.2 },
      { speed: "High", multiplier: 1.3 },
    ];

  return gasPrices.map((option) => (
    <FeeBox
      gasPrices={gasPrices}
      key={option.speed.toLowerCase()}
      title={option.speed as "Low" | "Medium" | "High"}
      gas={gas}
      selected={selectedGasPrice.speed === option.speed}
    />
  ));
}

export default function TransactionSettingscreen({
  navigation,
  route: {
    params: { gas },
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
            <FeeBoxList gas={gas} />
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
