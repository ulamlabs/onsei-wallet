import React from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "iconsax-react-native";
import tw from "@/lib/tailwind";
import { scale } from "@/utils";

export default () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        tw`absolute elevation-3 z-10`,
        {
          top: insets.top,
          left: insets.left + 20,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
      >
        <ArrowLeft size={scale(20)} color={tw.color("primary-400")} />
      </Pressable>
    </View>
  );
};
