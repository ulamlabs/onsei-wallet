import {
  Column,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ExportSquare } from "iconsax-react-native";
import { useMemo } from "react";
import { Linking } from "react-native";

type TransferSentScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSent"
>;

export default function TransferSentScreen({
  navigation,
  route,
}: TransferSentScreenProps) {
  const { tx } = route.params;

  const success = useMemo(() => tx.code === 0, [tx]);

  const {
    settings: { node },
  } = useSettingsStore();

  function showDetails() {
    const network = NETWORK_NAMES[node];
    const url = `https://www.seiscan.app/${network}/txs/${tx.transactionHash}`;
    Linking.openURL(url);
  }

  function done() {
    navigation.navigate("Home");
    resetNavigationStack(navigation);
  }

  return (
    <SafeLayoutBottom>
      <Column style={{ flex: 1, justifyContent: "center" }}>
        {success ? (
          <>
            <Headline>Sent!</Headline>
            <Paragraph style={{ textAlign: "center" }}>
              Transaction completed successfully
            </Paragraph>
          </>
        ) : (
          <>
            <Headline style={{ color: Colors.danger }}>Failed!</Headline>
            <Paragraph style={{ textAlign: "center" }}>
              Transaction failed to execute
            </Paragraph>
            <Paragraph style={{ textAlign: "center" }}>{tx.rawLog}</Paragraph>
          </>
        )}
        <TertiaryButton
          title="View details"
          icon={ExportSquare}
          onPress={showDetails}
        />
      </Column>

      <PrimaryButton title="Done" onPress={done} />
    </SafeLayoutBottom>
  );
}
