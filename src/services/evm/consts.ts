export const EVM_RPC_MAIN = "https://evm-rpc.sei-apis.com";
export const EVM_RPC_TEST = "https://evm-rpc.atlantic-2.seinetwork.io/";
export const SZABO = 10n ** 12n; // https://docs.ethers.org/v5/api/utils/display-logic/#display-logic--named-units

export const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
];

export const erc20TransferSignature = "0xa9059cbb"; // ERC-20 transfer function signature
