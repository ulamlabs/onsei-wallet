import { RadioGroup, SafeLayout } from "@/components";
import { NETWORK_NAMES, NODES } from "@/const";
import { useTransactions } from "@/modules/transactions";
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
  const { refetch: refetchTransactions } = useTransactions(
    activeAccount!.address,
  );

  async function onNodeChange(newNode: Node) {
    setSetting("node", newNode);
    await refreshRegistryCache();
    if (activeAccount) {
      loadTokens(activeAccount.address);
      refetchTransactions();
    }
  }

  const options = NODES.map((name) => ({
    name,
    subtitle: NETWORK_NAMES[name],
    description:
      name === "MainNet"
        ? "Make a real transactions on a blockchain with actual value."
        : "Make a test transactions that have no real value.",
  }));

  return (
    <SafeLayout>
      <RadioGroup
        options={options}
        activeOption={node}
        onChange={onNodeChange}
      />
    </SafeLayout>
  );
}
