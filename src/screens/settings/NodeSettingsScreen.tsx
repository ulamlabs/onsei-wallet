import { Paragraph, RadioGroup, SafeLayout } from "@/components";
import { NODES } from "@/const";
import {
  useAccountsStore,
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
import { Node } from "@/types";

export default function NodeSettingsScreen() {
  const {
    settings: { node },
    setSetting,
  } = useSettingsStore();
  const { activeAccount } = useAccountsStore();
  const { loadTokens } = useTokensStore();
  const { refreshRegistryCache } = useTokenRegistryStore();

  function onNodeChange(newNode: Node) {
    setSetting("node", newNode);
    refreshRegistryCache();
    if (activeAccount) {
      loadTokens(activeAccount.address);
    }
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
