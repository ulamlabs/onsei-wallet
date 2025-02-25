import {
  Column,
  Headline,
  ResultHeader,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import CenteredLoader from "@/components/CenteredLoader";
import {
  NFTTransaction,
  deliverTxResponseToTxResponse,
  parseEvmToNftTransaction,
  parseNftTx,
} from "@/modules/transactions";
import { storeNewNftTransaction } from "@/modules/transactions/storage";
import { transferNFT } from "@/services/cosmos/tx";
import { WalletClientWithPublicActions, getEvmClient } from "@/services/evm";
import { sendEvmNftTx } from "@/services/evm/tx";
import { useAccountsStore, useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isAddress as isEvmAddress } from "viem";

type SendNFTSendingScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Send NFT - Sending"
>;

export default function SendNFTSendingScreen({
  navigation,
  route,
}: SendNFTSendingScreenProps) {
  const { activeAccount, getMnemonic } = useAccountsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    settings: { node },
  } = useSettingsStore();

  const { transfer, nft } = route.params;

  useEffect(() => {
    send();
  }, []);

  async function send() {
    try {
      if (
        transfer.evmTxData?.contractAddress !== "0x" ||
        isEvmAddress(transfer.recipient.address)
      ) {
        const evmClient = await getEvmClient(
          getMnemonic(activeAccount!.address!),
          node === "TestNet",
        );
        const { walletClient } = evmClient;

        if (transfer.evmTxData?.contractAddress !== "0x") {
          await handleEvmNftTransaction(walletClient);
          return;
        }

        if (transfer.evmTransaction !== "0x") {
          await handleEvmRawTransaction(walletClient);
          return;
        }
      }

      await handleCosmosTransaction();
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }

  async function handleEvmNftTransaction(
    walletClient: WalletClientWithPublicActions,
  ) {
    const { contractAddress, privateKey } = transfer.evmTxData!;
    const tx = await sendEvmNftTx(
      contractAddress,
      privateKey,
      transfer.recipient.address as `0x${string}`,
      transfer.memo,
    );

    const transaction = await walletClient.getTransaction({
      hash: tx.hash as `0x${string}`,
    });
    const receipt = await walletClient.waitForTransactionReceipt({
      hash: transaction.hash,
    });

    const parsedTx = parseEvmToNftTransaction(
      transaction,
      nft.collection.contractAddress,
      nft.tokenId,
      receipt.status,
    );
    storeNewNftTransaction(activeAccount!.address, parsedTx);
    navigateToSuccess(tx.hash as `0x${string}`, receipt.status);
  }

  async function handleEvmRawTransaction(
    walletClient: WalletClientWithPublicActions,
  ) {
    const hash = await walletClient.sendRawTransaction({
      serializedTransaction: transfer.evmTransaction!,
    });
    const transaction = await walletClient.getTransaction({ hash });
    const receipt = await walletClient.waitForTransactionReceipt({ hash });
    const parsedTx = parseEvmToNftTransaction(
      transaction,
      nft.collection.contractAddress,
      nft.tokenId,
      receipt.status,
    );
    storeNewNftTransaction(activeAccount!.address, parsedTx);
    navigateToSuccess(hash, receipt.status);
  }

  async function handleCosmosTransaction() {
    console.log("transfer", JSON.stringify(transfer, null, 2));
    const tx = await transferNFT({
      ...transfer,
      contractAddress: nft.collection.contractAddress,
      tokenId: nft.tokenId,
      recipient: transfer.recipient.address,
    });

    console.log("tx", tx);
    const parsedTx = parseNftTx(
      deliverTxResponseToTxResponse(tx),
      transfer.memo,
      transfer.fee?.amount[0].amount,
    );
    console.log("parsedTx", parsedTx);
    if (parsedTx.status === "fail") {
      updateParsedTxWithFailure(parsedTx);
    }
    console.log("ran1");
    storeNewNftTransaction(activeAccount!.address, parsedTx);
    console.log("ran2");
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    console.log("ran3");

    navigation.navigate("Send NFT - Completed", {
      tx,
      nft,
    });
  }

  function updateParsedTxWithFailure(parsedTx: NFTTransaction) {
    parsedTx.from = activeAccount!.address;
    parsedTx.to = transfer.recipient.address;
    parsedTx.contractAddress = nft.collection.contractAddress;
    parsedTx.tokenId = nft.tokenId;
    parsedTx.type = "sent";
  }

  function navigateToSuccess(
    txHash: `0x${string}`,
    status: "success" | "reverted",
  ) {
    const sentTx = {
      code: status === "success" ? 0 : 1,
      transactionHash: txHash,
    };
    navigation.navigate("Send NFT - Completed", {
      tx: sentTx,
      nft,
    });
  }
  function handleClosePress() {
    navigation.navigate("NFT Details", { nft });
    resetNavigationStack(navigation);
  }

  return (
    <SafeLayoutBottom>
      <Column
        style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
      >
        {loading && (
          <CenteredLoader size="large">
            <Headline style={{ marginTop: 16 }}>Sending ...</Headline>
          </CenteredLoader>
        )}
        {error && (
          <>
            <ResultHeader
              type="Fail"
              header="Something went wrong"
              description={error}
            />
            <TertiaryButton onPress={handleClosePress} title="Close" />
          </>
        )}
      </Column>
    </SafeLayoutBottom>
  );
}
