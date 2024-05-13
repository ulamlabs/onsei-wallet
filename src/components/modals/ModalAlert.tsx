import { Alert } from "@/store";
import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { SecondaryButton } from "../buttons";
import { Column } from "../layout";
import { Headline, Paragraph } from "../typography";
import Modal from "./Modal";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  alert: Alert;
};

export default function ModalAlert({ isVisible, alert }: ModalProps) {
  const Icon = alert.options.icon;
  return (
    <Modal isVisible={isVisible}>
      <Column>
        {Icon && <Icon color={Colors.info} size={40} />}
        <Headline style={{ textAlign: "left" }}>{alert.options.title}</Headline>
        <Paragraph>{alert.options.description}</Paragraph>
        <SecondaryButton
          title={alert.options.ok ?? "OK"}
          style={{ marginVertical: 24 }}
          onPress={() => alert.resolve()}
        />
      </Column>
    </Modal>
  );
}
