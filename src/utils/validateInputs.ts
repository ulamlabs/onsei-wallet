import { VALID_ACCOUNT_NAME_REGEX } from "@/const";
import { Account } from "@/store";

export const validateEntry = (
  name: string,
  address: string,
  accounts: Account[],
) => {
  validateName(name, accounts);
  if (accounts.find((a) => a.address === address)) {
    throw Error("An account with this address already exists");
  }
};

export const validateName = (name: string, accounts: Account[]) => {
  if (!name) {
    throw Error("Name cannot be empty");
  }
  if (name.length > 20) {
    throw new Error("Name cannot be longer than 20 chars");
  }
  if (!VALID_ACCOUNT_NAME_REGEX.test(name)) {
    throw new Error(
      'Name cannot have any special characters except for "_" and "-"',
    );
  }
  if (accounts.find((a) => a.name === name)) {
    throw Error("An account with given name already exists");
  }
};
