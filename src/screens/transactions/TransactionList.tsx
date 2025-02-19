import {
  Column,
  Option,
  OptionGroup,
  Paragraph,
  Row,
  Text,
} from "@/components";
import { Transaction } from "@/modules/transactions";
import { serializeTxn } from "@/modules/transactions/utils";
import { useAccountsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigationProp } from "@/types";
import { calculateTokenUsdBalance, capitalize, formatAmount } from "@/utils";
import { trimAddress } from "@/utils/trimAddress";
import { useNavigation } from "@react-navigation/native";
import { isToday } from "date-fns";
import {
  ArrowDown,
  ArrowSwapHorizontal,
  CloseCircle,
  Coin,
} from "iconsax-react-native";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import {
  getKnownAddress,
  getSentOrReceived,
  getTokenFromTxn,
  getTxnDate,
} from "./utils";

type TransactionRenderProps = {
  txn: Transaction;
};

type TransactionListProps = {
  transactions: Transaction[];
};

const DAY = 24 * 60 * 60 * 1000;

function TransactionBox({ txn }: TransactionRenderProps) {
  const { activeAccount } = useAccountsStore();
  const token = getTokenFromTxn(txn);

  const sentOrReceived = useMemo(
    () => getSentOrReceived(txn, activeAccount!),
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
    if (sentOrReceived === "" && !txn.contractAction) {
      return "";
    }
    const address = txn.contractAction
      ? txn.contract
      : sentOrReceived === "sent"
        ? txn.to
        : txn.sender;
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
    return sentOrReceived === "received" ? Colors.success100 : Colors.text;
  }, [sentOrReceived, txn]);

  const Icon = useMemo(() => {
    if (txn.status === "fail") {
      return CloseCircle;
    }
    if (sentOrReceived !== "") {
      return ArrowDown;
    }
    if (txn.contractAction) {
      return ArrowSwapHorizontal;
    }
    return Coin;
  }, [txn]);

  const timestampInMilliseconds = txn.timestamp.getTime();
  console.log(timestampInMilliseconds);

  function getContent() {
    if (txn.token && sentOrReceived !== "") {
      return (
        <Row style={{ flex: 1 }}>
          <View>
            <Text>{addressDisplay}</Text>
            <Text style={{ color: Colors.text100, fontSize: FontSizes.xs }}>
              {capitalize(sentOrReceived)}, {formattedDate}
            </Text>
          </View>

          <View>
            <Text style={{ color, fontFamily: FontWeights.bold }}>
              {txn.status === "success" &&
                (sentOrReceived === "sent" ? "-" : "+")}
              {formatAmount(txn.amount, token.decimals)} {token.symbol}
            </Text>
            {!!token.price && (
              <Paragraph>
                ${calculateTokenUsdBalance(token, txn.amount)}
              </Paragraph>
            )}
          </View>
        </Row>
      );
    }

    if (txn.contractAction) {
      return (
        <Row style={{ flex: 1 }}>
          <View>
            <Text>{addressDisplay}</Text>
            <Text style={{ color: Colors.text100, fontSize: FontSizes.xs }}>
              Executed, {formattedDate}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              backgroundColor: Colors.background400,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: Colors.text100 }}>
              {capitalize(txn.contractAction)}
            </Text>
          </View>
        </Row>
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
                testID={`transaction-${id}`}
                onPress={() =>
                  navigation.navigate("Transaction details", {
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
