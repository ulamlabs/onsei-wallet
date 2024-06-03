import { isToday } from "date-fns";
import { Transaction } from "@/modules/transactions";
import { useAccountsStore, useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { formatAmount } from "@/utils";
import { trimAddress } from "@/utils/trimAddress";
import { Pressable, TextStyle, View } from "react-native";
import { Column, Option, OptionGroup, Row, Text } from "@/components";
import { useMemo } from "react";
import { CloseCircle, Receive } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import {
  getKnownAddress,
  getSentOrReceived,
  getTokenFromTxn,
  getTxnDate,
} from "./utils";
import { serializeTxn } from "@/modules/transactions/utils";

type TransactionRenderProps = {
  txn: Transaction;
};

type TransactionListProps = {
  transactions: Transaction[];
};

const DAY = 24 * 60 * 60 * 1000;

function TransactionBox({ txn }: TransactionRenderProps) {
  const { tokenMap } = useTokensStore();
  const { activeAccount } = useAccountsStore();
  const token = getTokenFromTxn(txn, tokenMap);

  const sentOrReceived = useMemo(
    () => getSentOrReceived(txn, activeAccount!.address),
    [txn],
  );

  const type = useMemo(() => {
    if (txn.token) {
      return "";
    }
    if (txn.contractAction) {
      return txn.contractAction;
    }
    return txn.type;
  }, [txn]);

  const addressDisplay = useMemo(() => {
    if (sentOrReceived === "") {
      return "";
    }
    const address = sentOrReceived === "sent" ? txn.to : txn.from;
    const knownAddress = getKnownAddress(address);

    if (knownAddress) {
      return knownAddress.name;
    }
    return trimAddress(address);
  }, [txn]);

  const formattedDate = useMemo(() => getTxnDate(txn), [txn]);

  const color = useMemo(() => {
    if (txn.status === "fail") {
      return Colors.danger100;
    }
    return sentOrReceived === "sent" ? Colors.text : Colors.success100;
  }, [sentOrReceived, txn]);

  const Icon = useMemo(() => {
    if (txn.status === "fail") {
      return CloseCircle;
    }
    if (sentOrReceived !== "") {
      return Receive;
    }
  }, [txn]);

  function getContent() {
    if (txn.token && sentOrReceived !== "") {
      return (
        <Row style={{ flex: 1 }}>
          <View>
            <Text>{addressDisplay}</Text>
            <Text style={{ color: Colors.text100, fontSize: FontSizes.xs }}>
              {sentOrReceived.replace(
                sentOrReceived[0],
                sentOrReceived[0].toUpperCase(),
              )}
              , {formattedDate}
            </Text>
          </View>

          <Text style={{ color, fontFamily: FontWeights.bold }}>
            {txn.status === "success" &&
              (sentOrReceived === "sent" ? "-" : "+")}
            {formatAmount(txn.amount, token.decimals)} {token.symbol}
          </Text>
        </Row>
      );
    }

    if (txn.contractAction) {
      const chipStyle: TextStyle = {
        backgroundColor: Colors.background,
        padding: 5,
        borderRadius: 5,
      };
      return (
        <View>
          <Row style={{ justifyContent: "flex-start" }}>
            <Text>Execute</Text>
            <Text style={chipStyle}>{txn.contractAction}</Text>
            <Text>on</Text>
            <Text style={chipStyle}>{trimAddress(txn.contract)}</Text>
          </Row>
          <Text style={{ color: Colors.text100, fontSize: FontSizes.xs }}>
            {formattedDate}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text>{type}</Text>
        <Text style={{ color: Colors.text100, fontSize: FontSizes.xs }}>
          {formattedDate}
        </Text>
      </View>
    );
  }

  return (
    <>
      {Icon && (
        <View
          style={{
            backgroundColor: Colors.background,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Icon
            color={color}
            size={20}
            style={
              sentOrReceived === "sent" ? { transform: [{ scale: -1 }] } : null
            }
          />
        </View>
      )}
      {getContent()}
    </>
  );
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const navigation = useNavigation<NavigationProp>();
  const groupedTxs: Transaction[][] = [];

  transactions.forEach((tx, id) => {
    id === 0 ||
    getTxnHeader(tx.timestamp) !== getTxnHeader(transactions[id - 1].timestamp)
      ? groupedTxs.push([tx])
      : groupedTxs[groupedTxs.length - 1].push(tx);
  });

  function getTxnHeader(date: Date) {
    if (isToday(date)) {
      return "Today";
    }
    const now = new Date().getTime();
    const then = date.getTime();

    if (then > now - 7 * DAY) {
      return "Last 7 days";
    }
    if (then > now - 30 * DAY) {
      return "Last 30 days";
    }
    return "Older";
  }

  return (
    <>
      {groupedTxs.map((txGroup) => (
        <Column
          style={{ marginBottom: 16 }}
          key={getTxnHeader(txGroup[0].timestamp)}
        >
          <Text style={{ color: Colors.text100, fontSize: FontSizes.base }}>
            {getTxnHeader(txGroup[0].timestamp)}
          </Text>
          <OptionGroup>
            {txGroup.map((txn, id) => (
              <Pressable
                key={id}
                onPress={() =>
                  navigation.push("Transaction details", {
                    transaction: serializeTxn(txn),
                  })
                }
              >
                <Option label="">
                  <TransactionBox txn={txn} />
                </Option>
              </Pressable>
            ))}
          </OptionGroup>
        </Column>
      ))}
    </>
  );
}
