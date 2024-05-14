import { CopyAddress, Paragraph } from "@/components";
import { Account } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { ArrowDown2, Setting2 } from "iconsax-react-native";
import { TouchableOpacity, View } from "react-native";

type Props = {
  activeAccount: Account;
};

export default function DashboardTopBar({ activeAccount }: Props) {
  const navigation = useNavigation<NavigationProp>();

  function openSettings() {
    navigation.push("Settings");
  }
  return (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        marginBottom: 32,
        zIndex: 1,
      }}
    >
      <TouchableOpacity onPress={openSettings}>
        <Setting2 size={22} color={Colors.text100} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.push("Accounts")}
        style={{ flexDirection: "row", gap: 4 }}
      >
        <Paragraph
          style={{
            color: Colors.text,
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          {activeAccount?.name}
        </Paragraph>
        <ArrowDown2 color={Colors.text} />
      </TouchableOpacity>
      <CopyAddress address={activeAccount?.address || ""} />
    </View>
  );
}
