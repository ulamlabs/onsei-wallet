import tw from "@/lib/tailwind";
import { Account, useAccountsStore } from "@/store";
import { formatTokenAmount } from "@/utils/formatAmount";
import { trimAddress } from "@/utils/trimAddress";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { More } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Button from "./Button";
import Popover from "./Popover";

export default () => {
  const navigation = useNavigation();
  const {
    activeAccount,
    node,
    getBalance,
    accounts,
    getMnemonic,
    changeActiveAccount,
  } = useAccountsStore();
  const [accountsSorted, setAccountsSorted] = useState<Account[]>([]);
  const [visiblePopover, setVisiblePopover] = useState<string | null>(null);
  const [mnemoToShow, setMnemoToShow] = useState<string[] | null>(null);
  const [addressToRemove, setAddressToRemove] = useState<string | null>(null);

  useEffect(() => {
    setAccountsSorted(
      accounts.sort((a, b) => getBalance(b.address) - getBalance(a.address))
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
    setMnemoToShow(getMnemonic(address).split(" "));
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
      {accountsSorted.map(({ address }) => (
        <View key={address} style={tw`p-4 rounded-xl bg-black bg-opacity-20`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-white`}>{trimAddress(address)}</Text>
            <Text style={tw`text-white`}>
              {formatTokenAmount(getBalance(address))}
            </Text>
          </View>
          <View style={tw`flex-row justify-between items-center mt-3`}>
            {address === activeAccount?.address ? (
              <Text style={tw`text-success-500`}>Active</Text>
            ) : (
              <Button
                type="ghost"
                onPress={() => onSelect(address)}
                label="Select"
              />
            )}

            <Popover
              onPress={() => setVisiblePopover(address)}
              toggleElement={<More />}
              isVisible={visiblePopover === address}
              onBackdropPress={() => setVisiblePopover(null)}
              backgroundColor="#212B46"
              width={200}
              height={130}
            >
              <Button
                type="ghost"
                onPress={() => onCopy(address)}
                label="Copy Address"
              />
              <Button
                type="ghost"
                onPress={() => onMnemoShow(address)}
                label="View Passphrase"
              />
              {/* API for transactions works only on MainNet, so there's no point in showing this on TestNet */}
              {node === "MainNet" && (
                <Button
                  type="ghost"
                  onPress={() => onTxnsShow(address)}
                  label="View Transactions"
                />
              )}
              {activeAccount?.address !== address && (
                <Button
                  type="ghost"
                  onPress={() => onRemove(address)}
                  label="Remove Account"
                />
              )}
            </Popover>
          </View>
        </View>
      ))}
    </View>
  );
};
