import { VALID_ACCOUNT_NAME_REGEX } from "@/const";
import { Account, SavedAddress } from "@/store";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";

export const validateEntry = (
  name: string,
  address: string,
  accounts: Account[],
) => {
  validateName(name, accounts);
  validateAddress(address, accounts);
};

export const validateName = (
  name: string,
  accounts: Account[],
  isAddressBook = false,
) => {
  if (!name) {
    throw Error("Name cannot be empty");
  }
  if (name.length > 20) {
    throw new Error("Name cannot be longer than 20 characters");
  }
  if (!VALID_ACCOUNT_NAME_REGEX.test(name)) {
    throw new Error(
      'Name cannot have any special characters except for "_" and "-"',
    );
  }
  if (!isAddressBook && accounts?.find((a) => a.name === name)) {
    throw Error("A wallet with given name already exists");
  }
};

export const validateAddress = (address: string, accounts: Account[]) => {
  if (accounts.find((a) => a.address === address)) {
    throw Error("A wallet with this address already exists");
  }
};

export const validateAddressBook = (
  name: string,
  address: string,
  accounts: Account[],
  addressBook: SavedAddress[],
  newEntry = true,
) => {
  validateName(name, accounts);
  if (!isValidSeiCosmosAddress(address)) {
    throw new Error("Provided address is invalid");
  }
  if (newEntry && addressBook.find((data) => data.name === name)) {
    throw new Error(
      "An entry with given name already exist in your address book",
    );
  }
  if (newEntry && addressBook.find((data) => data.address === address)) {
    throw new Error(
      "An entry with given address already exist in your address book",
    );
  }
  if (accounts.map((a) => a.address).includes(address)) {
    throw new Error("Own address cannot be added to the address book");
  }
};
