import { Paragraph, Tooltip } from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import D from "decimal.js";
import { Add } from "iconsax-react-native";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: JSX.Element;
  open: boolean;
  onBackdropPress: () => void;
};

export default function AccountsModal({
  children,
  open,
  onBackdropPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
  const { accounts } = useAccountsStore();
  const calculateTotalAmount = () => {
    return accounts
      .reduce((totalBalance, account) => {
        return new D(totalBalance).add(new D(account.balance));
      }, new D(0))
      .toString();
  };
  return (
    <Tooltip
      toggleElement={children}
      isVisible={open}
      onBackdropPress={onBackdropPress}
    >
      <View
        onStartShouldSetResponder={() => true}
        style={{
          height: screenHeight - insets.top - 60,
          padding: 0,
          paddingBottom: insets.bottom,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            backgroundColor: Colors.background100,
            height: 70,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginLeft: -10,
            marginTop: -12,
            width: screenWidth,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View>
            <Add style={{ transform: [{ rotateZ: "45deg" }] }} />
          </View>
          <Paragraph>Total: ${calculateTotalAmount()}</Paragraph>
        </View>
      </View>
    </Tooltip>
  );
}
