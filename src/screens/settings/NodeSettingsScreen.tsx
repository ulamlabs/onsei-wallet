import { Paragraph, RadioGroup, SafeLayout } from "@/components";
import { NODES } from "@/const";
import { useAccountsStore, useSettingsStore } from "@/store";
import { Node } from "@/types";

export default function NodeSettingsScreen() {
  const {
    settings: { node },
    setSetting,
  } = useSettingsStore();
  const { updateAccounts } = useAccountsStore();

  function onNodeChange(newNode: Node) {
    setSetting("node", newNode);
    updateAccounts();
  }

  return (
    <SafeLayout>
      <Paragraph style={{ textAlign: "center", marginBottom: 20 }}>
        Select active node in the wallet
      </Paragraph>

      <RadioGroup options={NODES} activeOption={node} onChange={onNodeChange} />
    </SafeLayout>
  );
}
