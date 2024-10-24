import React from "react";
import { SafeLayout } from "@/components";
import HistoryEntry from "./HistoryEntry";
import { useDAppsStore } from "@/store";

export default function HistoryScreen() {
  const { history } = useDAppsStore();

  return (
    <SafeLayout>
      {history.map((url) => (
        <HistoryEntry key={url} url={url} />
      ))}
    </SafeLayout>
  );
}
