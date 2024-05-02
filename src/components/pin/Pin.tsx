import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { PIN_LENGTH, SHAKE_ANIMATION_DURATION } from "./const";
import PinDigits from "./PinDigits";
import PinKeyboard from "./PinKeyboard";
import tw from "@/lib/tailwind";
import * as Crypto from "expo-crypto";

export type PinProps = {
  label: string;
  compareToHash?: string;
  onPinHash: (pinHash: string) => void;
  onFail?: () => void;
};

function hashPin(pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export default function Pin({
  label,
  compareToHash,
  onPinHash,
  onFail,
}: PinProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [errorDelay, setErrorDelay] = useState(false);

  useEffect(() => {
    if (errorDelay) {
      setErrorDelay(false);
    } else {
      setError(false);
    }

    if (pin.length !== PIN_LENGTH) {
      return;
    }

    validatePin();
  }, [pin]);

  async function validatePin() {
    const pinHash = await hashPin(pin);

    if (!compareToHash || pinHash === compareToHash) {
      setPin(""); // remove the pin from memory in case the component is cached somewhere
      onPinHash(pinHash);
      return;
    }

    if (onFail) {
      onFail();
    }
    setError(true);
    setErrorDelay(true);
    setTimeout(() => {
      setPin("");
    }, SHAKE_ANIMATION_DURATION);
  }

  function onDigit(digit: string) {
    if (pin.length < PIN_LENGTH) {
      setPin(pin + digit);
    }
  }

  function onDelete() {
    setPin(pin.substring(0, pin.length - 1));
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: tw.color("background"),
      }}
    >
      <Text style={{ fontSize: 30, flex: 1, marginTop: 40, color: "white" }}>
        {label}
      </Text>

      <View style={{ flex: 1, alignItems: "center" }}>
        <PinDigits pin={pin} error={errorDelay} />
        {error && (
          <Text style={{ color: tw.color("danger-400"), marginTop: 20 }}>
            PIN code did not match. Try again.
          </Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <PinKeyboard onDelete={onDelete} onDigit={onDigit} />
      </View>
    </View>
  );
}
