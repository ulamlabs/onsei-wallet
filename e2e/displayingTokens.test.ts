import { expect } from "detox";
import { importTestAccount, switchToTestnet } from "./utils";

describe("Displaying tokens", () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
    await importTestAccount();
    await switchToTestnet();
  });

  it("Automatically displays native tokens and allows to hide them or show more", async () => {
    await expect(element(by.text("LLAMA")).atIndex(0)).toExist();
    await element(by.id("safe-layout-scroll-view")).swipe("up", "fast");
    await element(by.text("Manage token list")).tap();

    await element(by.id("WMATIC-switch")).tap();
    await element(by.id("WETH-switch")).tap();
    await element(by.id("input")).typeText("llama");
    await element(by.id("LLAMA-switch")).atIndex(0).tap();

    await element(by.text("Save changes")).tap();

    await expect(element(by.text("LLAMA"))).not.toExist();
    await expect(element(by.text("WMATIC"))).toExist();
    await expect(element(by.text("WETH"))).toExist();
  });

  it("Does not display CW20 tokens but allows to fetch them by contract ID", async () => {
    await expect(element(by.text("MYTA"))).not.toExist();
    await element(by.id("safe-layout-scroll-view")).swipe("up", "fast");
    await element(by.text("Manage token list")).tap();
    await element(by.id("input")).typeText(
      "sei1ctwaptjnwkx863sgsge4lq44rf0dkxr02px9z8vtptwsnj7w0cxqd6tyht",
    );

    await expect(element(by.text("MYTA"))).toExist();
    await element(by.id("MYTA-switch")).tap();
    await element(by.text("Save changes")).tap();

    await expect(element(by.text("MYTA"))).toExist();
  });
});
