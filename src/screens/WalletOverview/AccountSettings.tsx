import { AccountOption, Paragraph, SafeLayout } from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Edit2 } from "iconsax-react-native";
import { TouchableOpacity, View } from "react-native";

type AccountSettingsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Account settings"
>;

export default function AccountSettings({
  navigation,
  route: {
    params: { address },
  },
}: AccountSettingsProps) {
  const { accounts, toggleAccountOption } = useAccountsStore();
  const selectedAccount = accounts.find(
    (account) => account.address === address,
  );

  const toggleAssets = () => {
    toggleAccountOption("hideAssetsValue", address); // Doing nothing besides handling switch
  };

  const toggleNotifications = () => {
    toggleAccountOption("allowNotifications", address); // Doing nothing besides handling switch
  };

  const showPrivateKey = () => {
    // navigate to private key
  };

  const showRecoveryPhrase = () => {
    navigation.getParent()?.goBack();
    navigation.navigate("Your Mnemonic", { address: address });
  };

  return (
    <SafeLayout style={{ paddingTop: 24 }}>
      {selectedAccount ? (
        <>
          <View
            style={{
              paddingHorizontal: 22,
              paddingVertical: 16,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Paragraph
              style={{
                color: Colors.text,
                fontSize: 20,
                fontWeight: "700",
              }}
            >
              {selectedAccount?.name}
            </Paragraph>
            <TouchableOpacity
              style={{
                height: 38,
                width: 38,
                padding: 8,
                borderRadius: 14,
                backgroundColor: Colors.background300,
              }}
              onPress={() =>
                navigation.navigate("Edit name", { account: selectedAccount })
              }
            >
              <Edit2 color={Colors.text} size={22} />
            </TouchableOpacity>
          </View>
          <View style={{ gap: 1 }}>
            <AccountOption
              title="Hide assets value"
              onPress={toggleAssets}
              type="checkbox"
              value={selectedAccount.hideAssetsValue}
              style={{ borderTopStartRadius: 22, borderTopEndRadius: 22 }}
            />
            <AccountOption
              title="Allow notifications"
              onPress={toggleNotifications}
              type="checkbox"
              value={selectedAccount.allowNotifications}
            />
            <AccountOption
              title="Show private key"
              onPress={showPrivateKey}
              value={selectedAccount.allowNotifications}
            />
            <AccountOption
              title="Show recovery phrase"
              onPress={showRecoveryPhrase}
              value={selectedAccount.allowNotifications}
              style={{ borderBottomStartRadius: 22, borderBottomEndRadius: 22 }}
            />
          </View>
        </>
      ) : (
        <Paragraph>Something went wrong</Paragraph>
      )}
    </SafeLayout>
  );
}
