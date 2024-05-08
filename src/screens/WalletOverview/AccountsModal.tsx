import { Tooltip } from "@/components";

type Props = {
  children: JSX.Element;
  open: boolean;
};

export default function AccountsModal({ children, open }: Props) {
  return (
    <Tooltip
      toggleElement={children}
      isVisible={open}
      onBackdropPress={}
    ></Tooltip>
  );
}
