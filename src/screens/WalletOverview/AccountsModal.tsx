import { Paragraph, SafeLayout, SecondaryButton } from "@/components";
import { Account, useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import D from "decimal.js";
import { Add, Import, Setting2 } from "iconsax-react-native";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";

type AccountsModalProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Accounts"
>;

type AccountsRenderProps = {
  item: Account;
  index: number;
};

export default function AccountsModal({ navigation }: AccountsModalProps) {
  const { width: screenWidth } = Dimensions.get("screen");
  const { accounts, activeAccount, setActiveAccount } = useAccountsStore();
  const calculateTotalAmount = () => {
    return accounts
      .reduce((totalBalance, account) => {
        return new D(totalBalance).add(new D(account.balance));
      }, new D(0))
      .toString();
  };

  const renderAccounts = ({ item }: AccountsRenderProps) => {
    const isActive = item.address === activeAccount?.address;
    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: isActive ? Colors.text : Colors.background200,
          paddingHorizontal: 22,
          paddingVertical: 16,
          borderRadius: 22,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => setActiveAccount(item.address)}
      >
        <View>
          <Paragraph
            style={{
              color: isActive ? Colors.background : Colors.text,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {item.name}
          </Paragraph>
          <Paragraph
            style={{ color: isActive ? Colors.text300 : Colors.text100 }}
          >
            {item.balance} SEI
          </Paragraph>
        </View>
        <TouchableOpacity
          style={{
            width: 38,
            height: 38,
            padding: 8,
            backgroundColor: isActive
              ? Colors.background400
              : Colors.background100,
            borderRadius: 14,
          }}
          onPress={() =>
            navigation.push("Account settings", { address: item.address })
          }
        >
          <Setting2 color={isActive ? Colors.background : Colors.text} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeLayout
      style={{ paddingTop: 0, justifyContent: "space-between" }}
      noScroll={true}
    >
      <View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            backgroundColor: Colors.background200,
            height: 70,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginLeft: -10,
            width: screenWidth,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ flexDirection: "row", gap: 24 }}
          >
            <Add
              style={{ transform: [{ rotateZ: "45deg" }] }}
              color={Colors.text}
              size={24}
            />
            <Paragraph
              style={{ color: Colors.text, fontSize: 18, fontWeight: "700" }}
            >
              Accounts
            </Paragraph>
          </TouchableOpacity>
          <Paragraph style={{ color: Colors.text }}>
            Total: {calculateTotalAmount()} SEI
          </Paragraph>
        </View>
        <View style={{ paddingTop: 14 }}>
          <FlatList data={accounts} renderItem={renderAccounts} />
        </View>
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
