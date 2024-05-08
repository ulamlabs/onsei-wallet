import { Paragraph, RadioGroup, SafeLayout } from "@/components";
import { useAccountsStore, useSettingsStore } from "@/store";
import { Node } from "@/types";

const nodes = ["MainNet", "TestNet"] as Node[];

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

      <RadioGroup options={nodes} activeOption={node} onChange={onNodeChange} />
    </SafeLayout>
  );
}
