import { CopyAddress, Paragraph, Row } from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { ArrowDown2, Setting2, Warning2 } from "iconsax-react-native";
import { TouchableOpacity } from "react-native";

export default function DashboardHeader() {
  const { activeAccount } = useAccountsStore();
  const navigation = useNavigation<NavigationProp>();

  function openSettings() {
    navigation.push("Settings");
  }
  return (
    <Row
      style={{
        width: "100%",
      }}
    >
      <TouchableOpacity onPress={openSettings}>
        <Setting2 size={22} color={Colors.text100} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.push("Wallets")}
        style={{ flexDirection: "row", gap: 4 }}
      >
        <Row style={{ gap: 4 }}>
          <Paragraph
            style={{
              color: Colors.text,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            {activeAccount?.name}
          </Paragraph>
          {/* Temporary solution until we get designs */}
          {activeAccount?.passphraseSkipped && (
            <Warning2 size={16} color={Colors.danger} />
          )}
          <ArrowDown2 color={Colors.text} />
        </Row>
      </TouchableOpacity>
      <CopyAddress />
    </Row>
  );
}
