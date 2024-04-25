import "globals";
import "react-native-get-random-values";
import "fastestsmallesttextencoderdecoder";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import tw from "@/lib/tailwind";
import { useAccountsStore, useAuthStore, AddressBookProvider } from "@/store";
import { useEffect } from "react";
import { UnlockScreen } from "@/screens/auth";
import MainScreenNavigation from "@/navigation/MainScreenNavigation";

export default function App() {
  useDeviceContext(tw);
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();

  useEffect(() => {
    accountsStore.init();
    authStore.init();
  }, []);

  return (
    <SafeAreaProvider>
      <AddressBookProvider>
        {authStore.state === "locked" && <UnlockScreen />}
        {authStore.state === "noPin" ||
          (authStore.state === "unlocked" && <MainScreenNavigation />)}
      </AddressBookProvider>
    </SafeAreaProvider>
  );
}
