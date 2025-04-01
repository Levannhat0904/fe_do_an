import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

const MenuContext = createContext<{
  activeKey: string;
  setActiveKey: any;
}>({
  activeKey: "",
  setActiveKey: () => {},
});

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const defaultSelectedKeys = `/${pathname?.split("/")[1]}`;
  const [activeKey, setActiveKey] = useState<string>(defaultSelectedKeys);

  return (
    <MenuContext.Provider
      value={{
        activeKey,
        setActiveKey,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export function useMenu() {
  return useContext(MenuContext);
}
