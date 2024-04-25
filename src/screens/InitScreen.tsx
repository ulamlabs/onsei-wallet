import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAccountsStore } from "@/store";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { SafeLayout, PrimaryButton } from "@/components";
import tw from "@/lib/tailwind";

type NewWalletProps = NativeStackScreenProps<MainStackParamList, "Init">;

export default ({ navigation }: NewWalletProps) => {
  const accountsStore = useAccountsStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = (duration = 1500) => {
    // Will change fadeAnim value to 1 in one second
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!navigation.canGoBack() && accountsStore.activeAccount) {
      navigation.navigate("Connected");
    }
  }, [accountsStore.activeAccount, navigation]);

  useEffect(() => {
    fadeIn();
  }, []);

  function onCreateNew() {
    navigation.push("New Wallet");
  }
  function onImport() {
    navigation.push("Import Wallet");
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`mb-30 mt-10 text-3xl font-bold text-white`}>
          SEI WALLET
        </Text>

        <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
          <PrimaryButton label="Create new Account" onPress={onCreateNew} />
          <Text style={tw`my-10 text-white font-bold text-lg`}>OR</Text>
          <PrimaryButton label="Import existing Account" onPress={onImport} />
        </Animated.View>
      </View>
    </SafeLayout>
  );
};
