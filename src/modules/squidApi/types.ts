export type SquidChain = {
  chainName: string;
  chainType: string;
  rpc: string;
  networkName: string;
  chainId: number | string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
  };
  swapAmountForGas: string;
  chainIconURI: string;
  blockExplorerUrls: string[];
  chainNativeContracts: {
    wrappedNativeToken: string;
    ensRegistry: string;
    multicall: string;
    usdcToken: string;
  };
  axelarContracts: {
    gateway: string;
    forecallable: string;
  };
  compliance: {
    trmIdentifier: string;
  };
  estimatedRouteDuration: number;
  estimatedExpressRouteDuration: number;
};

// /sdk-info endpoints returns extra information about chain
export type SquidSdkChain = SquidChain & {
  squidContracts: {
    squidRouter: string;
    defaultCrosschainToken: string;
    squidMulticall: string;
    squidFeeCollector: string;
  };
};

export type SquidToken = {
  chainId: number | string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  coingeckoId: string;
  ibcDenom: string;
  pathKey: string;
};
