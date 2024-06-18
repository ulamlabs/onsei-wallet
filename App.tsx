import { Modals } from "@/components";
import { Toasts } from "@/components/toasts";
import { useInactivityLock } from "@/hooks";
import { QueryClientProvider } from "@/modules/query";
import HomeNavigation from "@/navigation/HomeNavigation";
import LockNavigation from "@/navigation/LockNavigation";
import OnboardingNavigation from "@/navigation/OnboardingNavigation";
import { NotificationsListener } from "@/notifications";
import {
  useAccountsStore,
  useAddressBookStore,
  useAuthStore,
  useOnboardingStore,
  useSettingsStore,
  useToastStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "fastestsmallesttextencoderdecoder";
import "globals";
import { useEffect, useMemo, useRef, useState } from "react";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    light: require("./assets/fonts/Satoshi-Light.otf"),
    regular: require("./assets/fonts/Satoshi-Regular.otf"),
    medium: require("./assets/fonts/Satoshi-Medium.otf"),
    bold: require("./assets/fonts/Satoshi-Bold.otf"),
    black: require("./assets/fonts/Satoshi-Black.otf"),
  });
  useInactivityLock();
  const { isConnected } = useNetInfo();
  const prevConnectionState = useRef<boolean | null>(null);
  const { updateBalances } = useTokensStore();
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const addressStore = useAddressBookStore();
  const onboardingStore = useOnboardingStore();
  const settingsStore = useSettingsStore();
  const tokenRegistryStore = useTokenRegistryStore();

  async function onRestore() {
    await tokenRegistryStore.refreshRegistryCache();
    updateBalances();
  }

  useEffect(() => {
    if (isConnected === false && !prevConnectionState.current) {
      info({ description: "No internet connection" });
      prevConnectionState.current = false;
    }
    if (isConnected && prevConnectionState.current === false) {
      success({ description: "Internet connection restored" });
      prevConnectionState.current = true;
      onRestore();
    }
  }, [isConnected]);

  const { info, success } = useToastStore();

  useEffect(() => {
    if (ready && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
  }, [ready, fontsLoaded, fontError]);

  async function init() {
    await settingsStore.init(); // Settings must be initialized before everything else
    await Promise.all([
      accountsStore.init(),
      tokenRegistryStore.init(),
      authStore.init(),
      addressStore.init(),
    ]);
    setReady(true);
  }

  useEffect(() => {
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
    if (!ready || !fontsLoaded || fontError) {
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
          <Toasts />
          {ready && <NotificationsListener />}
        </SafeAreaProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
