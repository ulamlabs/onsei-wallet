import {
  Column,
  CopyButton,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  ToggleButton,
} from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type Props = NativeStackScreenProps<NavigatorParamsList, "Your SEI address">;

export default function ReceiveAssets({ navigation }: Props) {
  const { activeAccount } = useAccountsStore();
  const [selectedNetwork, setSelectedNetwork] = useState<"sei" | "evm">("sei");

  const activeAddress = useMemo(() => {
    return selectedNetwork === "sei"
      ? activeAccount!.address
      : activeAccount!.evmAddress;
  }, [selectedNetwork]);

  return (
    <SafeLayout>
      <Column
        style={{ gap: 0, justifyContent: "space-between", height: "100%" }}
      >
        <View style={{ alignItems: "center", marginTop: 28 }}>
          <Headline>Scan SEI address</Headline>
          <Paragraph size="base">
            Use this address to receive tokens on SEI
          </Paragraph>
          {activeAccount?.evmAddress && (
            <ToggleButton
              onPress={setSelectedNetwork}
              selectedValue={selectedNetwork}
              options={[
                { label: "SEI address", value: "sei" },
                { label: "EVM address", value: "evm" },
              ]}
            />
          )}
          <View
            style={{
              padding: 12,
              marginTop: 60,
              marginBottom: 20,
              backgroundColor: Colors.text,
              borderRadius: 23,
            }}
          >
            <QRCode value={activeAddress} size={220} />
          </View>

          <CopyButton
            title={trimAddress(activeAddress)}
            toCopy={activeAddress}
          />
        </View>
        <View>
          <PrimaryButton title="Done" onPress={() => navigation.goBack()} />
        </View>
      </Column>
    </SafeLayout>
  );
}
