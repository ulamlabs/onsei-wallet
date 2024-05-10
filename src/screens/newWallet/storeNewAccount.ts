import { AccountsStore, Wallet } from "@/store";
import { NavigationProp, NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";

export async function storeNewAccount(
  accountsStore: AccountsStore,
  navigation: NavigationProp,
  wallet: Wallet,
  skipValidation: boolean,
) {
  let walletName = "Account ";
  let i = accountsStore.accounts.length + 1;
  while (accountsStore.accounts.find((a) => a.name === walletName + i)) {
    i++;
  }
  walletName += i;

  await accountsStore.storeAccount(walletName, wallet, skipValidation);
  accountsStore.setActiveAccount(wallet.address);

  const nextRoute: keyof NavigatorParamsList =
    navigation.getId() === "onboarding" ? "Protect Your Wallet" : "Home";
  navigation.navigate(nextRoute);
  resetNavigationStack(navigation);
}
