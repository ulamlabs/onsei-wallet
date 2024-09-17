import {
  Column,
  NetworkFeeInfo,
  Option,
  OptionGroup,
  Paragraph,
  Row,
  SafeLayout,
  TertiaryButton,
  Text,
  TransactionDetailsOption,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { deserializeTxn } from "@/modules/transactions/utils";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { calculateTokenUsdBalance, formatAmount, trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ExportSquare } from "iconsax-react-native";
import { useMemo } from "react";
import { Linking } from "react-native";
import {
  getKnownAddress,
  getSentOrReceived,
  getTokenFromTxn,
  getTxnDate,
} from "./utils";

type Props = NativeStackScreenProps<NavigatorParamsList, "Transaction details">;

export default function TransactionDetails({
  route: {
    params: { transaction },
  },
}: Props) {
  const { activeAccount } = useAccountsStore();
  const { sei } = useTokensStore();
  const {
    settings: { node },
  } = useSettingsStore();
  const txn = deserializeTxn(transaction);
  const token = getTokenFromTxn(txn);

  const sentOrReceived = useMemo(
    () => getSentOrReceived(txn, activeAccount!),
    [txn],
  );

  const addressDisplay = useMemo(() => {
    if (sentOrReceived === "") {
      return "";
    }
    const address = sentOrReceived === "sent" ? txn.to : txn.from;
    const knownAddress = getKnownAddress(address);

    if (knownAddress) {
      return `${knownAddress.name} (${trimAddress(address)})`;
    }
    return trimAddress(address);
  }, [txn]);

  function onShowDetails() {
    const network = NETWORK_NAMES[node];
    const url = `https://seitrace.com/tx/${txn.hash}?chain=${network}`;
    Linking.openURL(url);
  }

  return (
    <SafeLayout>
      <Column style={{ flex: 1 }}>
        {sentOrReceived && (
          <>
            <Row style={{ justifyContent: "flex-start" }}>
              <Text style={{ color: Colors.text100, fontSize: FontSizes.base }}>
                To:
              </Text>
              <Text
                style={{
                  fontFamily: FontWeights.bold,
                  fontSize: FontSizes.base,
                }}
              >
                {addressDisplay}
              </Text>
            </Row>

            <Column style={{ alignItems: "center", marginVertical: 40 }}>
              <Text
                style={{
                  fontFamily: FontWeights.bold,
                  fontSize: FontSizes["2xl"],
                  color:
                    txn.status === "success" ? Colors.text : Colors.danger100,
                }}
              >
                {txn.status === "success" &&
                  (sentOrReceived === "sent" ? "-" : "+")}
                {formatAmount(txn.amount, token.decimals)} {token.symbol}
              </Text>
              {token.price ? (
                <Paragraph size="lg">
                  ${calculateTokenUsdBalance(token, txn.amount)}
                </Paragraph>
              ) : (
                <></>
              )}
            </Column>
          </>
        )}

        <OptionGroup>
          <TransactionDetailsOption label="Status">
            <Text
              style={{
                fontSize: FontSizes.base,
                color:
                  txn.status === "success" ? Colors.text : Colors.danger100,
              }}
            >
              {txn.status === "success" ? "Completed" : "Failed"}
            </Text>
          </TransactionDetailsOption>
          <TransactionDetailsOption label="Date">
            <Text style={{ fontSize: FontSizes.base }}>{getTxnDate(txn)}</Text>
          </TransactionDetailsOption>
          <TransactionDetailsOption label="Transaction ID">
            <Text style={{ fontSize: FontSizes.base }}>
              {trimAddress(txn.hash)}
            </Text>
          </TransactionDetailsOption>
          {txn.fee ? (
            <Option label={<NetworkFeeInfo />}>
              <Text style={{ fontSize: FontSizes.base }}>
                {formatAmount(txn.fee, sei.decimals)} {sei.symbol}
              </Text>
            </Option>
          ) : (
            <></>
          )}
          {txn.memo ? (
            <TransactionDetailsOption label="Memo">
              <Text style={{ fontSize: FontSizes.base }}>{txn.memo}</Text>
            </TransactionDetailsOption>
          ) : (
            <></>
          )}
        </OptionGroup>

        {txn.status === "success" && (
          <TertiaryButton
            onPress={onShowDetails}
            textStyle={{
              fontSize: FontSizes.sm,
              fontFamily: FontWeights.bold,
            }}
            style={{ marginTop: "auto" }}
            iconSize={16}
            title="View details on SEITRACE"
            icon={ExportSquare}
          />
        )}
      </Column>
    </SafeLayout>
  );
}
