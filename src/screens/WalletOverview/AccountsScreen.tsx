import { SafeLayout, SecondaryButton } from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Add, Import } from "iconsax-react-native";
import { FlatList, View } from "react-native";
import Account from "./Account";

type AccountsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Wallets"
>;

export default function AccountsScreen({ navigation }: AccountsScreenProps) {
  const { accounts } = useAccountsStore();

  return (
    <SafeLayout staticView={true} subScreen>
      <View style={{ flex: 1 }}>
        <FlatList
          data={accounts}
          renderItem={({ item }) => <Account item={item} />}
        />
      </View>

      <View
        style={{
          gap: 12,
          paddingTop: 12,
          paddingBottom: 16,
          backgroundColor: Colors.background,
        }}
      >
        <SecondaryButton
          title="Create new wallet"
          style={{ backgroundColor: Colors.background }}
          onPress={() => {
            navigation.navigate("Set Name", { nextRoute: "Generate Wallet" });
          }}
          icon={Add}
        />
        <SecondaryButton
          title="Import an existing wallet"
          style={{ backgroundColor: Colors.background }}
          onPress={() => {
            navigation.navigate("Set Name", { nextRoute: "Import Wallet" });
          }}
          icon={Import}
        />
      </View>
    </SafeLayout>
  );
}
