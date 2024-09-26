import React from "react";
import Browser from "./Browser";
import { SafeLayout } from "@/components";
import UrlBar from "./UrlBar";

export default function DApps() {
  return (
    <SafeLayout>
      <UrlBar />
      <Browser />
    </SafeLayout>
  );
}
