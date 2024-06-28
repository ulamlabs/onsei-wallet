import { Alert } from "@/store";
import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { SecondaryButton } from "../buttons";
import { Column } from "../layout";
import { Headline, Paragraph } from "../typography";
import Modal from "./Modal";
import ModalHeadline from "./ModalHeadline";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  alert: Alert;
};

export default function ModalAlert({ isVisible, alert }: ModalProps) {
  const Icon = alert.options.icon;
  return (
    <Modal isVisible={isVisible} onBackdropPress={() => alert.resolve()}>
      <Column>
        {Icon && <Icon color={Colors.info} size={40} />}
        {alert.options.title &&
          (alert.options.useHeadline ? (
            <ModalHeadline
              title={alert.options.title}
              onClose={() => alert.resolve()}
            />
          ) : (
            <Headline style={{ textAlign: "left" }}>
              {alert.options.title}
            </Headline>
          ))}

        {typeof alert.options.description === "string" ? (
          <Paragraph size="base">{alert.options.description}</Paragraph>
        ) : (
          <View>{alert.options.description}</View>
        )}
        {!alert.options.hideOk && (
          <SecondaryButton
            title={alert.options.ok ?? "OK"}
            style={{ marginVertical: 14 }}
            onPress={() => alert.resolve()}
          />
        )}
      </Column>
    </Modal>
  );
}
