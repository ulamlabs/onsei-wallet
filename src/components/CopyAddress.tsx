import { AccountProps } from "@/screens/WalletOverview/Account";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { Copy } from "iconsax-react-native";
import { useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import CopyAddressItem from "./CopyAddressItem";
import Tooltip from "./Tooltip";

export default function CopyAddress() {
  const { width, height } = Dimensions.get("window");
  const [visible, setVisible] = useState(false);
  const { accounts } = useAccountsStore();

  const RenderItem = ({ item }: AccountProps) => {
    return <CopyAddressItem item={item} />;
  };

  return (
    <Tooltip
      isVisible={visible}
      position="top"
      onPress={() => setVisible(true)}
      onBackdropPress={() => setVisible(false)}
      toggleElement={<Copy size={22} color={Colors.text100} />}
    >
      <View
        style={{
          position: "absolute",
          width: 214,
          left: width - 214 - 20,
          top: -height + 120,
          backgroundColor: "rgb(26,26,26)",
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderWidth: 1,
          borderColor: Colors.inputBorderColor,
          borderRadius: 12,
        }}
      >
        <FlatList
          scrollEnabled={false}
          data={accounts}
          renderItem={RenderItem}
          contentContainerStyle={{ gap: 32 }}
        />
      </View>
    </Tooltip>
  );
}
