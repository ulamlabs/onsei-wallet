import tw from "@/lib/tailwind";
import { Account, useAccountsStore } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AccountListItem from "./AccountListItem";
import Button from "./Button";
import Modal from "./Modal";

export default () => {
  const navigation = useNavigation();
  const { accounts, deleteAccount, getMnemonic } = useAccountsStore();
  const [accountsSorted, setAccountsSorted] = useState<Account[]>([]);
  const [addressToRemove, setAddressToRemove] = useState<string | null>(null);

  useEffect(() => {
    setAccountsSorted(accounts.sort((a, b) => b.balance - a.balance));
  }, [accounts]);

  function onAddNew() {
    (navigation as any).push("Init");
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
      {accountsSorted.map((account) => (
        <AccountListItem
          key={account.address}
          onRemove={() => setAddressToRemove(account.address)}
          account={account}
        />
      ))}
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
