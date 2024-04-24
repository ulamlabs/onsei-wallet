import { useInputState } from "@/hooks";
import tw from "@/lib/tailwind";
import { Camera } from "expo-camera";
import { Link1 } from "iconsax-react-native";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import Button from "./Button";
import Modal from "./Modal";

export default () => {
  const [initModalOpened, setInitModalOpened] = useState(false);
  const [scannerOpened, setScannerOpened] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const uriInput = useInputState();

  async function onDappConnect(uri: string) {
    // await onConnect(uri); handle connect
    setInitModalOpened(false);
    uriInput.onChangeText("");
  }

  function openScanner() {
    setInitModalOpened(false);
    setScannerOpened(true);
  }

  async function onSuccess(e: any) {
    console.log("HERE");
    console.log(e);
    // await onConnect(e.data); handle connect
    setScannerOpened(false);
  }
  return (
    <>
      <Button
        onPress={() => setInitModalOpened(true)}
        icon={<Link1 size={20} color="white" />}
        styles={tw`rounded-full w-12 h-12 justify-center mb-2 p-0`}
      />

      <Modal
        isVisible={initModalOpened}
        title="Connect with dApp"
        description="Paste uri or scan QR Code"
        buttonTxt="Scan QR"
        onConfirm={() => openScanner()}
        onCancel={() => setInitModalOpened(false)}
      >
        <View
          style={tw`flex-row w-full items-center mb-10 h-10 justify-center`}
        >
          <TextInput
            style={tw`input w-50 mr-2`}
            placeholder="uri"
            {...uriInput}
          />
          <Button onPress={() => onDappConnect} label="->" />
        </View>
      </Modal>
      <Modal
        isVisible={scannerOpened}
        title="Scan QR Code"
        description=""
        buttonTxt="Cancel"
        onConfirm={() => setScannerOpened(false)}
      >
        {!permission?.granted ? (
          <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-center mb-5 text-white`}>
              We need your permission to show the camera
            </Text>
            <Button
              onPress={requestPermission}
              styles={tw`justify-center`}
              label="Grant permission"
            />
          </View>
        ) : (
          <Camera
            style={tw`w-3/4 aspect-square mb-3`}
            flashMode={1}
            onBarCodeScanned={onSuccess}
          />
        )}
      </Modal>
    </>
  );
};
