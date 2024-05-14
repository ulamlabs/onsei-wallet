import { Account as AccountType, useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Setting2 } from "iconsax-react-native";
import { TouchableOpacity, View } from "react-native";
import { Headline, Paragraph } from "../../components/typography";

export type AccountProps = {
  item: AccountType;
};

export default function Account({ item }: AccountProps) {
  const { activeAccount, setActiveAccount } = useAccountsStore();
  const navigation = useNavigation<NavigationProp>();
  const isActive = item.address === activeAccount?.address;
  const selectAccount = (address: string) => {
    setActiveAccount(address);
    navigation.goBack();
  };

  return (
    <TouchableOpacity
      style={{
        marginTop: 10,
        backgroundColor: isActive ? Colors.text : Colors.background300,
        paddingHorizontal: 22,
        paddingVertical: 16,
        borderRadius: 22,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => selectAccount(item.address)}
    >
      <View>
        <Headline
          style={{
            color: isActive ? Colors.background : Colors.text,
            textAlign: "left",
          }}
          size="base"
        >
          {item.name}
        </Headline>
        <Paragraph style={{ color: isActive ? "#575757" : Colors.text100 }}>
          {item.balance} SEI
        </Paragraph>
      </View>
      <TouchableOpacity
        style={{
          width: 38,
          height: 38,
          padding: 8,
          backgroundColor: isActive
            ? Colors.background500
            : Colors.background200,
          borderRadius: 14,
        }}
        onPress={() =>
          navigation.navigate("Account settings", { address: item.address })
        }
      >
        <Setting2 color={isActive ? Colors.background : Colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
