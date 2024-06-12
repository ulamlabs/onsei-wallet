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
import { useState } from "react";
import { View } from "react-native";

type TransactionSettingscreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transaction settings"
>;

const gasPrices: { speed: "Low" | "Medium" | "High"; multiplier: number }[] = [
  { speed: "Low", multiplier: 1 },
  { speed: "Medium", multiplier: 1.2 },
  { speed: "High", multiplier: 1.3 },
];

function FeeBoxList({
  gas,
  selectedSpeed,
  selectSpeed,
}: {
  selectedSpeed: "Low" | "Medium" | "High";
  selectSpeed: (speed: "Low" | "Medium" | "High") => void;
  gas?: number;
}) {
  return gasPrices.map((option) => (
    <FeeBox
      gasPrices={gasPrices}
      key={option.speed.toLowerCase()}
      title={option.speed as "Low" | "Medium" | "High"}
      gas={gas}
      selected={selectedSpeed === option.speed}
      onPress={() => selectSpeed(option.speed as "Low" | "Medium" | "High")}
    />
  ));
}

export default function TransactionSettingscreen({
  navigation,
  route: { params },
}: TransactionSettingscreenProps) {
  const {
    settings: { selectedGasPrice },
    setSetting,
  } = useSettingsStore();
  const [selectedSpeed, setSelectedSpeed] = useState(selectedGasPrice.speed);

  const saveSettings = () => {
    setSetting(
      "selectedGasPrice",
      gasPrices.find((gp) => gp.speed === selectedSpeed)!,
    );
    navigation.goBack();
  };

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
            <FeeBoxList
              gas={params?.gas}
              selectedSpeed={selectedSpeed}
              selectSpeed={setSelectedSpeed}
            />
          </Column>
        </View>
        <PrimaryButton title="Save settings" onPress={saveSettings} />
      </Column>
    </SafeLayout>
  );
}
