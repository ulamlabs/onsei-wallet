export type BridgeEnum = "Skip" | "Squid" | "Symbiosis";

export type ChainId = string;
export type AssetId = string; // chain id and asset address concatenated with "-", for native tokens (e.g. ETH on Ethereum) special address is used

export type MergedChain = {
  bridges: BridgeEnum[];
  chainIconUri: string;
  chainId: ChainId;
  chainName: string;
};

export type MergedAsset = {
  assetIconUri: string;
  assetId: AssetId;
  bridges: BridgeEnum[];
  chainId: ChainId;
  coingeckoId?: string;
  decimals: number;
  name: string;
  skipDenom?: string;
  squidAddress?: string;
  symbiosisAddress?: string;
  symbol: string;
};

export type MergedRoute = {
  bridge: BridgeEnum;
  expectedReceive: string;
  expectedReceiveUsd: string;
  expectedTime?: number;
  minReceive?: string;
};

export type RouteParams = {
  amount: string;
  fromAsset: MergedAsset;
  fromChain: ChainId;
  toAsset: MergedAsset;
  toChain: ChainId;
};
