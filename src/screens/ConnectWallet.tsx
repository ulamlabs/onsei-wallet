import {
  Column,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  Text,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { useSettingsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { onConnect } from "@/web3wallet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { View } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "Connect Wallet">;

export default function ConnectWalletScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const {
    settings: { node },
  } = useSettingsStore();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState("");
  const uriInput = useInputState();

  async function scan(uri: string) {
    if (scanned) {
      return;
    }
    setScanned(true);
    try {
      await onConnect(uri);
      navigation.goBack();
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
      setScanned(false);
    }
  }

  function renderCamera() {
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
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={(result) => scan(result.data)}
      >
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
            Scan QR code to connect with dApp
          </Paragraph>
          {error && (
            <Paragraph style={{ color: Colors.danger, textAlign: "center" }}>
              {error}
            </Paragraph>
          )}
        </Column>
      </CameraView>
    );
  }

  if (node === "TestNet") {
    return (
      <SafeLayout>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: FontSizes.lg }}>
            This feature is not available on TestNet
          </Text>
        </View>
      </SafeLayout>
    );
  }

  return (
    <SafeLayout>
      {renderCamera()}
      <View>
        <TextInput
          style={{ marginVertical: 24 }}
          placeholder="Or paste uri manually"
          {...uriInput}
        />
        <PrimaryButton title="Connect" onPress={() => scan(uriInput.value)} />
      </View>
    </SafeLayout>
  );
}
