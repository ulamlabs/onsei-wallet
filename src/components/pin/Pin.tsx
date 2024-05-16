import { useEffect, useState } from "react";
import { View } from "react-native";
import { PIN_LENGTH } from "./const";
import PinDigits from "./PinDigits";
import { NumericPad } from "../numericPad";
import * as Crypto from "expo-crypto";
import { Colors } from "@/styles";
import { Headline, Paragraph, Text } from "../typography";
import { SHAKE_ANIMATION_DURATION } from "../ShakingView";

export type PinProps = {
  label: string;
  description?: string;
  extraInfo?: string;
  compareToHash?: string;
  onPinHash: (pinHash: string) => void;
  onFail?: () => void;
};

function hashPin(pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export default function Pin({
  label,
  description,
  extraInfo,
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
    }, SHAKE_ANIMATION_DURATION * 2);
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
        justifyContent: "space-between",
        backgroundColor: Colors.background,
      }}
    >
      <View>
        <Headline style={{ marginTop: 40 }}>{label}</Headline>
        <Paragraph style={{ textAlign: "center" }}>{description}</Paragraph>
      </View>

      <View style={{ alignItems: "center", minHeight: 70 }}>
        <PinDigits pin={pin} error={errorDelay} />
        {error && (
          <Text style={{ color: Colors.danger, marginTop: 20 }}>
            Passcode did not match. Try again.
          </Text>
        )}
      </View>

      <Text style={{ fontWeight: "bold" }}>{extraInfo}</Text>

      <View style={{ marginBottom: 20 }}>
        <NumericPad onDelete={onDelete} onDigit={onDigit} />
      </View>
    </View>
  );
}
