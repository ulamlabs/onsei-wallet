import React from "react";
import Browser from "./Browser";
import { SafeLayout } from "@/components";
import UrlBar from "./UrlBar";
import DashboardHeader from "@/navigation/header/DashboardHeader";

export default function DApps() {
  return (
    <>
      <DashboardHeader>
        <UrlBar />
      </DashboardHeader>
      <SafeLayout>
        <Browser />
      </SafeLayout>
    </>
  );
}
