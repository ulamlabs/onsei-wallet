import { Modals } from "@/components";
import { useInactivityLock } from "@/hooks";
import { QueryClientProvider } from "@/modules/query";
import HomeNavigation from "@/navigation/HomeNavigation";
import LockNavigation from "@/navigation/LockNavigation";
import OnboardingNavigation from "@/navigation/OnboardingNavigation";
import {
  useAccountsStore,
  useAddressBookStore,
  useAuthStore,
  useOnboardingStore,
  useSettingsStore,
} from "@/store";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "fastestsmallesttextencoderdecoder";
import "globals";
import { useEffect, useMemo, useState } from "react";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Satoshi: require("./assets/fonts/Satoshi.ttf"),
  });
  useInactivityLock();

  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const addressStore = useAddressBookStore();
  const onboardingStore = useOnboardingStore();
  const settingsStore = useSettingsStore();

  useEffect(() => {
    async function init() {
      await settingsStore.init(); // Settings must be initialized before everything else
      await Promise.all([
        accountsStore.init(),
        authStore.init(),
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
    if (!ready && !fontsLoaded) {
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
    <QueryClientProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar style="light" />
          {getContent()}
          <Modals />
        </SafeAreaProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
