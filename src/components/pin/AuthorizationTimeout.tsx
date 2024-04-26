import tw from "@/lib/tailwind";
import { Text, View } from "react-native";
import Timer from "./Timer";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import Button from "../Button";

export type AuthorizationTimeoutProps = {
  timeout: number;
};

export default ({ timeout }: AuthorizationTimeoutProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: tw.color("background"),
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        <Text style={{ color: "white", fontSize: 32 }}>Wallet is locked</Text>
        <Text style={{ color: "white" }}>Too many PIN attemps</Text>

        <View style={{ gap: 5, alignItems: "center" }}>
          <Text style={{ color: "white" }}>Try again in</Text>
          <Timer seconds={timeout} />
        </View>
      </View>

      <Button
        label="Clear app data"
        onPress={() => navigation.navigate("Clear app data")}
        styles={{ justifyContent: "center" }}
      />
    </View>
  );
};
