import { Colors, FontSizes } from "@/styles";
import { FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SectionList, StyleSheet, View } from "react-native";
import {
  ClipboardAddressBox,
  Column,
  EmptyList,
  IconButton,
  Loader,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  SmallButton,
  Text,
  TextInput,
} from "@/components";
import { useGasPrice, useInputState } from "@/hooks";
import {
  useAccountsStore,
  useAddressBookStore,
  useToastStore,
  useTokensStore,
} from "@/store";
import { checkFundsForFee, formatAmount, isCorrectAddress } from "@/utils";
import { Scan, Send2, TickCircle } from "iconsax-react-native";
import { useEffect, useMemo, useState } from "react";
import AddressBox from "@/screens/transfer/AddressBox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Image from "@/components/Image";
import { formatTokenId, getNFTImage, getNFTName } from "../utils";
import getChain from "@/utils/getChain";
import {
  estimateTransferFeeWithGas,
  estimateTransferGas,
} from "@/services/cosmos/tx";
import { simulateEvmNftTx } from "@/services/evm/tx";
import { StdFee } from "@cosmjs/stargate";
import TransferAmount from "@/screens/transfer/TransferAmount";
import { isAddress as isEvmAddress } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getSigningClientAndSender } from "@/services/cosmos/tx/getSigningClientAndSender";

type SendNFTAddressScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Send NFT - Address"
>;

