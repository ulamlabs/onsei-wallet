import { Colors } from "@/styles";
import { useMemo } from "react";
import { Text } from "react-native";

export type TimerProps = {
  seconds: number;
};

function padLeft(value: number) {
  return value.toString().padStart(2, "0");
}

export default function Timer({ seconds: totalSeconds }: TimerProps) {
  const timeFormatted = useMemo(() => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds % 60;

    let formatted = `${padLeft(minutes)}:${padLeft(seconds)}`;
    if (hours) {
      formatted = `${padLeft(hours)}:${formatted}`;
    }
    return formatted;
  }, [totalSeconds]);

  return (
    <Text
      style={{
        color: Colors.text,
        fontSize: 30,
        fontWeight: "bold",
      }}
    >
      {timeFormatted}
    </Text>
  );
}
