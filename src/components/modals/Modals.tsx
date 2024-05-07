import { ModalInfo, useModalStore } from "@/store";
import { useMemo } from "react";
import ModalAlert from "./ModalAlert";
import ModalQuestion from "./ModalQuestion";

export default function Modals() {
  const modalsStore = useModalStore();

  const modal = useMemo<ModalInfo | null>(() => {
    return modalsStore.modals[0] ?? null;
  }, [modalsStore.modals]);

  if (modal?.type === "alert") {
    return <ModalAlert isVisible={true} alert={modal} />;
  }

  if (modal?.type === "question") {
    return <ModalQuestion isVisible={true} question={modal} />;
  }

  return <></>;
}
