import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { SafeLayout } from "@/components";
import tw from "@/lib/tailwind";
import { AddWallet } from "@/screens/newWallet";

export default () => {
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
    fadeIn();
  }, []);

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`mb-30 mt-10 text-3xl font-bold text-white`}>
          Welcome to Sei Wallet
        </Text>

        <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
          <AddWallet />
        </Animated.View>
      </View>
    </SafeLayout>
  );
};
