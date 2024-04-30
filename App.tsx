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
import { useEffect, useMemo, useState } from "react";
import LockNavigation from "@/navigation/LockNavigation";
import OnboardingNavigation from "@/navigation/OnboardingNavigation";
import HomeNavigation from "@/navigation/HomeNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { useInactivityLock } from "@/hooks";

export default function App() {
  const [ready, setReady] = useState(false);

  useDeviceContext(tw);

  useInactivityLock();

  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const onboardingStore = useOnboardingStore();

  useEffect(() => {
    async function init() {
      await Promise.all([accountsStore.init(), authStore.init()]);
      setReady(true);
    }

    init();
  }, []);

  const hasAccounts = useMemo(
    () => accountsStore.accounts.length > 0,
    [accountsStore.accounts],
  );

  useEffect(() => {
    if (ready && onboardingStore.state === "notReady" && !hasAccounts) {
      onboardingStore.startOnboarding();
    }
  }, [ready, onboardingStore, hasAccounts]);

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
    <NavigationContainer>
      <SafeAreaProvider>
        <AddressBookProvider>{getContent()}</AddressBookProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
