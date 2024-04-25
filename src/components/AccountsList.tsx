import tw from "@/lib/tailwind";
import { Account, useAccountsStore } from "@/store";
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
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Button from "./Button";
import MnemonicWords from "./MnemonicWords";
import Modal from "./Modal";
import Tooltip from "./Tooltip";

export default () => {
  const navigation = useNavigation();
  const {
    activeAccount,
    node,
    accounts,
    getMnemonic,
    deleteAccount,
    setActiveAccount,
  } = useAccountsStore();
  const [accountsSorted, setAccountsSorted] = useState<Account[]>([]);
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [mnemoToShow, setMnemoToShow] = useState<string[] | null>(null);
  const [addressToRemove, setAddressToRemove] = useState<string | null>(null);

  useEffect(() => {
    setAccountsSorted(accounts.sort((a, b) => b.balance - a.balance));
  }, [accounts]);

  function onAddNew() {
    (navigation as any).push("Init");
  }

  function onSelect(address: string) {
    setActiveAccount(address);
  }

  function onCopy(address: string) {
    Clipboard.setStringAsync(address);
    setVisibleTooltip(null);
  }

  function onMnemoShow(address: string) {
    setMnemoToShow(getMnemonic(address).split(" "));
    setVisibleTooltip(null);
  }

  function onTxnsShow(address: string) {
    setVisibleTooltip(null);
    (navigation as any).push("Transactions", { address });
  }

  function onRemove(address: string) {
    setAddressToRemove(address);
    setVisibleTooltip(null);
  }

  function onRemoveConfirm() {
    deleteAccount(addressToRemove!);
    setAddressToRemove(null);
  }

  return (
    <View style={tw`w-full gap-2`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-2xl text-white font-bold`}>Accounts</Text>
        <Button
          onPress={onAddNew}
          styles={tw`rounded-full h-7 w-7 p-0 justify-center items-center`}
          label="+"
        />
      </View>
      {accountsSorted.map(({ address, balance }) => (
        <View key={address} style={tw`p-4 rounded-xl bg-black bg-opacity-20`}>
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
                icon={
                  <ClipboardCopy color={tw.color("primary-500")} size={16} />
                }
              />
              <Button
                type="ghost"
                onPress={() => onMnemoShow(address)}
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
                  <ArrangeHorizontal
                    color={tw.color("primary-500")}
                    size={16}
                  />
                }
              />
              {activeAccount?.address !== address && (
                <Button
                  type="ghost"
                  onPress={() => onRemove(address)}
                  textStyles={`text-danger-500`}
                  icon={<Trash color={tw.color("danger-500")} size={16} />}
                  label="Remove Account"
                />
              )}
            </Tooltip>
          </View>
        </View>
      ))}

      <Modal
        isVisible={!!mnemoToShow}
        title="Your Passphrase"
        description="Remember to not share this passphrase with anyone, as it grants full access to your account"
        buttonTxt="Close"
        onConfirm={() => setMnemoToShow(null)}
      >
        {mnemoToShow && <MnemonicWords mnemonic={mnemoToShow} />}
      </Modal>
      <Modal
        isVisible={!!addressToRemove}
        title="Remove account?"
        description={
          "Are you sure you want to remove this account?\nThis action cannot be reversed."
        }
        buttonTxt="Confirm"
        onConfirm={onRemoveConfirm}
        onCancel={() => setAddressToRemove(null)}
      />
    </View>
  );
};
