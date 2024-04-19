import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountContext, AccountContextType } from "@/store/account";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import SafeLayout from "@/components/SafeLayout";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useInputState } from "@/hooks";
import {
  AddressBookContext,
  AddressBookContextType,
} from "../store/addressBook";
import tw from "@/lib/tailwind";

type ConfirmMnemoProps = NativeStackScreenProps<
  MainStackParamList,
  "Confirm Mnemonic"
>;

type WordDict = {
  word: string;
  wordLabel: number;
};

export default ({
  navigation,
  route: {
    params: { mnemonic },
  },
}: ConfirmMnemoProps) => {
  const { fetchAccount, changeActiveAccount, subscribeToAccounts } = useContext(
    AccountContext
  ) as AccountContextType;
  const { validateEntry, addNewAddress } = useContext(
    AddressBookContext
  ) as AddressBookContextType;
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

  useEffect(() => {
    const idsChosen: number[] = [];
    const wordsChosen = [];
    while (wordsChosen.length < 4) {
      const wordId = Math.floor(Math.random() * 12);
      if (idsChosen.includes(wordId)) continue;
      idsChosen.push(wordId);
      wordsChosen.push({ word: mnemonic[wordId], wordLabel: wordId + 1 });
    }
    setToConfirm(wordsChosen);
  }, [mnemonic]);

  useEffect(() => {
    if (loading) {
      onConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function onButtonPress() {
    setError("");
    setLoading(true);
  }

  async function onConfirm() {
    setLoading(true);
    setError(null);

    try {
      validateEntry(nameInput.value);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return;
    }

    for (let i = 0; i < 4; i++) {
      if (toConfirm[i].word !== mnemoInputs[i].value?.toLowerCase()) {
        setError("Provided words do not match passphrase");
        setLoading(false);
        return;
      }
    }

    let newAccount: string;
    try {
      newAccount = await fetchAccount(mnemonic.join(" ").toLowerCase());
    } catch (e: any) {
      console.log("Error on wallet import:", e);
      setError(e.message);
    } finally {
      setLoading(false);
      addNewAddress(nameInput.value, newAccount!);
      changeActiveAccount(newAccount!);
      subscribeToAccounts();
      navigation.navigate("Connected");
    }
  }

  return (
    <SafeLayout>
      <BackButton />
      <View style={tw`items-center`}>
        <Text style={tw`title`}>NEW ACCOUNT</Text>

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
                {...mnemoInputs[index]}
              />
            </View>
          )}
          keyExtractor={(item) => item.word}
        />

        <PrimaryButton
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
