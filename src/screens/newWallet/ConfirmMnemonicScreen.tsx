import {
  Column,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  ShakingView,
  Text,
} from "@/components";
import { MNEMONIC_WORDS_COUNT, MNEMONIC_WORDS_TO_CONFIRM } from "@/const";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import { useAccountsStore } from "@/store/account";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { getNumberName, resetNavigationStack, shuffle } from "@/utils";
import { EnglishMnemonic } from "@cosmjs/crypto";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import MnemonicButton from "./MnemonicButton";
import { storeNewAccount } from "./storeNewAccount";

type ConfirmMnemoProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Confirm Mnemonic"
>;

export default function ConfirmMnemonicScreen({
  navigation,
  route: {
    params: { wallet, name, backup },
  },
}: ConfirmMnemoProps) {
  const accountsStore = useAccountsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mnemonic = wallet.mnemonic.split(" ");

  const [idsToSelect, setIdsToSelect] = useState<number[]>([]);
  const [mnemonicCheck, setMnemonicCheck] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    const mnemoIdsChosen: { word: string; wordId: number }[] = [];

    while (mnemoIdsChosen.length < MNEMONIC_WORDS_TO_CONFIRM) {
      const wordId = Math.floor(Math.random() * MNEMONIC_WORDS_COUNT);
      if (mnemoIdsChosen.find((m) => m.wordId === wordId)) {
        continue;
      }
      mnemoIdsChosen.push({ word: mnemonic[wordId], wordId });
    }

    mnemoIdsChosen.sort((a, b) => a.wordId - b.wordId);

    const wordsChosen = mnemoIdsChosen.map((m) => m.word);
    setMnemonicCheck(wordsChosen.join(","));
    setIdsToSelect(mnemoIdsChosen.map((m) => m.wordId + 1));

    const wordList = EnglishMnemonic.wordlist;

    while (wordsChosen.length < MNEMONIC_WORDS_COUNT) {
      const wordId = Math.floor(Math.random() * wordList.length);
      const word = wordList[wordId];
      if (wordsChosen.includes(word)) {
        continue;
      }
      wordsChosen.push(word);
    }

    setWords(shuffle(wordsChosen));
  }, [wallet.mnemonic]);

  useEffect(() => {
    if (loading) {
      onConfirm();
    }
  }, [loading]);

  useEffect(() => {
    if (!backup) {
      addSkipButton(navigation, onSkip);
    }
  }, [navigation]);

  function onSkip() {
    onConfirm(true);
  }

  async function onConfirm(skipValidation = false) {
    if (!skipValidation) {
      if (selectedWords.join(",") !== mnemonicCheck) {
        setError("Selected words do not match passphrase");
        setLoading(false);
        setSelectedWords([]);
        return;
      }
    }

    try {
      if (backup) {
        accountsStore.confirmMnemonic(wallet.address);
        navigation.navigate("Home");
        resetNavigationStack(navigation);
      } else {
        await storeNewAccount(
          accountsStore,
          navigation,
          wallet,
          skipValidation,
          false,
          name,
        );
      }
    } catch (e: any) {
      console.error("Error on wallet import:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function onWordPress(word: string) {
    setError("");
    if (selectedWords.includes(word)) {
      const updatedWords = [...selectedWords];
      updatedWords.splice(selectedWords.indexOf(word), 1);
      setSelectedWords(updatedWords);
    } else if (selectedWords.length < MNEMONIC_WORDS_TO_CONFIRM) {
      setSelectedWords([...selectedWords, word]);
    }
  }

  function wordToMnemoId(word: string) {
    const id = selectedWords.indexOf(word);
    if (id === -1) {
      return 0;
    }
    return idsToSelect[id];
  }

  function onConfirmButtonPress() {
    setError(null);
    setLoading(true);
  }

  function getNumberLabel(id: number) {
    return `${getNumberName(id).name} (${getNumberName(id).counter})`;
  }

  return (
    <SafeLayout staticView={true}>
      <Column
        style={{ height: "100%", justifyContent: "space-between", gap: 50 }}
      >
        <View>
          <Headline>Confirm Recovery Phrase</Headline>
          {idsToSelect.length === MNEMONIC_WORDS_TO_CONFIRM && (
            <Paragraph
              testID="words-to-verify"
              style={{ textAlign: "center", marginBottom: 24 }}
            >
              Tap the {getNumberLabel(idsToSelect[0])},{" "}
              {getNumberLabel(idsToSelect[1])} and{" "}
              {getNumberLabel(idsToSelect[2])} word to verify that you saved
              your Recovery Phrase.
            </Paragraph>
          )}

          <ShakingView shaking={!!error}>
            <FlatList
              data={words}
              style={{
                paddingTop: 10,
                maxHeight: 400,
                overflow: "visible",
              }}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <MnemonicButton
                  key={index}
                  title={item}
                  selectedAs={wordToMnemoId(item)}
                  onPress={onWordPress}
                />
              )}
              keyExtractor={(item) => item}
            />
          </ShakingView>

          {error && (
            <Text
              style={{
                marginTop: 10,
                color: Colors.danger,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
          )}
        </View>

        <PrimaryButton title="Confirm" onPress={onConfirmButtonPress} />
      </Column>
    </SafeLayout>
  );
}
