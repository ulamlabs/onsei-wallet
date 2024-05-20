import { Account } from "@/store";

export const generateWalletName = (accounts: Account[]) => {
  let walletName = "Wallet ";
  let i = accounts.length + 1;
  while (accounts.find((a) => a.name === walletName + i)) {
    i++;
  }
  walletName += i;

  return walletName;
};
