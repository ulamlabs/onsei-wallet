import "globals";
import "react-native-get-random-values";
import "fastestsmallesttextencoderdecoder";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useAccountsStore,
  useAddressBookStore,
  useAuthStore,
  useOnboardingStore,
  useSettingsStore,
} from "@/store";
import { useEffect, useMemo, useState } from "react";
import LockNavigation from "@/navigation/LockNavigation";
import OnboardingNavigation from "@/navigation/OnboardingNavigation";
import HomeNavigation from "@/navigation/HomeNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { useInactivityLock } from "@/hooks";
import { Modals } from "@/components";

export default function App() {
  const [ready, setReady] = useState(false);

  useInactivityLock();

  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const addressStore = useAddressBookStore();
  const onboardingStore = useOnboardingStore();
  const settingsStore = useSettingsStore();

  useEffect(() => {
    async function init() {
      await Promise.all([
        accountsStore.init(),
        authStore.init(),
        settingsStore.init(),
        addressStore.init(),
      ]);
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
        {getContent()}
        <Modals />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
