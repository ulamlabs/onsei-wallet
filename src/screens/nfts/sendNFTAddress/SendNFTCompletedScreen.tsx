import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Column,
  PrimaryButton,
  ResultHeader,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { useSettingsStore } from "@/store";
import { FontSizes, FontWeights } from "@/styles";
import { resetNavigationStack } from "@/utils";
import { ExportSquare } from "iconsax-react-native";
import { useMemo } from "react";
import { Linking, View } from "react-native";
import CardHorizontal from "@/components/CardHorizontal";
import { formatTokenId, getNFTImage, getNFTName } from "../utils";

type SendNFTCompletedScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Send NFT - Completed"
>;

export default function SendNFTCompletedScreen({
  navigation,
  route,
}: SendNFTCompletedScreenProps) {
  const { tx, nft } = route.params;
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
    const url = `https://seitrace.com/tx/${tx.transactionHash}?chain=${network}`;
    Linking.openURL(url);
  };

  return (
    <SafeLayoutBottom>
      <Column
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ResultHeader
          type={success ? "Success" : "Fail"}
          header={success ? "It's Done!" : "Something went wrong"}
          description={
            success
              ? "NFT sent successfully."
              : "Click below to see why the transaction failed."
          }
        />
        <View style={{ marginTop: 16, flex: 0, flexDirection: "row" }}>
          <CardHorizontal
            imageSrc={getNFTImage(nft)}
            title={getNFTName(nft)}
            subtitle={formatTokenId(nft.tokenId)}
          />
        </View>
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
              title="View details on SEITRACE"
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
              title="View details on SEITRACE"
              onPress={handleShowDetails}
            />
            <TertiaryButton onPress={handleDone} title="Done" />
          </>
        )}
      </Column>
    </SafeLayoutBottom>
  );

  // return (
  //   <SafeLayout subScreen>
  //     <View style={{ marginTop: "auto", paddingBottom: insets.bottom }}>
  //       <Text>NFT sent {JSON.stringify(nft, null, 2)}</Text>
  //     </View>
  //   </SafeLayout>
  // );
}
