import { Question } from "@/store";
import { Colors } from "@/styles";
import { PropsWithChildren, useMemo } from "react";
import { DangerButton, PrimaryButton, TertiaryButton } from "../buttons";
import { Column } from "../layout";
import { Headline, Paragraph } from "../typography";
import Modal from "./Modal";
import { View } from "react-native";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  question: Question;
};

export default function ModalQuestion({ isVisible, question }: ModalProps) {
  const Icon = question.options.icon;
  const [primaryTitle, secondaryTitle] = useMemo(() => {
    return question.options.primary === "yes"
      ? [question.options.yes, question.options.no]
      : [question.options.no, question.options.yes];
  }, [question]);

  function onPrimaryPress() {
    question.resolve(question.options.primary === "yes");
  }

  function onSecondaryPress() {
    question.resolve(question.options.primary === "no");
  }

  return (
    <Modal isVisible={isVisible}>
      <Column style={{ marginBottom: 24 }}>
        {Icon && <Icon color={Colors.info} size={40} />}
        <Headline style={question.options.headerStyle}>
          {question.options.title}
        </Headline>
        {typeof question.options.question === "string" ? (
          <Paragraph>{question.options.question}</Paragraph>
        ) : (
          <View>{question.options.question}</View>
        )}
        {question.options.danger ? (
          <DangerButton title={primaryTitle} onPress={onPrimaryPress} />
        ) : (
          <PrimaryButton title={primaryTitle} onPress={onPrimaryPress} />
        )}
        <TertiaryButton title={secondaryTitle} onPress={onSecondaryPress} />
      </Column>
    </Modal>
  );
}
