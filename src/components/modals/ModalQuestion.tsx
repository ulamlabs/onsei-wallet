import { Question } from "@/store";
import { Colors } from "@/styles";
import { PropsWithChildren, useMemo } from "react";
import { View } from "react-native";
import { DangerButton, PrimaryButton, TertiaryButton } from "../buttons";
import { Column } from "../layout";
import { Paragraph } from "../typography";
import Modal from "./Modal";
import ModalHeadline from "./ModalHeadline";

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
        <ModalHeadline
          title={question.options.title}
          onClose={onSecondaryPress}
        />
        {typeof question.options.question === "string" ? (
          <Paragraph
            style={{ textAlign: "center", marginVertical: 20 }}
            size="base"
          >
            {question.options.question}
          </Paragraph>
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
