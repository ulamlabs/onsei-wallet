import { SafeLayout, SecondaryButton } from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { scale, verticalScale } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Add, Import } from "iconsax-react-native";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Account from "./Account";

type AccountsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Wallets"
>;

export default function AccountsScreen({ navigation }: AccountsScreenProps) {
  const { accounts } = useAccountsStore();
  const insets = useSafeAreaInsets();

  return (
    <SafeLayout
      style={{
        justifyContent: "space-between",
        maxHeight: "100%",
        paddingTop: 24,
      }}
      staticView={true}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={accounts}
          renderItem={({ item }) => <Account item={item} />}
          ListFooterComponent={<View style={{ height: 148 }} />}
        />
      </View>

      <View
        style={{
          gap: 12,
          position: "absolute",
          bottom: Math.max(verticalScale(50), insets.bottom),
          width: "100%",
          left: Math.max(scale(16), insets.left),
          paddingTop: 50,
        }}
      >
        <LinearGradient
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          colors={["transparent", Colors.background]}
        />
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
