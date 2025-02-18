export type SkipChain = {
  chain_name: string;
  chain_id: string;
  pfm_enabled: boolean;
  cosmos_module_support: CosmosModuleSupport;
  supports_memo: boolean;
  logo_uri: string;
  bech32_prefix: string;
  fee_assets: FeeAsset[];
  chain_type: string;
  ibc_capabilities: IbcCapabilities;
  is_testnet: boolean;
};

export type FeeAsset = {
  denom: string;
  gas_price: GasPrice;
};

export type GasPrice = {
  low: string;
  average: string;
  high: string;
};

export type IbcCapabilities = {
  cosmos_pfm: boolean;
  cosmos_ibc_hooks: boolean;
  cosmos_memo: boolean;
  cosmos_autopilot: boolean;
};

export type CosmosModuleSupport = {
  authz: boolean;
  feegrant: boolean;
};

export type SkipAsset = {
  denom: string;
  chain_id: string;
  origin_denom: string;
  origin_chain_id: string;
  trace: string;
  is_cw20: boolean;
  is_evm: boolean;
  is_svm: boolean;
  symbol: string;
  name: string;
  logo_uri: string;
  decimals: number;
  coingecko_id?: string;
  recommended_symbol?: string;
};
