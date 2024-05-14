import { SafeLayout, SecondaryButton } from "@/components";
import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Add, Import } from "iconsax-react-native";
import { FlatList, View } from "react-native";
import Account, { AccountProps } from "./Account";

type AccountsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Accounts"
>;

export default function AccountsScreen({ navigation }: AccountsScreenProps) {
  const { accounts } = useAccountsStore();

  const renderAccounts = ({ item }: AccountProps) => {
    return <Account item={item} />;
  };

  return (
    <SafeLayout style={{ justifyContent: "space-between" }} noScroll={true}>
      <View>
        <FlatList data={accounts} renderItem={renderAccounts} />
      </View>
      <View style={{ gap: 12, marginBottom: 0 }}>
        <SecondaryButton
          title="Create new wallet"
          onPress={() => {
            navigation.goBack();
            navigation.navigate("Add Wallet");
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
