import {
  Column,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  Text,
} from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import { View } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "Scan QR code">;

export default function ScanAddressScreen({
  navigation,
  route: {
    params: { tokenId },
  },
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(false);

  async function scan(result: BarcodeScanningResult) {
    if (scanned) {
      return;
    }
    if (!isValidSeiCosmosAddress(result.data)) {
      setError(true);
      return;
    }
    navigation.pop();
    navigation.replace("transferSelectAddress", {
      address: result.data,
      tokenId,
    });
    setScanned(true);
  }

  function render() {
    if (!permission) {
      return <></>;
    }

    if (!permission.granted) {
      return (
        <Column>
          <Text style={{ textAlign: "center" }}>
            We need your permission to use the camera
          </Text>
          <PrimaryButton onPress={requestPermission} title="Grant Permission" />
        </Column>
      );
    }

    return (
      <CameraView style={{ flex: 1 }} onBarcodeScanned={scan}>
        <Column
          style={{
            position: "absolute",
            left: "12.5%",
            top: "15%",
            width: "75%",
            gap: 32,
          }}
        >
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderRadius: 22,
              borderColor: error ? Colors.danger : Colors.text,
              aspectRatio: 1,
            }}
          />
          <Paragraph
            style={{
              color: Colors.text,
              fontFamily: FontWeights.bold,
              textAlign: "center",
              fontSize: FontSizes.base,
            }}
          >
            Scan QR code to send funds
          </Paragraph>
          {error && (
            <Paragraph style={{ color: Colors.danger, textAlign: "center" }}>
              It is not valid sei address
            </Paragraph>
          )}
        </Column>
      </CameraView>
    );
  }
  return <SafeLayout>{render()}</SafeLayout>;
}
