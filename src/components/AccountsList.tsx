import tw from "@/lib/tailwind";
import { AccountContext, AccountContextType } from "@/store/account";
import { formatTokenAmount } from "@/utils/formatAmount";
import { trimAddress } from "@/utils/trimAddress";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { More } from "iconsax-react-native";
import { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "./Button";
import Popover from "./Popover";

export default () => {
  const navigation = useNavigation();
  const {
    activeAccount,
    accounts,
    node,
    mnemonics,
    getBalance,
    changeActiveAccount,
  } = useContext(AccountContext) as AccountContextType;
  const [accountsSorted, setAccountsSorted] = useState<string[]>([]);
  const [visiblePopover, setVisiblePopover] = useState<string | null>(null);
  const [mnemoToShow, setMnemoToShow] = useState<string[] | null>(null);
  const [addressToRemove, setAddressToRemove] = useState<string | null>(null);

  useEffect(() => {
    setAccountsSorted(
      [...accounts.keys()].sort((a, b) => getBalance(b) - getBalance(a))
    );
  }, [accounts, getBalance]);

  function onAddNew() {
    (navigation as any).push("Init");
  }

  function onSelect(address: string) {
    changeActiveAccount(address);
  }

  function onCopy(address: string) {
    Clipboard.setStringAsync(address);
    setVisiblePopover(null);
  }

  function onMnemoShow(address: string) {
    setMnemoToShow(mnemonics.get(address)!.split(" "));
    setVisiblePopover(null);
  }

  function onTxnsShow(address: string) {
    setVisiblePopover(null);
    (navigation as any).push("Transactions", { address });
  }

  function onRemove(address: string) {
    setAddressToRemove(address);
    setVisiblePopover(null);
  }

  return (
    <View style={tw`w-full`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-2xl text-white font-bold`}>Accounts</Text>
        <Button
          onPress={onAddNew}
          styles={tw`rounded-full h-7 w-7 p-0 justify-center items-center`}
          label="+"
        />
      </View>
      {accountsSorted.map((acc) => (
        <View key={acc} style={tw`p-4 rounded-xl bg-black bg-opacity-20`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-white`}>{trimAddress(acc)}</Text>
            <Text style={tw`text-white`}>
              {formatTokenAmount(getBalance(acc))}
            </Text>
          </View>
          <View style={tw`flex-row justify-between items-center mt-3`}>
            {acc === activeAccount ? (
              <Text style={tw`text-success-500`}>Active</Text>
            ) : (
              <Button
                type="ghost"
                onPress={() => onSelect(acc)}
                label="Select"
              />
            )}

            <Popover
              toggleElement={
                <TouchableOpacity onPress={() => setVisiblePopover(acc)}>
                  <More />
                </TouchableOpacity>
              }
              isVisible={visiblePopover === acc}
              onBackdropPress={() => setVisiblePopover(null)}
            >
              <View>
                <Button
                  type="ghost"
                  onPress={() => onCopy(acc)}
                  label="Copy Address"
                />
                <Button
                  type="ghost"
                  onPress={() => onMnemoShow(acc)}
                  label="View Passphrase"
                />
                {/* API for transactions works only on MainNet, so there's no point in showing this on TestNet */}
                {node === "MainNet" && (
                  <Button
                    type="ghost"
                    onPress={() => onTxnsShow(acc)}
                    label="View Transactions"
                  />
                )}
                {activeAccount !== acc && (
                  <Button
                    type="ghost"
                    onPress={() => onRemove(acc)}
                    label="Remove Account"
                  />
                )}
              </View>
            </Popover>
          </View>
        </View>
      ))}
    </View>
  );
};
