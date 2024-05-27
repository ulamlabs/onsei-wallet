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
import { useSettingsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack, trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CloseCircle, ExportSquare, TickCircle } from "iconsax-react-native";
import { useMemo } from "react";
import { Linking, View } from "react-native";

type TransferSentScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "transferSent"
>;

type SummitBoxProps = {
  title: string;
  text: string;
  onPress: () => void;
};

const SummitBox = ({ title, text, onPress }: SummitBoxProps) => (
  <Box style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
    <View style={{ justifyContent: "flex-start" }}>
      <Paragraph>{title}</Paragraph>
      <Text style={{ textAlign: "left", fontFamily: FontWeights.bold }}>
        {text}
      </Text>
    </View>
    <TertiaryButton
      title="View on SeiScan"
      icon={ExportSquare}
      onPress={onPress}
      iconAllign="right"
      textStyle={{ fontSize: FontSizes.sm, fontFamily: FontWeights.bold }}
      iconSize={16}
      style={{ paddingHorizontal: 0, paddingVertical: 0 }}
    />
  </Box>
);

const TransferSentScreen = ({ navigation, route }: TransferSentScreenProps) => {
  const { tx, amount, token } = route.params;
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
          {success ? (
            <TickCircle variant="Bold" color={Colors.success} size={88} />
          ) : (
            <CloseCircle variant="Bold" color={Colors.success} size={88} />
          )}
        </View>
        <Headline>{success ? "It's Done!" : "Something went wrong"}</Headline>
        <Paragraph size="base" style={{ textAlign: "center" }}>
          {success
            ? "Transaction completed successfully."
            : "Click below to see why the transaction failed."}
        </Paragraph>
        <SummitBox
          onPress={handleShowDetails}
          title={success ? "Amount sent" : "Transaction ID"}
          text={
            success
              ? `${amount} ${token?.symbol}`
              : trimAddress(tx.transactionHash)
          }
        />
      </Column>
      <PrimaryButton title="Done" onPress={handleDone} />
    </SafeLayoutBottom>
  );
};

export default TransferSentScreen;
