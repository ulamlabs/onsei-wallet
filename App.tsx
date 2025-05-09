import "globals"; // it has to be on top to override global settings

import "@walletconnect/react-native-compat"; // This has to be second import. WalletConnet's functions won't work otherwise

import { Modals, SafeLayout, SplashAnimation } from "@/components";
import { Toasts } from "@/components/toasts";
import { useAppIsActive, useInactivityLock } from "@/hooks";
import { QueryClientProvider } from "@/modules/query";
import HomeNavigation from "@/navigation/HomeNavigation";
import LockNavigation from "@/navigation/LockNavigation";
import OnboardingNavigation from "@/navigation/OnboardingNavigation";
import { NotificationsListener } from "@/notifications";
import {
  useAccountsStore,
  useAddressBookStore,
  useAuthStore,
  useDAppsStore,
  useOnboardingStore,
  useSettingsStore,
  useToastStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { Colors } from "@/styles";
import { Web3WalletController } from "@/web3wallet";
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { usePreventScreenCapture } from "expo-screen-capture";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "fastestsmallesttextencoderdecoder";
import { EyeSlash } from "iconsax-react-native";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    light: require("./assets/fonts/Satoshi-Light.otf"),
    regular: require("./assets/fonts/Satoshi-Regular.otf"),
    medium: require("./assets/fonts/Satoshi-Medium.otf"),
    bold: require("./assets/fonts/Satoshi-Bold.otf"),
    black: require("./assets/fonts/Satoshi-Black.otf"),
  });
  useInactivityLock();
  usePreventScreenCapture();
  const { isConnected } = useNetInfo();
  const prevConnectionState = useRef<boolean | null>(null);
  const { updateBalances } = useTokensStore();
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const addressStore = useAddressBookStore();
  const onboardingStore = useOnboardingStore();
  const settingsStore = useSettingsStore();
  const tokenRegistryStore = useTokenRegistryStore();
  const isAppActive = useAppIsActive();
  const dAppsStore = useDAppsStore();
  const nftsGalleryStore = useNFTsGalleryStore();

  async function onRestore() {
    await tokenRegistryStore.refreshRegistryCache();
    updateBalances();
  }

  useEffect(() => {
    if (
      isConnected === false &&
      (!prevConnectionState.current || prevConnectionState.current === true)
    ) {
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
      dAppsStore.init(),
      nftsGalleryStore.init(),
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
      return null;
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

    return null;
  }

  return (
    <QueryClientProvider>
      <NavigationContainer>
        <PostHogProvider
          apiKey="phc_D1lpcIWgwj1vdCk7JkxZgPAmXQHwD9BsIK8e2oXJLo0"
          options={{
            host: "https://eu.i.posthog.com",
          }}
        >
          {!splashFinished && (
            <SplashAnimation onFinish={() => setSplashFinished(true)} />
          )}
          <SafeAreaProvider>
            <PaperProvider>
              {!isAppActive && (
                <SafeLayout
                  containerStyle={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    elevation: 10,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <EyeSlash color={Colors.text} size={100} />
                  </View>
                </SafeLayout>
              )}
              <StatusBar style="light" />
              {getContent()}
              <Modals />
              <Toasts />
              {ready &&
                hasAccounts &&
                onboardingStore.state !== "onboarding" && (
                  <NotificationsListener />
                )}
              <Web3WalletController />
            </PaperProvider>
          </SafeAreaProvider>
        </PostHogProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
