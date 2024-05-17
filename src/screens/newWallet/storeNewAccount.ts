import { AccountsStore, Wallet } from "@/store";
import { NavigationProp, NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";

export async function storeNewAccount(
  accountsStore: AccountsStore,
  navigation: NavigationProp,
  wallet: Wallet,
  passphraseSkipped: boolean,
  name?: string,
) {
  let walletName = "Account ";
  if (!name) {
    let i = accountsStore.accounts.length + 1;
    while (accountsStore.accounts.find((a) => a.name === walletName + i)) {
      i++;
    }
    walletName += i;
  }

  await accountsStore.storeAccount(
    name || walletName,
    wallet,
    passphraseSkipped,
  );
  accountsStore.setActiveAccount(wallet.address);

  const nextRoute: keyof NavigatorParamsList =
    navigation.getId() === "onboarding" ? "Protect Your Wallet" : "Home";
  navigation.navigate(nextRoute);
  resetNavigationStack(navigation);
}
