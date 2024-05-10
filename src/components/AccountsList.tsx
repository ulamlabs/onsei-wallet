import { Account, useAccountsStore } from "@/store";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AccountListItem from "./AccountListItem";
import { PrimaryButton } from "./buttons";
import { Column, Row } from "./layout";
import { Headline } from "./typography";

export default function AccountsList() {
  const navigation = useNavigation<NavigationProp>();
  const { accounts } = useAccountsStore();
  const [accountsSorted, setAccountsSorted] = useState<Account[]>([]);

  useEffect(() => {
    setAccountsSorted(accounts.sort((a, b) => b.name.localeCompare(a.name)));
  }, [accounts]);

  function onAddNew() {
    navigation.push("Add Wallet");
  }

  return (
    <Column>
      <Row>
        <Headline>Accounts</Headline>
        <PrimaryButton
          onPress={onAddNew}
          style={{ paddingVertical: 10 }}
          title="+"
        />
      </Row>
      {accountsSorted.map((account) => (
        <AccountListItem key={account.address} account={account} />
      ))}
    </Column>
  );
}
