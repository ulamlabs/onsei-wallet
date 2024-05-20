import { AccountsStore, Wallet } from "@/store";
import { NavigationProp, NavigatorParamsList } from "@/types";
import { generateWalletName, resetNavigationStack } from "@/utils";

export async function storeNewAccount(
  accountsStore: AccountsStore,
  navigation: NavigationProp,
  wallet: Wallet,
  passphraseSkipped: boolean,
  name?: string,
) {
  await accountsStore.storeAccount(
    name || generateWalletName(accountsStore.accounts),
    wallet,
    passphraseSkipped,
  );
  accountsStore.setActiveAccount(wallet.address);

  const nextRoute: keyof NavigatorParamsList =
    navigation.getId() === "onboarding" ? "Protect Your Wallet" : "Home";
  navigation.navigate(nextRoute);
  resetNavigationStack(navigation);
}
