import { expect } from "detox";

describe("Onboarding", () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true });
  });

  it("Allows to create a new account", async () => {
    await element(by.text("Create new wallet")).tap();
    await element(by.text("Skip")).tap(); // skip PIN

    const mnemoAttr = (await element(
      by.id("mnemonic-list"),
    ).getAttributes()) as any;
    let mnemonic = mnemoAttr.label.split(" ") as string[];
    // label has a form of [1, word1, 2, word2, ...], so we need to remove counters
    mnemonic = mnemonic.filter((x, id) => id % 2 === 1);

    await element(by.text("OK, stored safely")).tap();
    await expect(element(by.id("words-to-verify"))).toBeVisible();

    const wordsAttr = (await element(
      by.id("words-to-verify"),
    ).getAttributes()) as any;
    const neededWords = wordsAttr.text
      .match(/[0-9]+/g)
      .map((word: string) => Number(word) - 1);

    for (const word of neededWords) {
      await element(by.text(mnemonic[word])).tap();
    }

    await element(by.text("Confirm")).tap();
    await element(by.text("Confirm")).tap(); // confirm onboarding
    await expect(element(by.text("Wallet 1"))).toBeVisible();
  });

  it("Allows to import already existing account", async () => {
    await element(by.text("I already have a wallet")).tap();
    await element(by.text("Skip")).tap(); // skip PIN
    await element(by.id("input")).typeText(
      "advice volume warm grass shift start brisk anxiety multiply absurd spoil child",
    );
    await element(by.text("Import")).tap();
    await element(by.id("close-icon")).tap(); // close linking modal
    await element(by.text("Confirm")).tap(); // confirm onboarding
    await expect(element(by.text("Wallet 1"))).toBeVisible();

    // Check if imported addresses are correct
    await element(by.id("address-copy")).tap();
    await expect(element(by.text("Wallet 1 addresses"))).toExist();
    await expect(element(by.text("0xCfD....1A33F"))).toExist();
    await expect(element(by.text("sei1v....nfvnf"))).toExist();
  });

  it("Allows to set up a PIN protection and requires PIN on mnemonic preview", async () => {
    await element(by.text("Create new wallet")).tap();
    const PIN = ["1", "2", "3", "4", "5", "6"];

    // Create PIN
    for (const digit of PIN) {
      await element(by.text(digit)).tap();
    }

    // Make a mistake while confirming
    await element(by.text("8")).tap();
    for (const digit of PIN.slice(1)) {
      await element(by.text(digit)).tap();
    }
    await expect(
      element(by.text("Passcode did not match. Try again.")),
    ).toBeVisible();

    // Confirm the PIN
    for (const digit of PIN) {
      await element(by.text(digit)).tap();
    }

    // PIN should pass, biometric should be the next step. Skip them as it's not possible to test on simulator
    await element(by.text("Maybe later")).tap();
    await element(by.text("Skip")).tap(); // skip mnemonic confirmation
    await element(by.text("Confirm")).tap(); // confirm onboarding

    // Previewing mnemonic should first require PIN entering
    await element(by.text("Wallet 1")).tap();
    await element(by.id("Wallet-1-settings")).tap();
    await element(by.text("Recovery phrase")).tap();
    await expect(element(by.text("Enter your passcode"))).toBeVisible();
  });
});
