import React, { createContext, useState } from "react";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";

const ADDRESSBOOK_KEY = "ADDRESS-BOOK";

type Props = {
  children: React.ReactNode;
};

export type SavedAddress = {
  address: string;
  name: string;
};

export type AddressBookContextType = {
  addressBook: SavedAddress[];
  initStore: () => Promise<void>;
  validateEntry(name: string, address?: string): void;
  addNewAddress(name: string, address: string): void;
  editAddress(name: string, address: string): void;
  removeAddress(address: string): void;
  clearAddressBook(): void;
};

export const AddressBookContext = createContext<AddressBookContextType | null>(
  null
);

const AddressBookProvider: React.FC<Props> = ({ children }) => {
  const [addressBook, setAddressBook] = useState<SavedAddress[]>([]);

  async function initStore() {
    const loadedAddresses = await loadFromStorage(ADDRESSBOOK_KEY);
    if (loadedAddresses) {
      setAddressBook(loadedAddresses);
    }
  }

  function validateEntry(name: string, address?: string) {
    if (!name) {
      throw new Error("Name is required");
    }
    if (name.length > 20) {
      throw new Error("Name cannot be longer than 20 chars");
    }
    try {
      // TODO: find equivalent in SEI
      // if (address) validateAddress(address);
    } catch (e) {
      throw new Error("Provided address is invalid");
    }
    if (addressBook.find((data) => data.name === name)) {
      throw new Error(
        "An entry with given name already exist in your address book"
      );
    }
  }

  function addNewAddress(name: string, address: string) {
    validateEntry(name, address);
    const updatedBook = [...addressBook, { name, address }];
    setAddressBook(updatedBook);
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  }

  function editAddress(name: string, address: string) {
    validateEntry(name);
    const updatedBook = [...addressBook];
    const modifiedEntry = updatedBook.findIndex((a) => a.address === address);
    updatedBook[modifiedEntry].name = name;
    setAddressBook(updatedBook);
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  }

  function removeAddress(address: string) {
    const updatedBook = addressBook.filter((a) => a.address !== address);
    setAddressBook(updatedBook);
    saveToStorage(ADDRESSBOOK_KEY, updatedBook);
  }

  function clearAddressBook() {
    setAddressBook([]);
    removeFromStorage(ADDRESSBOOK_KEY);
  }

  return (
    <AddressBookContext.Provider
      value={{
        addressBook,
        initStore,
        validateEntry,
        addNewAddress,
        editAddress,
        removeAddress,
        clearAddressBook,
      }}
    >
      {children}
    </AddressBookContext.Provider>
  );
};

export default AddressBookProvider;
