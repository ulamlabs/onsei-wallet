import { Question } from "@/store";
import { Colors } from "@/styles";
import { PropsWithChildren, useMemo } from "react";
import { Pressable, View } from "react-native";
import { DangerButton, PrimaryButton, TertiaryButton } from "../buttons";
import { CloseIcon } from "../icons";
import { Column, Row } from "../layout";
import { Headline, Paragraph } from "../typography";
import Modal from "./Modal";

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
        {typeof question.options.title === "string" ? (
          <Headline style={question.options.headerStyle}>
            {question.options.title}
          </Headline>
        ) : (
          <Row
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              marginTop: -10,
              justifyContent: "flex-start",
              gap: 24,
              backgroundColor: Colors.background100,
              marginLeft: -10,
              marginRight: -10,
            }}
          >
            {question.options.showCloseButton && (
              <Pressable onPress={onSecondaryPress}>
                <CloseIcon size={13} />
              </Pressable>
            )}
            {question.options.title}
          </Row>
        )}

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
