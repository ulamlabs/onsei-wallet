import { expect } from "detox";

export async function importTestAccount() {
  await element(by.text("I already have a wallet")).tap();
  await element(by.text("Skip")).tap(); // skip pin
  await element(by.id("input")).typeText(
    "advice volume warm grass shift start brisk anxiety multiply absurd spoil child",
  );
  await element(by.text("Import")).tap();
  await element(by.id("close-icon")).tap(); // close linking modal
  await element(by.text("Confirm")).tap(); // confirm onboarding
}

export async function switchToTestnet() {
  await element(by.id("settings")).tap();
  await element(by.text("Network")).tap();
  await element(by.text("TestNet")).tap();
  await device.pressBack();
  await device.pressBack();
  await expect(element(by.text("Testnet mode"))).toExist();
}
