import {
  Box,
  Column,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
  Text,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { CosmToken } from "@/services/cosmos";
import { useSettingsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ExportSquare, TickCircle } from "iconsax-react-native";
import { useMemo } from "react";
import { Linking, View } from "react-native";

type TransferSentScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSent"
>;

type SummitBoxType = {
  txResponse: DeliverTxResponse;
  amount?: string;
  token?: CosmToken;
};

function SummitBox({ txResponse, amount, token }: SummitBoxType) {
  const {
    settings: { node },
  } = useSettingsStore();

  function showDetails() {
    const network = NETWORK_NAMES[node];
    const url = `https://www.seiscan.app/${network}/txs/${txResponse.transactionHash}`;
    Linking.openURL(url);
  }

  return (
    <Box style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
      <View style={{ justifyContent: "flex-start" }}>
        <Paragraph>Amount sent</Paragraph>
        <Text style={{ textAlign: "left", fontFamily: FontWeights.bold }}>
          {amount} {token?.symbol}
        </Text>
      </View>
      <TertiaryButton
        title="View on SeiScan"
        icon={ExportSquare}
        onPress={showDetails}
        iconAllign="right"
        textStyle={{ fontSize: FontSizes.sm, fontFamily: FontWeights.bold }}
        iconSize={16}
        style={{ paddingHorizontal: 0, paddingVertical: 0 }}
      />
    </Box>
  );
}

export default function TransferSentScreen({
  navigation,
  route,
}: TransferSentScreenProps) {
  const { tx, amount, token } = route.params;

  const success = useMemo(() => tx.code === 0, [tx]);

  function done() {
    navigation.navigate("Home");
    resetNavigationStack(navigation);
  }

  return (
    <SafeLayoutBottom>
      <Column
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {success ? (
          <>
            <View
              style={{
                padding: 20,
                width: 128,
                height: 128,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 22,
                backgroundColor: Colors.success100,
              }}
            >
              <TickCircle variant="Bold" color={Colors.success} size={88} />
            </View>
            <Headline>It's Done!</Headline>
            <Paragraph size="base" style={{ textAlign: "center" }}>
              Transaction completed successfully
            </Paragraph>
            <SummitBox txResponse={tx} amount={amount} token={token} />
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
      </Column>

      <PrimaryButton title="Done" onPress={done} />
    </SafeLayoutBottom>
  );
}
