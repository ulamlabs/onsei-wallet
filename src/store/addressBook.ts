import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";
import { useAccountsStore } from "./account";
import { VALID_ACCOUNT_NAME_REGEX } from "@/const";

const ADDRESSBOOK_KEY = "addressBook.json";

export type SavedAddress = {
  address: string;
  name: string;
};

type AddressBookStore = {
  addressBook: SavedAddress[];
  init: () => Promise<void>;
  validateEntry(name: string, address: string, newEntry?: boolean): void;
  addNewAddress(name: string, address: string): void;
  editAddress(originalAddress: string, name: string, address: string): void;
  removeAddress(address: string): void;
  clearAddressBook(): void;
};

export const useAddressBookStore = create<AddressBookStore>((set, get) => ({
  addressBook: [],
  init: async () => {
    const loadedAddresses = await loadFromStorage(ADDRESSBOOK_KEY, []);
    set(() => ({ addressBook: loadedAddresses }));
  },
  validateEntry(name, address, newEntry = true) {
    if (!name) {
      throw new Error("Name is required");
    }
    if (name.length > 20) {
      throw new Error("Name cannot be longer than 20 chars");
    }
    if (!VALID_ACCOUNT_NAME_REGEX.test(name)) {
      throw new Error(
        'Name cannot have any special characters except for "_" and "-"',
      );
    }
    if (!isValidSeiCosmosAddress(address)) {
      throw new Error("Provided address is invalid");
    }
    if (newEntry && get().addressBook.find((data) => data.name === name)) {
      throw new Error(
        "An entry with given name already exist in your address book",
      );
    }
    if (
      newEntry &&
      get().addressBook.find((data) => data.address === address)
    ) {
      throw new Error(
        "An entry with given address already exist in your address book",
      );
    }
    if (
      useAccountsStore
        .getState()
        .accounts.map((a) => a.address)
        .includes(address)
    ) {
      throw new Error("Own address cannot be added to the address book");
    }
  },
  addNewAddress(name, address) {
    get().validateEntry(name, address);
    const updatedBook = [...get().addressBook, { name, address }];
    set(() => ({ addressBook: updatedBook }));
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  },
  editAddress(originalAddress, name, address) {
    get().validateEntry(name, address, false);
    const updatedBook = [...get().addressBook];
    const modifiedEntry = updatedBook.findIndex(
      (a) => a.address === originalAddress,
    );
    updatedBook[modifiedEntry].name = name;
    updatedBook[modifiedEntry].address = address;
    set(() => ({ addressBook: updatedBook }));
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  },
  removeAddress(address) {
    const updatedBook = get().addressBook.filter((a) => a.address !== address);
    set(() => ({ addressBook: updatedBook }));
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  },
  clearAddressBook() {
    set(() => ({ addressBook: [] }));
    removeFromStorage(ADDRESSBOOK_KEY);
  },
}));
