import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EnglishMnemonic } from "@cosmjs/crypto";
import { useAccountsStore } from "@/store/account";
import {
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  ShakingView,
  Text,
} from "@/components";
import { getNumberName, shuffle } from "@/utils";
import { MNEMONIC_WORDS_COUNT, MNEMONIC_WORDS_TO_CONFIRM } from "@/const";
import { NavigatorParamsList } from "@/types";
import { Colors } from "@/styles";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import MnemonicButton from "./MnemonicButton";
import { storeNewAccount } from "./storeNewAccount";

type ConfirmMnemoProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Confirm Mnemonic"
>;

export default function ConfirmMnemonicScreen({
  navigation,
  route: {
    params: { wallet },
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
    addSkipButton(navigation, onSkip);
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
      await storeNewAccount(accountsStore, navigation, wallet, skipValidation);
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
    <SafeLayout noScroll={true}>
      <Headline>Confirm Recovery Phrase</Headline>
      {idsToSelect.length === MNEMONIC_WORDS_TO_CONFIRM && (
        <Paragraph style={{ textAlign: "center", marginBottom: 24 }}>
          Tap the {getNumberLabel(idsToSelect[0])},{" "}
          {getNumberLabel(idsToSelect[1])} and {getNumberLabel(idsToSelect[2])}{" "}
          word to verify that you saved your recovery phrase.
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

      <PrimaryButton
        title="Confirm"
        style={{ marginTop: "auto" }}
        onPress={onConfirmButtonPress}
      />
    </SafeLayout>
  );
}
