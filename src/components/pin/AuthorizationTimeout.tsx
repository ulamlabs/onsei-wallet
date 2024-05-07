import { View } from "react-native";
import Timer from "./Timer";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import { Colors } from "@/styles";
import { PrimaryButton } from "../buttons";
import { Headline, Text } from "../typography";
import { Column } from "../layout";

export type AuthorizationTimeoutProps = {
  timeout: number;
};

export default function AuthorizationTimeout({
  timeout,
}: AuthorizationTimeoutProps) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: Colors.background,
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
        <Headline>Wallet is locked</Headline>
        <Text>Too many passcode attemps</Text>

        <Column style={{ alignItems: "center" }}>
          <Text>Try again in</Text>
          <Timer seconds={timeout} />
        </Column>
      </View>

      <PrimaryButton
        title="Clear app data"
        onPress={() => navigation.navigate("Clear app data")}
      />
    </View>
  );
}
