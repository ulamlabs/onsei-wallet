import { expect } from "detox";
import { importTestAccount, switchToTestnet } from "./utils";

describe("Transfering funds", () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true });
  });

  it("Allows to send funds from one account to another and see it in txn history", async () => {
    await importTestAccount();
    await switchToTestnet();
    await expect(element(by.text("Testnet mode"))).toExist();

    // Add entry to address book
    await element(by.text("Address Book")).tap();
    await waitFor(element(by.id("add-address")))
      .toBeVisible()
      .withTimeout(500);
    await element(by.id("add-address")).tap();
    await element(by.id("Name-input")).typeText("John");
    await element(by.id("Address-input")).typeText(
      "sei1yejm23u6557yafc03dnxrm2ja6jz86ne3aqpnu",
    );
    await element(by.text("Save address")).tap();
    await expect(element(by.text("John"))).toExist();

    // Send funds to saved address
    await element(by.text("Wallet")).tap();
    await waitFor(element(by.text("Send")))
      .toBeVisible()
      .withTimeout(500);
    await element(by.text("Send")).tap();
    await element(by.text("John")).tap();
    await element(by.text("SEI")).tap();
    await element(by.id("digit-0")).tap();
    await element(by.text(".")).tap();
    await element(by.id("digit-0")).tap();
    await element(by.id("digit-1")).tap();
    const memo = "Test memo";
    await element(by.id("input")).typeText(memo);
    // Swipe button in the summary has infinite animation, so the sync of Detox must be disabled for this view
    await device.disableSynchronization();
    await element(by.text("Go to summary")).tap();

    const feeAttr = (await element(
      by.id("network-fee"),
    ).getAttributes()) as any;
    const fee = feeAttr.text as string;
    await element(by.id("swipe-button")).swipe("right", "fast", 0.9, 0.2, 0.99);

    await waitFor(element(by.text("Transaction completed successfully.")))
      .toBeVisible()
      .withTimeout(15 * 1000);
    await element(by.text("Done")).tap();
    await device.enableSynchronization();

    // Check txn in history
    await element(by.text("Transactions")).tap();
    await waitFor(element(by.text("Today")))
      .toBeVisible()
      .withTimeout(500);
    await element(by.id("transaction-0")).atIndex(0).tap();
    await expect(element(by.text("John (sei1y....aqpnu)"))).toExist();
    await expect(element(by.text("-0.01 SEI"))).toExist();
    await expect(element(by.text(fee))).toExist();
    await expect(element(by.text(memo))).toExist();
  });
});
