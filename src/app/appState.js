import create from "zustand";
import { persist } from "zustand/middleware";
import { LoggerService } from "../../services";

// Log every time state is changed
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      LoggerService.debug(`Applying: ${JSON.stringify(args)}`);
      set(...args);
      LoggerService.debug(`New state: ${JSON.stringify(get())}`);
    },
    get,
    api
  );

const initialAppState = {
  configurationLayer: false,
  errorLayer: "",
};

const initialPersistState = {
  items: [],
};

export const usePersistAppStore = create(
  persist(
    (set, get) =>
      Object.assign(initialPersistState, {
        items: [],
        addItem(text) {
          const items = get().items;
          set({ items: [...items, { text, id: Math.random() }] });
        },
      }),
    {
      name: "app-storage",
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export function usePersistAppStoreReset() {
  usePersistAppStore.setState(initialPersistState);
}

export const useAppStore = create(
  log((set, get) => {
    return Object.assign(initialAppState, {
      configurationLayer: false,
      errorLayer: "",
      showConfigurationLayer: () => set({ configurationLayer: true }),
      hideConfigurationLayer: () => set({ configurationLayer: false }),
      showErrorLayer: (layer) => set({ errorLayer: layer }),
      hideErrorLayer: () => set({ errorLayer: "" }),
    });
  })
);

export function useAppStoreReset() {
  useAppStore.setState(initialAppState);
}
