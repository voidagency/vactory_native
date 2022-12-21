import React, { createContext, useContext } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children, menus = [] }) => {
  return (
    <MenuContext.Provider value={{ menus }}>{children}</MenuContext.Provider>
  );
};
