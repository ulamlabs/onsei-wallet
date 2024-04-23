import "globals";
import "react-native-get-random-values";
import "fastestsmallesttextencoderdecoder";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import tw from "@/lib/tailwind";
import { useAccountsStore } from "@/store";
import { useEffect } from "react";
import AddressBookProvider from "@/store/addressBook";
import RootScreenNavigation from "@/navigation/RootScreenNavigation";
import { useAuthStore } from "@/store/authStore";
import { UnlockScreen } from "@/screens/auth";

export default function App() {
  useDeviceContext(tw);
  const accountsStore = useAccountsStore();

  useEffect(() => {
    accountsStore.init();
  }, []);

  const authStore = useAuthStore();

  return (
    <SafeAreaProvider>
        <AddressBookProvider>
          {authStore.state === "locked" ? (
            <UnlockScreen />
          ) : (
            <RootScreenNavigation />
          )}
        </AddressBookProvider>
    </SafeAreaProvider>
  );
}
