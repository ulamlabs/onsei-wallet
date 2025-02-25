import {
  Box,
  Loader,
  NetworkFeeInfo,
  Option,
  OptionGroup,
  SafeLayout,
  SwipeButton,
  Text,
} from "@/components";
import { NFTGalleryCard } from "../NFTsGalleryList";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Colors } from "@/styles";
import { FontSizes } from "@/styles";
import { FontWeights } from "@/styles";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGasPrice } from "@/hooks";
import { estimateNftTransferFee } from "@/services/cosmos/tx";
import { simulateEvmNftTx } from "@/services/evm/tx";
import { useAccountsStore, useTokensStore } from "@/store";
import { checkFundsForFee, formatAmount, trimAddress } from "@/utils";
import { StdFee } from "@cosmjs/stargate";
import { useEffect, useMemo, useState } from "react";
import { isAddress as isEvmAddress } from "viem";

type DetailItem = {
  label: string;
  value: string;
  info?: string;
};

type SendNFTConfirmScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Send NFT - Confirm"
>;

export default function SendNFTConfirmScreen({
  navigation,
  route: {
    params: { nft, memo, transfer },
  },
}: SendNFTConfirmScreenProps) {
  const insets = useSafeAreaInsets();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const data = [
    {
      label: "To",
      value: transfer.recipient.name || trimAddress(transfer.recipient.address),
    },
    {
      label: "Memo",
      value: memo,
    },
  ] satisfies DetailItem[];

  const { sei, updateBalances, tokenMap } = useTokensStore();
  const [estimationFailed, setEstimationFailed] = useState(false);
  const [fee, setFee] = useState<StdFee | null>(null);
  const { activeAccount, getMnemonic } = useAccountsStore();

  const { gasPrice } = useGasPrice();

  useEffect(() => {
    console.log("transfer.fee", transfer.fee);
    feeEstimation();
  }, []);

  const token = tokenMap.get(sei.id);

  const feeInt = fee ? BigInt(fee.amount[0].amount) : 0n;

  const hasFundsForFee = useMemo(() => {
    return checkFundsForFee(
      fee,
      sei.balance,
      nft.collection.contractAddress,
      sei.id,
      1n,
    );
  }, [fee, sei.balance]);

  async function feeEstimation() {
    console.log("feeEstimation");
    if (!token) {
      return;
    }
    setFee(null);
    setEstimationFailed(false);

    updateBalances([sei]);

    if (isEvmAddress(transfer.recipient.address)) {
      simulateEvmNftTx(
        getMnemonic(activeAccount!.address!),
        transfer.recipient.address as `0x${string}`,
        nft.collection.contractAddress as `0x${string}`,
        nft.tokenId,
      )
        .then((simulation) => setFee(simulation.stdFee))
        .catch((e) => {
          console.log("error1", e);
          console.log(JSON.stringify(e.stack, null, 2));
          setEstimationFailed(true);
        });
      return;
    }

    try {
      const estimatedFee = await estimateNftTransferFee(
        transfer.recipient.address,
        nft.collection.contractAddress,
        nft.tokenId,
        gasPrice,
      );
      setFee(estimatedFee);
    } catch (e) {
      if (e instanceof Error) {
        console.log("error2", e);
        console.log(JSON.stringify(e.stack, null, 2));
      } else {
        console.log("error2", e);
      }
      setEstimationFailed(true);
    }
  }

  function handleSwipeCompleted() {
    if (!fee) {
      return;
    }
    navigation.navigate("Send NFT - Sending", {
      nft,
      memo,
      transfer: {
        ...transfer,
        fee,
      },
    });
  }

  function getFeeElement() {
    console.log(fee, estimationFailed);
    if (fee) {
      return (
        <Text testID="network-fee">
          {formatAmount(feeInt, sei.decimals)} SEI
        </Text>
      );
    }

    if (estimationFailed) {
      return (
        <Text style={{ color: Colors.danger }}>Fee estimation failed</Text>
      );
    }

    return <Loader size="medium" />;
  }

  return (
    <SafeLayout
      subScreen
      scrollEnabled={scrollEnabled}
      refreshFn={feeEstimation}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <NFTGalleryCard nft={nft} />
      </View>
      <OptionGroup style={{ marginTop: 32 }}>
        {data.map((item) => (
          <Box key={item.label} style={styles.item}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value || "-"}</Text>
          </Box>
        ))}
        <Option label={<NetworkFeeInfo />}>{getFeeElement()}</Option>
      </OptionGroup>

      {fee && !hasFundsForFee && (
        <Text
          style={{ color: Colors.danger, textAlign: "center", marginTop: 20 }}
        >
          Not enough SEI for fee.
        </Text>
      )}
      <View style={{ marginTop: "auto", paddingBottom: insets.bottom }}>
        <SwipeButton
          title="Swipe to send"
          onSuccess={handleSwipeCompleted}
          disabled={!fee || !hasFundsForFee}
          setScrolling={setScrollEnabled}
        />
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 0,
  },
  label: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text100,
  },
  value: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.base,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.text,
  },
});
