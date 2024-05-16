import { PIN_LENGTH } from "./const";
import PinDigit from "./PinDigit";
import ShakingView from "../ShakingView";

const digits = Array(PIN_LENGTH).fill(0);

export type PinDigitsProps = {
  pin: string;
  error: boolean;
};

export default function PinDigits({ pin, error }: PinDigitsProps) {
  return (
    <ShakingView
      shaking={!!error}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
      }}
    >
      {digits.map((_, index) => (
        <PinDigit filled={index < pin.length} key={index} error={error} />
      ))}
    </ShakingView>
  );
}
