import { Loader, Paragraph, SafeLayout } from "@/components";
import { useTransactions } from "@/modules/transactions";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { useAccountsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Pressable, View } from "react-native";
import TransactionList from "./TransactionList";

const blob = require("../../../assets/blob.png");

export default function Transactions() {
  const { width, height } = Dimensions.get("window");
  const rotation = useRef(new Animated.Value(0)).current;
  const scaleContainer = useRef(new Animated.Value(1)).current;
  const scaleBlobs = useRef(new Animated.Value(1)).current;
  const { activeAccount } = useAccountsStore();
  const {
    data: transactions,
    error,
    isLoading,
    refetch,
  } = useTransactions(activeAccount?.address || "");
  const { updateBalances } = useTokensStore();
  const [clicked, setClicked] = useState(0);

  async function refreshApp() {
    await Promise.all([refetch(), updateBalances()]);
  }

  useEffect(() => {
    rotation.setValue(0);
    scaleContainer.setValue(1);
    scaleBlobs.setValue(1);
    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.circle),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleContainer, {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
        Animated.timing(scaleBlobs, {
          toValue: 2,
          duration: 1000,
          easing: Easing.inOut(Easing.circle),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotation, {
        toValue: 0.1,
        duration: 1000,
        easing: Easing.inOut(Easing.circle),
        useNativeDriver: true,
      }),
    ]).start();
  }, [clicked]);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "60deg"],
  });

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Transactions" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 65 }} refreshFn={refreshApp}>
        <View>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Paragraph>Something went wrong</Paragraph>
          ) : (
            <View>
              {transactions && transactions?.length > 0 ? (
                <TransactionList transactions={transactions} />
              ) : (
                <Paragraph style={{ textAlign: "center" }}>
                  No transactions yet
                </Paragraph>
              )}
            </View>
          )}
        </View>
      </SafeLayout>
      <Pressable
        style={{
          width: 50,
          height: 50,
          position: "absolute",
          top: 100,
          left: 50,
          backgroundColor: Colors.text,
          zIndex: 3,
        }}
        onPress={() => setClicked(clicked + 1)}
      ></Pressable>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          transform: [
            { rotate: rotationInterpolate },
            { scale: scaleContainer },
          ],
        }}
      >
        <Animated.Image
          style={{
            position: "absolute",
            top: height / 5,
            left: width / 5,
            width: width,
            transform: [
              { translateX: -(width + 50) / 2 },
              { translateY: -(width + 50) / 2 },
              { scale: scaleBlobs },
            ],
          }}
          source={blob}
          resizeMode="contain"
        />
        <Animated.Image
          style={{
            position: "absolute",
            bottom: height / 12,
            right: width / 5,
            width: width,
            transform: [
              { translateX: (width + 50) / 2 },
              { translateY: (width + 50) / 2 },
              { scale: scaleBlobs },
            ],
          }}
          source={blob}
          resizeMode="contain"
        />
      </Animated.View>
    </>
  );
}
