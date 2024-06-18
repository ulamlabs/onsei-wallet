import {
  Column,
  FeeBox,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { FeeTier } from "@/components/FeeBox";
import { useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";

type TransactionSettingscreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transaction settings"
>;

type FeeBoxListProps = {
  selectedSpeed: FeeTier;
  selectSpeed: (speed: FeeTier) => void;
  gas?: number;
};

const gasPrices: FeeTier[] = ["Low", "Medium", "High"];

function FeeBoxList({ gas, selectedSpeed, selectSpeed }: FeeBoxListProps) {
  return (
    <>
      {gasPrices.map((option) => (
        <FeeBox
          key={option.toLowerCase()}
          title={option}
          gas={gas}
          selected={selectedSpeed === option}
          onPress={() => selectSpeed(option)}
        />
      ))}
    </>
  );
}

export default function TransactionSettingscreen({
  navigation,
  route: { params },
}: TransactionSettingscreenProps) {
  const {
    settings: { localGasPrice, globalGasPrice },
    setSetting,
  } = useSettingsStore();
  const [selectedSpeed, setSelectedSpeed] = useState(
    params.global ? globalGasPrice : localGasPrice,
  );

  function saveSettings() {
    setSetting(
      params.global ? "globalGasPrice" : "localGasPrice",
      selectedSpeed,
    );
    navigation.goBack();
  }

  return (
    <SafeLayout>
      <Column style={{ minHeight: "100%", justifyContent: "space-between" }}>
        <View>
          <Headline size="base" style={{ textAlign: "left" }}>
            Transaction fee
          </Headline>
          <Paragraph>
            The blockchain network charges the fee, and increasing it boosts the
            transaction priority. Our wallet is free to use.
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
