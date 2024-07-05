import { Column, IconButton, LinkIcon, NoBackupIcon, Row } from "@/components";
import { Account as AccountType, useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { trimAddress } from "@/utils";
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
  const actionRequired = item.passphraseSkipped || !item.addressLinked;

  function selectAccount(address: string) {
    if (address !== activeAccount?.address) {
      setActiveAccount(address);
    }
    navigation.goBack();
  }

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
        </Row>
        <Paragraph>({trimAddress(item.address)})</Paragraph>
      </Column>
      <View style={{ position: "relative" }}>
        <IconButton
          icon={Setting2}
          color={isActive ? Colors.background : Colors.text}
          testID={`${item.name.replaceAll(" ", "-")}-settings`}
          style={{
            backgroundColor: isActive
              ? Colors.background500
              : Colors.background200,
          }}
          onPress={() =>
            navigation.navigate("Wallet settings", { address: item.address })
          }
        />
        {actionRequired && (
          <View
            style={{
              position: "absolute",
              borderRadius: 100,
              backgroundColor: isActive ? Colors.text : Colors.background300,
              right: -6,
              top: -6,
            }}
          >
            {item.passphraseSkipped ? <NoBackupIcon /> : <LinkIcon />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
