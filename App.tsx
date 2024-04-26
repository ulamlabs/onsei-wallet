import "globals";
import "react-native-get-random-values";
import "fastestsmallesttextencoderdecoder";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import tw from "@/lib/tailwind";
import {
  useAccountsStore,
  useAuthStore,
  AddressBookProvider,
  useOnboardingStore,
} from "@/store";
import { useEffect, useState } from "react";
import LockNavigation from "@/navigation/LockNavigation";
import OnboardingNavigation from "@/navigation/OnboardingNavigation";
import HomeNavigation from "@/navigation/HomeNavigation";

export default function App() {
  const [ready, setReady] = useState(false);

  useDeviceContext(tw);
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const onboardingStore = useOnboardingStore();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await Promise.all([accountsStore.init(), authStore.init()]);
    onboardingStore.init(accountsStore.accounts);
    setReady(true);
  }

  function getContent() {
    if (!ready) {
      return <></>;
    }

    if (onboardingStore.state === "onboarding") {
      return <OnboardingNavigation />;
    }

    if (authStore.state === "locked") {
      return <LockNavigation />;
    }

    if (authStore.state === "noPin" || authStore.state === "unlocked") {
      return <HomeNavigation />;
    }

    return <></>;
  }

  return (
    <SafeAreaProvider>
      <AddressBookProvider>{getContent()}</AddressBookProvider>
    </SafeAreaProvider>
  );
}
