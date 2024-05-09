import { Paragraph, SafeLayout } from "@/components";
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
  const { accounts } = useAccountsStore();
  const selectedAccount = accounts.find(
    (account) => account.address === address,
  );
  return (
    <SafeLayout style={{ paddingTop: 24 }}>
      {selectedAccount ? (
        <View
          style={{
            paddingHorizontal: 22,
            paddingVertical: 16,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
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
      ) : (
        <Paragraph>Something went wrong</Paragraph>
      )}
    </SafeLayout>
  );
}
