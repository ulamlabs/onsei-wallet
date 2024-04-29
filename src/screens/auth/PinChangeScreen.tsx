import { Pin, PinWithTimeout } from "@/components";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";

type ChangePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Change PIN"
>;

export default function PinChangeScreen({ navigation }: ChangePinScreenProps) {
  const [authorized, setAuthorized] = useState(false);
  const [newPinHash, setNewPinHash] = useState("");

  const authStore = useAuthStore();

  const oldPinHash = useRef(authStore.getPinHash());

  if (!oldPinHash.current) {
    navigation.goBack();
    return <></>;
  }

  function saveNewPin(pinHash: string) {
    authStore.setPinHash(pinHash);
    navigation.navigate("Security");
  }

  if (!authorized) {
    return (
      <PinWithTimeout
        label="Enter your old PIN"
        compareToHash={oldPinHash.current}
        onPinHash={() => setAuthorized(true)}
        key="old"
      />
    );
  }

  return (
    <>
      {!newPinHash ? (
        <Pin label="Enter your new PIN" onPinHash={setNewPinHash} key="new" />
      ) : (
        <Pin
          label="Confirm your new PIN"
          compareToHash={newPinHash}
          onPinHash={saveNewPin}
          key="confirm"
        />
      )}
    </>
  );
}
