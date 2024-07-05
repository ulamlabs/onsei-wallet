import { AccountsStore, Wallet } from "@/store";
import { NavigationProp, NavigatorParamsList } from "@/types";
import { generateWalletName, resetNavigationStack } from "@/utils";

export async function storeNewAccount(
  accountsStore: AccountsStore,
  navigation: NavigationProp,
  wallet: Wallet,
  passphraseSkipped: boolean,
  addressLinked: boolean,
  name?: string,
) {
  await accountsStore.storeAccount(
    name || generateWalletName(accountsStore.accounts),
    wallet,
    { addressLinked, passphraseSkipped },
  );
  accountsStore.setActiveAccount(wallet.address);

  const nextRoute: keyof NavigatorParamsList =
    navigation.getId() === "onboarding" ? "Finish Onboarding" : "Home";
  navigation.navigate(nextRoute);
  resetNavigationStack(navigation);
}
