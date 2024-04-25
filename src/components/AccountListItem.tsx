import tw from "@/lib/tailwind";
import { useAccountsStore } from "@/store";
import { formatTokenAmount } from "@/utils/formatAmount";
import { trimAddress } from "@/utils/trimAddress";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import {
  ArrangeHorizontal,
  Clipboard as ClipboardCopy,
  Lock1,
  More,
  Trash,
} from "iconsax-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import Button from "./Button";
import Tooltip from "./Tooltip";

type Props = {
  account: { address: string; balance: number };
  onRemove: () => void;
  showMnemo: () => void;
};

export default ({ account, onRemove, showMnemo }: Props) => {
  const { address, balance } = account;
  const { activeAccount, setActiveAccount, getMnemonic } = useAccountsStore();
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const navigation = useNavigation();

  function onSelect(address: string) {
    setActiveAccount(address);
  }

  function onCopy(address: string) {
    Clipboard.setStringAsync(address);
    setVisibleTooltip(null);
  }

  function onMnemoShow() {
    setVisibleTooltip(null);
    showMnemo();
  }

  function onTxnsShow(address: string) {
    setVisibleTooltip(null);
    (navigation as any).push("Transactions", { address });
  }

  function onRemoveHandle() {
    setVisibleTooltip(null);
    onRemove();
  }

  return (
    <View style={tw`p-4 rounded-xl bg-black bg-opacity-20`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-white`}>{trimAddress(address)}</Text>
        <Text style={tw`text-white`}>{formatTokenAmount(balance)}</Text>
      </View>
      <View style={tw`flex-row justify-between items-center mt-3`}>
        {address === activeAccount?.address ? (
          <Text style={tw`text-success-500`}>Active</Text>
        ) : (
          <Button
            type="ghost"
            onPress={() => onSelect(address)}
            label="Select"
            styles={tw`p-0`}
          />
        )}

        <Tooltip
          onPress={() => setVisibleTooltip(address)}
          toggleElement={<More />}
          isVisible={visibleTooltip === address}
          onBackdropPress={() => setVisibleTooltip(null)}
          width={200}
          height={activeAccount?.address !== address ? 160 : 130}
        >
          <Button
            type="ghost"
            onPress={() => onCopy(address)}
            textStyles={`text-primary-500`}
            label="Copy Address"
            icon={<ClipboardCopy color={tw.color("primary-500")} size={16} />}
          />
          <Button
            type="ghost"
            onPress={() => onMnemoShow()}
            textStyles={`text-primary-500`}
            label="View Passphrase"
            icon={<Lock1 color={tw.color("primary-500")} size={16} />}
          />
          <Button
            type="ghost"
            onPress={() => onTxnsShow(address)}
            label="View Transactions"
            textStyles={`text-primary-500`}
            icon={
              <ArrangeHorizontal color={tw.color("primary-500")} size={16} />
            }
          />
          {activeAccount?.address !== address && (
            <Button
              type="ghost"
              onPress={() => onRemoveHandle()}
              textStyles={`text-danger-500`}
              icon={<Trash color={tw.color("danger-500")} size={16} />}
              label="Remove Account"
            />
          )}
        </Tooltip>
      </View>
    </View>
  );
};
