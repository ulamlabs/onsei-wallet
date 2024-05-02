import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAccountsStore } from "@/store/account";
import {
  Column,
  Loader,
  PrimaryButton,
  SafeLayout,
  Text,
  TextInput,
} from "@/components";
import { resetNavigationStack } from "@/utils";
import { useInputState } from "@/hooks";
import { MNEMONIC_WORDS_COUNT } from "@/const";
import { NavigatorParamsList } from "@/types";
import { Colors } from "@/styles";

type ConfirmMnemoProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Confirm Mnemonic"
>;

type WordDict = {
  word: string;
  wordLabel: number;
};

export default function ConfirmMnemonicScreen({
  navigation,
  route: {
    params: { wallet },
  },
}: ConfirmMnemoProps) {
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
      console.error("Error on wallet import:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function onButtonPress() {
    setError(null);
    setLoading(true);
  }

  return (
    <SafeLayout>
      <Column>
        <Text>Name of your wallet</Text>
        <TextInput placeholder="Name" autoCorrect={false} {...nameInput} />

        <Text style={{ marginTop: 40 }}>Verify your passphrase</Text>
        <FlatList
          data={toConfirm}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View
              style={[
                { width: "48%" },
                index % 2 === 0 ? { marginRight: "2%" } : { marginLeft: "2%" },
              ]}
            >
              <Text>Word #{item.wordLabel}</Text>
              <TextInput
                style={{ marginTop: 5, marginBottom: 20 }}
                autoCapitalize="none"
                autoCorrect={false}
                {...mnemoInputs[index]}
              />
            </View>
          )}
          keyExtractor={(item) => item.word}
        />

        {loading ? (
          <Loader />
        ) : (
          <PrimaryButton title="Confirm" onPress={onButtonPress} />
        )}

        {error && (
          <Text
            style={{
              marginTop: 10,
              color: Colors.danger,
            }}
          >
            {error}
          </Text>
        )}
      </Column>
    </SafeLayout>
  );
}
