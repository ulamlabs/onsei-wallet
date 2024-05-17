import { SafeLayout, SecondaryButton } from "@/components";
import { useAccountsStore } from "@/store";
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
    <SafeLayout
      style={{
        justifyContent: "space-between",
        maxHeight: "100%",
        paddingTop: 24,
      }}
      noScroll={true}
    >
      <FlatList
        data={accounts}
        renderItem={({ item }) => <Account item={item} />}
      />

      <View style={{ gap: 12, marginBottom: 0, paddingTop: 24 }}>
        <SecondaryButton
          title="Create new wallet"
          onPress={() => {
            navigation.goBack();
            navigation.navigate("Generate Wallet");
          }}
          icon={Add}
        />
        <SecondaryButton
          title="Import an existing wallet"
          onPress={() => {
            navigation.goBack();
            navigation.navigate("Import Wallet");
          }}
          icon={Import}
        />
      </View>
    </SafeLayout>
  );
}
