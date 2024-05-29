import {
  Column,
  Option,
  OptionGroup,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
  Text,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { useSettingsStore } from "@/store";
import { FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack, trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ExportSquare } from "iconsax-react-native";
import { useMemo } from "react";
import { Linking } from "react-native";
import TransactionResultHeader from "./TransactionResultHeader";

type TransferSentScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSent"
>;

export default function TransferSentScreen({
  navigation,
  route,
}: TransferSentScreenProps) {
  const { tx, amount, symbol } = route.params;
  const success = useMemo(() => tx.code === 0, [tx]);
  const {
    settings: { node },
  } = useSettingsStore();

  const handleDone = () => {
    navigation.navigate("Home");
    resetNavigationStack(navigation);
  };

  const handleShowDetails = () => {
    const network = NETWORK_NAMES[node];
    const url = `https://www.seiscan.app/${network}/txs/${tx.transactionHash}`;
    Linking.openURL(url);
  };

  return (
    <SafeLayoutBottom>
      <Column
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <TransactionResultHeader success={success} />
        <OptionGroup>
          <Option label={success ? "Amount sent" : "Transaction ID"}>
            <Text style={{ fontFamily: FontWeights.bold }}>
              {success
                ? `${amount} ${symbol}`
                : trimAddress(tx.transactionHash)}
            </Text>
          </Option>
        </OptionGroup>
      </Column>
      <Column style={{ gap: 20 }}>
        {success ? (
          <>
            <PrimaryButton title="Done" onPress={handleDone} />
            <TertiaryButton
              onPress={handleShowDetails}
              textStyle={{
                fontSize: FontSizes.sm,
                fontFamily: FontWeights.bold,
              }}
              iconSize={16}
              title="View details on SeiScan"
              icon={ExportSquare}
            />
          </>
        ) : (
          <>
            <PrimaryButton
              textStyle={{
                fontSize: FontSizes.sm,
                fontFamily: FontWeights.bold,
              }}
              iconSize={16}
              icon={ExportSquare}
              title="View details on SeiScan"
              onPress={handleShowDetails}
            />
            <TertiaryButton onPress={handleDone} title="Close" />
          </>
        )}
      </Column>
    </SafeLayoutBottom>
  );
}
