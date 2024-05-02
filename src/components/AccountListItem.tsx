import { Account, useAccountsStore, useModalStore } from "@/store";
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
import { Pressable, View } from "react-native";
import Tooltip from "./Tooltip";
import { Colors } from "@/styles";
import { TertiaryButton } from "./buttons";
import { NavigationProp } from "@/types";
import { Row } from "./layout";
import { Text } from "./typography";

type Props = {
  account: Account;
};

export default function AccountListItem({ account }: Props) {
  const { address, balance } = account;
  const { activeAccount, setActiveAccount, deleteAccount } = useAccountsStore();
  const { ask, alert } = useModalStore();
  const [visibleTooltip, setVisibleTooltip] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp>();

  function onSelect() {
    setActiveAccount(address);
  }

  function onCopy() {
    Clipboard.setStringAsync(address);
    setVisibleTooltip(false);
  }

  function onTxnsShow() {
    setVisibleTooltip(false);
    navigation.push("Transactions", { address });
  }

  async function onRemove() {
    setVisibleTooltip(false);
    const yesno = await ask({
      title: "Remove account?",
      question:
        "Are you sure you want to remove this account?\nThis action cannot be reversed.",
      yes: "Yes, remove the account",
      no: "No, keep the account",
      primary: "yes",
      danger: true,
    });
    if (yesno) {
      await deleteAccount(account.address!);
      alert({
        title: "Account removed",
        description: `Account ${account.name} (${account.address}) removed.`,
      });
    }
  }

  function onMnemonicShow() {
    setVisibleTooltip(false);
    navigation.push("Authorize", {
      nextRoute: "Your Mnemonic",
      nextParams: { address },
    });
  }

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: "black",
        borderRadius: 16,
        gap: 15,
      }}
    >
      <Row>
        <Text>{trimAddress(address)}</Text>
        <Text>{formatTokenAmount(balance)}</Text>
      </Row>

      <Row>
        {address === activeAccount?.address ? (
          <Text style={{ color: Colors.success }}>Active</Text>
        ) : (
          <Pressable onPress={onSelect}>
            <Text>Select</Text>
          </Pressable>
        )}

        <Tooltip
          onPress={() => setVisibleTooltip(true)}
          toggleElement={<More color={Colors.text} />}
          isVisible={visibleTooltip}
          onBackdropPress={() => setVisibleTooltip(false)}
        >
          <TertiaryButton
            onPress={onCopy}
            title="Copy Address"
            icon={<ClipboardCopy color={Colors.text} size={16} />}
          />
          <TertiaryButton
            onPress={onMnemonicShow}
            title="View Passphrase"
            icon={<Lock1 color={Colors.text} size={16} />}
          />
          <TertiaryButton
            onPress={onTxnsShow}
            title="View Transactions"
            icon={<ArrangeHorizontal color={Colors.text} size={16} />}
          />
          {activeAccount?.address !== address && (
            <TertiaryButton
              onPress={onRemove}
              title="Remove Account"
              textStyle={{ color: Colors.danger }}
              icon={<Trash color={Colors.danger} size={16} />}
            />
          )}
        </Tooltip>
      </Row>
    </View>
  );
}
