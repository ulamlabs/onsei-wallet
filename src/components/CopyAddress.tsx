import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { Copy } from "iconsax-react-native";
import { useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import CopyAddressItem from "./CopyAddressItem";
import Tooltip from "./Tooltip";

export default function CopyAddress() {
  const { height } = Dimensions.get("window");
  const [visible, setVisible] = useState(false);
  const { accounts } = useAccountsStore();
  const [top, setTop] = useState(0);

  return (
    <Tooltip
      isVisible={visible}
      position="top"
      onPress={() => setVisible(true)}
      onBackdropPress={() => setVisible(false)}
      toggleElement={<Copy size={22} color={Colors.text100} />}
      transparentBg
      getTopPosition={setTop}
    >
      <View
        style={{
          position: "absolute",
          width: 214,
          right: 20,
          top: -height + top + 48,
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
          renderItem={({ item }) => <CopyAddressItem item={item} />}
          contentContainerStyle={{ gap: 32 }}
        />
      </View>
    </Tooltip>
  );
}
