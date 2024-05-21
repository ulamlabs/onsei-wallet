import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { validateAddressBook } from "@/utils/validateInputs";
import { create } from "zustand";
import { useAccountsStore } from "./account";

const ADDRESSBOOK_KEY = "addressBook.json";

export type SavedAddress = {
  address: string;
  name: string;
};

type AddressBookStore = {
  addressBook: SavedAddress[];
  init: () => Promise<void>;
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
  addNewAddress(name, address) {
    const accounts = useAccountsStore.getState().accounts;
    validateAddressBook(name, address, accounts, get().addressBook);
    const updatedBook = [...get().addressBook, { name, address }];
    sortAddresses(updatedBook);
    set(() => ({ addressBook: updatedBook }));
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  },
  editAddress(originalAddress, name, address) {
    const accounts = useAccountsStore.getState().accounts;
    validateAddressBook(name, address, accounts, get().addressBook, false);
    const updatedBook = [...get().addressBook];
    const modifiedEntry = updatedBook.findIndex(
      (a) => a.address === originalAddress,
    );
    updatedBook[modifiedEntry].name = name;
    updatedBook[modifiedEntry].address = address;
    sortAddresses(updatedBook);
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

function sortAddresses(addresses: SavedAddress[]) {
  addresses.sort((a, b) => a.name.localeCompare(b.name));
}
