import { RadioGroup, SafeLayout } from "@/components";
import { NETWORK_NAMES, NODES } from "@/const";
import { useTransactions } from "@/modules/transactions";
import {
  useAccountsStore,
  useModalStore,
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
  const { alert } = useModalStore();

  async function onNodeChange(newNode: Node) {
    // TODO: to delete
    if (newNode === "MainNet") {
      await alert({
        description:
          "The mainnet is currently unavailable. Stay tuned for updates as we prepare for its upcoming launch!",
        title: "Mainnet Coming Soon!",
      });
      return;
    }
    setSetting("node", newNode);
    await refreshRegistryCache();
    if (activeAccount) {
      loadTokens(activeAccount.address, activeAccount.evmAddress);
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
