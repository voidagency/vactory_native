import { createContext, useContext } from "react";


export const AppConfigContext = createContext();

export function useAppConfig() {
  return useContext(AppConfigContext);
}
