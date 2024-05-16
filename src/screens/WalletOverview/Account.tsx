import { Column, IconButton, Row } from "@/components";
import { Account as AccountType, useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { trimAddress } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { Setting2, Warning2 } from "iconsax-react-native";
import { TouchableOpacity } from "react-native";
import { Headline, Paragraph } from "../../components/typography";

export type AccountProps = {
  item: AccountType;
};

export default function Account({ item }: AccountProps) {
  const { activeAccount, setActiveAccount } = useAccountsStore();
  const navigation = useNavigation<NavigationProp>();
  const isActive = item.address === activeAccount?.address;
  const selectAccount = (address: string) => {
    if (address !== activeAccount?.address) {
      setActiveAccount(address);
    }
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
      <Column style={{ gap: 2 }}>
        <Row>
          <Headline
            style={{
              color: isActive ? Colors.background : Colors.text,
              textAlign: "left",
              marginBottom: 0,
            }}
            size="base"
          >
            {item.name}
          </Headline>
          {/* Temporary solution until we get designs */}
          {item.passphraseSkipped && (
            <Warning2 size={16} color={Colors.danger} />
          )}
        </Row>
        <Paragraph>({trimAddress(item.address)})</Paragraph>
      </Column>
      <IconButton
        icon={Setting2}
        color={isActive ? Colors.background : Colors.text}
        style={{
          backgroundColor: isActive
            ? Colors.background500
            : Colors.background200,
        }}
        onPress={() =>
          navigation.navigate("Account settings", { address: item.address })
        }
      />
    </TouchableOpacity>
  );
}
