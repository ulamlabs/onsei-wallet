import tw from "@/lib/tailwind";
import { Text, View } from "react-native";
import Timer from "./Timer";

export type AuthorizationTimeoutProps = {
  timeout: number;
};

export default ({ timeout }: AuthorizationTimeoutProps) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        backgroundColor: tw.color("background"),
      }}
    >
      <Text style={{ color: "white", fontSize: 32 }}>Wallet is locked</Text>
      <Text style={{ color: "white" }}>Too many PIN attemps</Text>

      <View style={{ gap: 5, alignItems: "center" }}>
        <Text style={{ color: "white" }}>Try again in</Text>
        <Timer seconds={timeout} />
      </View>
    </View>
  );
};
