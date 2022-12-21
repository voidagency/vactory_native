import create from "zustand";
import { persist } from "zustand/middleware";
import { MemoryStorageService } from "@vactory/services/memory-storage.service";

export const useUserStore = create(
  persist(
    () => ({
      user: null,
    }),
    {
      name: "user-storage",
      getStorage: () => MemoryStorageService,
    }
  )
);

export class UserStore {
  static getUser = () => useUserStore.getState().user;
  static storeUser = (value) => useUserStore.setState({ user: value }); // Overwriting.
  static removeUser = () => useUserStore.setState({ user: null }); // Overwriting.
}
