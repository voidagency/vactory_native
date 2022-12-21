import { useContext } from "react";
import { MenuContext } from "@vactory/context/Menus"

const useMenuContext = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error(
      // eslint-disable-next-line no-undef
      "No menu context found. Have you configured the provider?"
    );
  }

  return context;
};

export const useMenu = (name = "") => {
  const { menus } = useMenuContext();

  if (!name) {
    throw new Error(
      // eslint-disable-next-line no-undef
      "[useMenu] Missing name argument"
    );
  }

  return menus.find((menu) => menu.name === name).items || [];
};
