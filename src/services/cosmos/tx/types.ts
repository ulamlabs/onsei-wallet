import { StdSignDoc } from "@cosmjs/amino";
import { StdFee } from "@cosmjs/stargate";
import { CosmToken } from "../types";
import { SignDoc as DirectSignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

export type Transfer = {
  token: CosmToken;
  recipient: string;
  intAmount: bigint;
  fee: StdFee;
  memo?: string;
};

export type NFTTransfer = {
  contractAddress: string;
  tokenId: string;
  recipient: string;
  fee: StdFee;
  memo?: string;
};

export type DirectTxnParams = {
  signerAddress: string;
  signDoc: DirectSignDoc;
};

export type AminoTxnParams = {
  signerAddress: string;
  signDoc: StdSignDoc;
};
