import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAccountsStore } from "@/store/account";
import { Button, SafeLayout } from "@/components";
import { resetNavigationStack } from "@/utils";
import { useInputState } from "@/hooks";
import tw from "@/lib/tailwind";
import { MNEMONIC_WORDS_COUNT } from "@/const";
import { NavigatorParamsList } from "@/types";

type ConfirmMnemoProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Confirm Mnemonic"
>;

type WordDict = {
  word: string;
  wordLabel: number;
};

export default ({
  navigation,
  route: {
    params: { wallet },
  },
}: ConfirmMnemoProps) => {
  const accountsStore = useAccountsStore();
  const [toConfirm, setToConfirm] = useState<WordDict[]>([]);
  const [loading, setLoading] = useState(false);
  const nameInput = useInputState();
  const mnemoInputs = [
    useInputState(),
    useInputState(),
    useInputState(),
    useInputState(),
  ];
  const [error, setError] = useState<string | null>(null);
  const mnemonic = wallet.mnemonic.split(" ");

  useEffect(() => {
    const idsChosen: number[] = [];
    const wordsChosen = [];
    while (wordsChosen.length < 4) {
      const wordId = Math.floor(Math.random() * MNEMONIC_WORDS_COUNT);
      if (idsChosen.includes(wordId)) continue;
      idsChosen.push(wordId);
      wordsChosen.push({ word: mnemonic[wordId], wordLabel: wordId + 1 });
    }
    setToConfirm(wordsChosen);
  }, [wallet.mnemonic]);

  useEffect(() => {
    if (loading) {
      onConfirm();
    }
  }, [loading]);

  function onButtonPress() {
    setError(null);
    setLoading(true);
  }

  async function onConfirm() {
    for (let i = 0; i < 4; i++) {
      if (toConfirm[i].word !== mnemoInputs[i].value.toLowerCase()) {
        setError("Provided words do not match passphrase");
        setLoading(false);
        return;
      }
    }

    try {
      await accountsStore.storeAccount(nameInput.value, wallet);
      accountsStore.setActiveAccount(wallet.address);
      accountsStore.subscribeToAccounts();

      const nextRoute: keyof NavigatorParamsList =
        navigation.getId() === "onboarding" ? "Protect Your Wallet" : "Home";
      navigation.navigate(nextRoute);
      resetNavigationStack(navigation);
    } catch (e: any) {
      console.log("Error on wallet import:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`text-white`}>Name of your wallet</Text>
        <TextInput
          style={tw`input mt-2 w-[90%]`}
          placeholder="Name"
          autoCorrect={false}
          {...nameInput}
        />

        <Text style={tw`mt-10 mb-5 text-white`}>Verify your passphrase</Text>
        <FlatList
          data={toConfirm}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View
              style={tw.style(
                "w-[48%]",
                index % 2 === 0 ? "mr-[2%]" : "ml-[2%]"
              )}
            >
              <Text style={tw`text-white opacity-90`}>
                Word #{item.wordLabel}
              </Text>
              <TextInput
                style={tw`input flex-1 my-2 w-[100%]`}
                autoCapitalize="none"
                autoCorrect={false}
                {...mnemoInputs[index]}
              />
            </View>
          )}
          keyExtractor={(item) => item.word}
        />

        <Button
          label="Confirm"
          styles={tw`mt-5`}
          isLoading={loading}
          onPress={onButtonPress}
        />
        {error && <Text style={tw`mt-2 text-sm text-danger-500`}>{error}</Text>}
      </View>
    </SafeLayout>
  );
};
