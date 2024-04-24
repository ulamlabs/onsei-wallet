import "globals";
import "react-native-get-random-values";
import "fastestsmallesttextencoderdecoder";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import tw from "@/lib/tailwind";
import MainScreenNavigation from "@/navigation/MainScreenNavigation";
import AddressBookProvider from "@/store/addressBook";
import { useAccountsStore } from "@/store";
import { useEffect } from "react";

export default function App() {
  useDeviceContext(tw);
  const accountsStore = useAccountsStore();

  useEffect(() => {
    accountsStore.init();
  }, []);

  return (
    <SafeAreaProvider>
      <AddressBookProvider>
        <MainScreenNavigation />
      </AddressBookProvider>
    </SafeAreaProvider>
  );
}
