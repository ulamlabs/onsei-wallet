import { Node } from "./types";

export const APP_NAME = "SEI Wallet";

export const AUTH_MAX_ATTEMPTS = 5;
export const AUTH_TIMEOUT_SECONDS = 30;
export const AUTH_MAX_TIMEOUT_SECONDS = 3600 * 24; // one day
export const AUTH_INACTIVITY_LOCK_TIMEOUT = 60 * 2;

export const MNEMONIC_WORDS_COUNT = 24;

export const VALID_ACCOUNT_NAME_REGEX = /^[a-zA-Z0-9 _-]+$/; // Allows only letters, numbers, spaces, hyphens and underscores

export const NODE_URL: Record<Node, string> = {
  MainNet: "sei-apis.com",
  TestNet: "atlantic-2.seinetwork.io",
};
