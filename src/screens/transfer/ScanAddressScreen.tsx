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
    params: { nextRoute, tokenId },
  },
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  async function scann(result: BarcodeScanningResult) {
    if (scanned) {
      return;
    }
    navigation.pop();
    navigation.replace(nextRoute, { address: result.data, tokenId });
    setScanned(true);
  }

  function render() {
    if (!permission) {
      // Camera permissions are still loading.
      return <></>;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <Column>
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <PrimaryButton onPress={requestPermission} title="grant permission" />
        </Column>
      );
    }

    return (
      <CameraView style={{ flex: 1 }} onBarcodeScanned={scann}>
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
              borderColor: Colors.text,
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
        </Column>
      </CameraView>
    );
  }
  return <SafeLayout>{render()}</SafeLayout>;
}
