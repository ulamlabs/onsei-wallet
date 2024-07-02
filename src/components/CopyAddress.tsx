import { useAccountsStore, useModalStore } from "@/store";
import { Colors } from "@/styles";
import { Copy } from "iconsax-react-native";
import { Pressable, View } from "react-native";
import CopyAddressItem from "./CopyAddressItem";

export default function CopyAddress() {
  const { activeAccount } = useAccountsStore();
  const { alert } = useModalStore();

  function openModal() {
    alert({
      title: `${activeAccount!.name} addresses`,
      description: (
        <View>
          <CopyAddressItem type="EVM" address={activeAccount!.evmAddress} />
          <CopyAddressItem type="SEI" address={activeAccount!.address} />
        </View>
      ),
      useHeadline: true,
      hideOk: true,
    });
  }

  return (
    <Pressable onPress={openModal}>
      <Copy size={22} color={Colors.dashboardMenu} />
    </Pressable>
  );
}
