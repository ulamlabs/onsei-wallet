import { Animated, View, Text } from "react-native";
import tw from "@/lib/tailwind";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components";

export default function AddWallet() {
  const navigation = useNavigation<NavigationProp>();

  function onCreateNew() {
    navigation.push("Generate Wallet");
  }
  function onImport() {
    navigation.push("Import Wallet");
  }

  return (
    <View style={tw`items-center`}>
      <Animated.View style={{ alignItems: "center" }}>
        <Button label="Create new Account" onPress={onCreateNew} />
        <Text style={tw`my-10 text-white font-bold text-lg`}>OR</Text>
        <Button label="Import existing Account" onPress={onImport} />
      </Animated.View>
    </View>
  );
}
