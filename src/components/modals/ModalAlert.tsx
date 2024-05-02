import { PropsWithChildren } from "react";
import Modal from "./Modal";
import { Alert } from "@/store";
import { Column } from "../layout";
import { Headline, Paragraph } from "../typography";
import { SecondaryButton } from "../buttons";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  alert: Alert;
};

export default function ModalAlert({ isVisible, alert }: ModalProps) {
  return (
    <Modal isVisible={isVisible}>
      <Column>
        <Headline>{alert.options.title}</Headline>
        <Paragraph>{alert.options.description}</Paragraph>
        <SecondaryButton
          title={alert.options.ok ?? "OK"}
          onPress={() => alert.resolve()}
        />
      </Column>
    </Modal>
  );
}