export default function SendNFTAddressScreen({
  navigation,
  route: {
    params: { nft, address },
  },
}: SendNFTAddressScreenProps) {
  const insets = useSafeAreaInsets();
  const searchInput = useInputState();
  const memoInput = useInputState();
  const { tokenMap, updateBalances, sei } = useTokensStore();
  const [loadingFee, setLoadingFee] = useState(false);
  const [estimationFailed, setEstimationFailed] = useState(false);
  const signingClientAndSender = useQuery({
    queryKey: ["signingClientAndSender"],
    queryFn: getSigningClientAndSender,
  });
  const { gasPrice } = useGasPrice();
  const {
    accounts: allAccounts,
    activeAccount,
    getMnemonic,
  } = useAccountsStore();
  const { addressBook: allAddressBook } = useAddressBookStore();
  const [addressBook, setAddressBook] = useState(allAddressBook);
  const [yourAddresses, setYourAddresses] = useState(allAccounts);
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const allAddresses = [
    ...allAddressBook.map((address) => address.address),
    ...allAccounts.map((account) => account.address),
  ];
  const [gas, setGas] = useState(0);
  const [fee, setFee] = useState<StdFee | null>(null);
  const { error } = useToastStore();
  const [evmTxData, setEvmTxData] = useState<{
    privateKey: `0x${string}`;
    contractAddress: `0x${string}`;
  }>({
    privateKey: `0x`,
    contractAddress: `0x`,
  });

  const typedAddress = useMemo(() => {
    if (isCorrectAddress(searchInput.value)) {
      return searchInput.value;
    }
    return "";
  }, [searchInput.value]);

  const recipientName = useMemo(() => {
    return [...allAddressBook, ...allAccounts].find(
      (address) => address.address === typedAddress,
    )?.name;
  }, [allAccounts, allAddressBook, typedAddress]);
  const recipient = useMemo(
    () => ({ address: typedAddress, name: recipientName }),
    [recipientName, typedAddress],
  );

  useEffect(() => {
    const termLowered = searchInput.value.toLowerCase();
    const addressBook = allAddressBook.filter((a) =>
      a.name.toLowerCase().includes(termLowered),
    );
    const yourAddresses = allAccounts.filter(
      (a) =>
        a.address !== activeAccount?.address &&
        a.name.toLowerCase().includes(termLowered),
    );
    setAddressBook(addressBook);
    setYourAddresses(yourAddresses);
    setIsInvalidAddress(false);
  }, [activeAccount?.address, allAccounts, allAddressBook, searchInput.value]);

  useEffect(() => {
    if (address) {
      searchInput.onChangeText(address);
    }
  }, [address, searchInput]);

  const sameAddressError = useMemo(
    () =>
      typedAddress === activeAccount?.address ||
      typedAddress === activeAccount?.evmAddress,
    [activeAccount?.address, activeAccount?.evmAddress, typedAddress],
  );

  useEffect(() => {
    feeEstimation();

    return () => {
      setFee(null);
      setGas(0);
    };
  }, []);

  const token = useMemo(() => tokenMap.get(sei.id)!, [sei.id, tokenMap]);

  const hasFunds = useMemo(() => token.balance >= 1n, []);

  const feeInt = useMemo(() => {
    if (fee) {
      return BigInt(fee.amount[0].amount);
    }
    return 0n;
  }, [fee]);

  const hasFundsForFee = useMemo(() => {
    return checkFundsForFee(
      fee,
      sei.balance,
      nft.collection.contractAddress,
      sei.id,
      1n,
    );
  }, [fee, nft.collection.contractAddress, sei.balance, sei.id]);

  useEffect(() => {
    navigation.setParams({ gas });
  }, [gas, navigation]);

  useEffect(() => {
    if (!gas) {
      return;
    }
    setFee(estimateTransferFeeWithGas(gasPrice, gas));
  }, [gas, gasPrice]);
  console.log("gas1", gas);
  async function feeEstimation() {
    console.log("feeEstimation");
    try {
      if (!typedAddress) {
        return;
      }
      if (isEvmAddress(recipient.address)) {
        const simulation = await simulateEvmNftTx(
          getMnemonic(activeAccount!.address!),
          recipient.address as `0x${string}`,
          nft.collection.contractAddress as `0x${string}`,
          nft.tokenId,
        );

        setFee(simulation.stdFee);

        setEvmTxData(simulation.dataForTx);
        return simulation.stdFee;
      }
      const gas = await estimateTransferGas(
        recipient.address,
        token,
        1n,
        signingClientAndSender.data,
      );
      console.log("gas2", gas);
      setGas(gas);
      const estimatedFee = estimateTransferFeeWithGas(gasPrice, gas);
      setFee(estimatedFee);
      return estimatedFee;
    } catch (err: any) {
      console.log("feeEstimation error", err);
      setEstimationFailed(true);
      if (
        err.details?.includes("gas") ||
        err.details?.includes("insufficient")
      ) {
        setFee({
          amount: [{ amount: `${sei.balance + 1n}`, denom: "usei" }],
          gas: "",
        });
        return;
      }
      error({ description: `${err}` });
    } finally {
      setLoadingFee(false);
    }
  }

  function select(recipientAddress: string) {
    searchInput.onChangeText(recipientAddress);
  }

  function validateTypedAddress() {
    if (isCorrectAddress(typedAddress)) {
      const transfer = {
        recipient,
        tokenId: nft.tokenId,
        memo: memoInput.value,
        contractAddress: nft.collection.contractAddress,
        fee,
        evmTxData,
      };
      console.log("transfer", transfer);

      navigation.navigate("Send NFT - Confirm", {
        transfer,
        nft,
        memo: memoInput.value,
      });
    } else {
      setIsInvalidAddress(true);
    }
  }

  function getFeeElement() {
    if (!hasFundsForFee && fee) {
      return (
        <Paragraph style={{ color: Colors.danger }}>
          Insufficient funds for fee
        </Paragraph>
      );
    }

    if (fee) {
      return <Paragraph>{formatAmount(feeInt, sei.decimals)} SEI</Paragraph>;
    }

    if (estimationFailed) {
      return <Paragraph>-</Paragraph>;
    }
    if (loadingFee) {
      return <Loader size="small" />;
    }

    return <Paragraph>0 SEI</Paragraph>;
  }

  function scanCode() {
    navigation.navigate("Scan QR code");
  }

  function addToAddressBook() {
    navigation.navigate("Saved Address", { address: typedAddress });
  }
  function refreshFn() {
    updateBalances();
    feeEstimation();
  }
  return (
    <SafeLayout subScreen staticView={true} refreshFn={refreshFn}>
      <Column>
        <Row style={{ gap: 10 }}>
          <TextInput
            placeholder="Type name or address"
            {...searchInput}
            autoCorrect={false}
            onFocus={() => setAddressFocused(true)}
            onBlur={() => setAddressFocused(false)}
            showClear
            containerStyle={{ flex: 1 }}
          />
          <IconButton
            style={{
              height: 51,
              width: 51,
              backgroundColor: Colors.tokenBoxBackground,
              borderWidth: 1,
              borderColor: Colors.inputBorderColor,
            }}
            iconSize={24}
            icon={Scan}
            onPress={scanCode}
          />
        </Row>
        {isInvalidAddress && (
          <Text style={{ color: Colors.danger }}>Invalid SEI address</Text>
        )}

        {typedAddress && !sameAddressError && (
          <Row style={{ justifyContent: "flex-start" }}>
            <TickCircle variant="Bold" color={Colors.success} />
            <Text style={{ color: Colors.success }}>
              {["Correct", getChain(typedAddress), "address"].join(" ")}
            </Text>
          </Row>
        )}

        {sameAddressError && (
          <Paragraph style={{ textAlign: "center" }}>
            Sender and receiver cannot be the same address
          </Paragraph>
        )}

        {addressFocused && (
          <ClipboardAddressBox
            onPaste={(content) => {
              searchInput.onChangeText(content);
              setAddressFocused(false);
            }}
          />
        )}

        {addressBook.length === 0 &&
          yourAddresses.length === 0 &&
          typedAddress &&
          !allAddresses.includes(typedAddress) && (
            <SmallButton
              onPress={addToAddressBook}
              title="Add to address book"
              style={{ marginRight: 61 }}
            />
          )}
      </Column>
      <View style={{ flex: 1 }}>
        <SectionList
          stickySectionHeadersEnabled={false}
          ListFooterComponent={<View style={{ height: 70 }} />}
          sections={[
            { title: "My Wallets", data: yourAddresses },
            { title: "Address book", data: addressBook },
          ]}
          renderItem={(data) => (
            <AddressBox
              address={data.item}
              onPress={select}
              key={data.item.address}
              style={{ marginBottom: 10 }}
            />
          )}
          renderSectionHeader={(data) => {
            return data.section.data.length > 0 ? (
              <Text
                style={{
                  fontFamily: FontWeights.regular,
                  marginTop: 15,
                  marginBottom: 16,
                  color: Colors.text100,
                }}
              >
                {data.section.title}
              </Text>
            ) : null;
          }}
        />

        {addressBook.length === 0 &&
          yourAddresses.length === 0 &&
          !typedAddress &&
          searchInput.value &&
          !isInvalidAddress && (
            <View style={{ height: "100%" }}>
              <EmptyList
                title="No addresses found"
                description="No addresses matching the criteria"
              />
            </View>
          )}
      </View>
      <View
        style={[
          styles.elevateContent,
          {
            bottom: insets.bottom + insets.top + -8,
          },
        ]}
      >
        <TransferAmount
          style={{ flex: 0 }}
          token={token}
          decimalAmount="1"
          error={!hasFunds}
        />
        <Paragraph>Network fee: {getFeeElement()}</Paragraph>

        <View style={styles.nftPreview}>
          <Send2 size={16} color={Colors.text100} />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Image
              src={getNFTImage(nft)}
              style={styles.nftPreviewImage}
              placeholder={{
                text: "No image",
                textStyle: styles.nftPreviewImagePlaceholder,
              }}
            />
            <View style={styles.nftPreviewContent}>
              <Text style={styles.nftPreviewTitle}>{getNFTName(nft)}</Text>
              <Text style={styles.nftPreviewSubtitle}>
                {formatTokenId(nft.tokenId)}
              </Text>
            </View>
          </View>
        </View>
        <TextInput placeholder="Add memo (optional)" {...memoInput} />
        <PrimaryButton
          title="Next"
          onPress={validateTypedAddress}
          disabled={!searchInput.value || isInvalidAddress || sameAddressError}
        />
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  elevateContent: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingTop: 24,
    paddingBottom: 64,
    gap: 16,
    backgroundColor: Colors.background,
  },
  nftPreview: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  nftPreviewContent: {
    gap: 2,
  },
  nftPreviewImage: {
    width: 42,
    aspectRatio: 1,
    backgroundColor: Colors.background100,
    borderRadius: 14,
  },
  nftPreviewImagePlaceholder: {
    fontSize: 10,
    textAlign: "center",
  },
  nftPreviewTitle: {
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.base,
    lineHeight: 19.2,
    letterSpacing: 0,
    color: Colors.text,
  },
  nftPreviewSubtitle: {
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.sm,
    lineHeight: 21,
    letterSpacing: 0,
    color: Colors.text100,
  },
});
