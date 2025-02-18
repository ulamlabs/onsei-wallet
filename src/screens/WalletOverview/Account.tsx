import { IconButton, LinkIcon, NoBackupIcon, Row } from "@/components";
import { Account as AccountType, useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { trimAddress } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { Setting2 } from "iconsax-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Headline, Paragraph } from "../../components/typography";
import Avatar from "@/components/Avatar";

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
      style={[
        styles.container,
        { backgroundColor: isActive ? Colors.text : Colors.background300 },
      ]}
      onPress={() => selectAccount(item.address)}
    >
      <View style={styles.infoContainer}>
        <Avatar src={item.avatar} name={item.name} size={42} />
        <View>
          <Row>
            <Headline
              style={[
                styles.name,
                {
                  color: isActive ? Colors.background : Colors.text,
                },
              ]}
              size="base"
            >
              {item.name}
            </Headline>
          </Row>
          <Paragraph>({trimAddress(item.address)})</Paragraph>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <IconButton
          icon={Setting2}
          color={isActive ? Colors.background : Colors.text}
          testID={`${item.name.replaceAll(" ", "-")}-settings`}
          style={[
            styles.settingsIcon,
            {
              backgroundColor: isActive
                ? Colors.background500
                : Colors.background200,
            },
          ]}
          onPress={() =>
            navigation.navigate("Wallet settings", { address: item.address })
          }
        />
        {actionRequired && (
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: isActive ? Colors.text : Colors.background300,
              },
            ]}
          >
            {item.passphraseSkipped ? <NoBackupIcon /> : <LinkIcon />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 22,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    textAlign: "left",
    marginBottom: 0,
  },
  actionsContainer: {
    position: "relative",
  },
  settingsIcon: {
    borderRadius: 14,
    width: 42,
    height: 42,
  },
  actionIcon: {
    position: "absolute",
    borderRadius: 100,
    right: -6,
    top: -6,
  },
});
