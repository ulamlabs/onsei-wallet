import AccountsList from "@/components/AccountsList";
import Button from "@/components/Button";
import SafeLayout from "@/components/SafeLayout";
import tw from "@/lib/tailwind";
import { BottomTabsParamList } from "@/navigation/BottomBarsNavigation";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { useAccountsStore } from "@/store";
import { formatTokenAmount } from "@/utils/formatAmount";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  DirectboxReceive,
  DirectboxSend,
  Notification,
} from "iconsax-react-native";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type WalletOverviewProps = NativeStackScreenProps<
  MainStackParamList & BottomTabsParamList & ConnectedStackParamList,
  "My wallet"
>;

export default ({ navigation }: WalletOverviewProps) => {
  const { activeAccount, node, getBalance, getUSDBalance } = useAccountsStore();

  function onNotification() {
    //navigation.push('Notifications');
  }

  function onReceive() {
    navigation.push("Receive");
  }
  function onSend() {
    navigation.push("Send");
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        {node === "TestNet" && (
          <View
            style={tw`absolute inset-x-0 mx-auto rounded-2xl bg-warning-500 py-2 px-4`}
          >
            <Text style={tw`text-xs`}>TestNet</Text>
          </View>
        )}
        <Button
          styles={tw`absolute right-0 bg-background`}
          onPress={onNotification}
          icon={<Notification />}
        />
        <Text style={tw`title`}>PORTFOLIO</Text>
        {activeAccount ? (
          <>
            <Text style={tw`text-basic-600 text-xs mb-5`}>
              {activeAccount.address}
            </Text>
            <Text style={tw`text-white text-2xl font-bold`}>
              {formatTokenAmount(getBalance())} SEI
            </Text>
            <Text style={tw`text-basic-600 text-xs`}>
              ${formatTokenAmount(getUSDBalance())}
            </Text>
            <View style={tw`w-full my-8 justify-around items-center flex-row`}>
              <View style={tw`flex-col items-center`}>
                <Button
                  onPress={onReceive}
                  icon={<DirectboxReceive size={20} color="white" />}
                  styles={tw`rounded-full w-12 h-12 justify-center mb-2 p-0`}
                />
                <Text style={tw`text-white text-base`}>Receive</Text>
              </View>
              <View style={tw`flex-col items-center`}>
                <Button
                  onPress={onSend}
                  icon={<DirectboxSend size={20} color="white" />}
                  styles={tw`rounded-full w-12 h-12 justify-center mb-2 p-0`}
                />
                <Text style={tw`text-white text-base`}>Send</Text>
              </View>
            </View>
            <AccountsList />
          </>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    </SafeLayout>
  );
};
