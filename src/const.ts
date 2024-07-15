import { Node } from "./types";

export const APP_NAME = "onsei wallet";
export const WALLET_ADMIN_ADDRESS =
  "sei1udjj8x82rqws7zcz9c6lv6efvhylv4yvhrlza6";

export const AUTH_MAX_ATTEMPTS = 5;
export const AUTH_TIMEOUT_SECONDS = 30;
export const AUTH_MAX_TIMEOUT_SECONDS = 3600 * 24; // one day
export const AUTH_INACTIVITY_LOCK_TIMEOUT = 60 * 2;

export const MNEMONIC_WORDS_COUNT = 12;
export const MNEMONIC_WORDS_TO_CONFIRM = 3;

export const VALID_ACCOUNT_NAME_REGEX = /^[a-zA-Z0-9 _-]+$/; // Allows only letters, numbers, spaces, hyphens and underscores

export const NODE_URL: Record<Node, string> = {
  MainNet: "sei-apis.com",
  TestNet: "atlantic-2.seinetwork.io",
};

export const NETWORK_NAMES: Record<Node, string> = {
  MainNet: "pacific-1",
  TestNet: "atlantic-2",
};

export const NODES: Node[] = ["MainNet", "TestNet"];
