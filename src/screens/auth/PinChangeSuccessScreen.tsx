import {
  Column,
  PrimaryButton,
  ResultHeader,
  SafeLayoutBottom,
} from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<NavigatorParamsList, "Pin Change Success">;

export default function PinChangeSuccessScreen({ navigation }: Props) {
  return (
    <SafeLayoutBottom>
      <Column
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ResultHeader
          type="Success"
          header="Passcode changed successfully"
          description="Keep your passcode safe and never share it."
        />
      </Column>
      <PrimaryButton
        title="Done"
        onPress={() => navigation.navigate("Security and privacy")}
      />
    </SafeLayoutBottom>
  );
}
