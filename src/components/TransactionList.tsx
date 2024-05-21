import { Transaction } from "@/modules/transactions";
import { useAccountsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { formatAmount, formatDate } from "@/utils";
import { trimAddress } from "@/utils/trimAddress";
import { TextStyle, View } from "react-native";
import Box from "./Box";
import { Column, Row } from "./layout";
import { Text } from "./typography";
import { useMemo } from "react";
import { CloseCircle, Receive } from "iconsax-react-native";

type TransactionRenderProps = {
  txn: Transaction;
};

type TransactionListProps = {
  transactions: Transaction[];
};

const unknownToken = {
  symbol: "?",
  decimals: 6,
};

type SentOrReceived = "sent" | "received" | "";

function TransactionBox({ txn }: TransactionRenderProps) {
  const { tokenMap } = useTokensStore();
  const { activeAccount } = useAccountsStore();
  const token = tokenMap.get(txn.token) || unknownToken;

  const sentOrReceived: SentOrReceived = useMemo(getSentOrReceived, [txn]);

  const type = useMemo(() => {
    if (txn.token) {
      return "";
    }
    if (txn.contractAction) {
      return txn.contractAction;
    }
    return txn.type;
  }, [txn]);

  function getSentOrReceived(): SentOrReceived {
    if (txn.from === activeAccount?.address) {
      return "sent";
    }
    if (txn.to === activeAccount?.address) {
      return "received";
    }
    return "";
  }

  const color = useMemo(() => {
    if (txn.status === "fail") {
      return Colors.danger;
    }
    return sentOrReceived === "sent" ? Colors.text : Colors.success;
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
        <>
          <View>
            <Text>
              {trimAddress(sentOrReceived === "sent" ? txn.to : txn.from)}
            </Text>
            <Text style={{ color: Colors.text100 }}>
              {txn.timestamp.toISOString()}
            </Text>
          </View>

          <Text style={{ color }}>
            {sentOrReceived === "sent" ? "-" : "+"}
            {formatAmount(txn.amount, token.decimals)} {token.symbol}
          </Text>
        </>
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
          <Text style={{ color: Colors.text100 }}>
            {txn.timestamp.toISOString()}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text>{type}</Text>
        <Text style={{ color: Colors.text100 }}>
          {txn.timestamp.toISOString()}
        </Text>
      </View>
    );
  }

  return (
    <Box>
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
    </Box>
  );
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <Column>
      {transactions.map((item, index) => (
        <View key={index} style={{ marginTop: 20, gap: 10 }}>
          {(index === 0 ||
            !isSameDay(item.timestamp, transactions[index - 1].timestamp)) && (
            <Text>{formatDate(item.timestamp)}</Text>
          )}

          <TransactionBox txn={item} />
        </View>
      ))}
    </Column>
  );
}
