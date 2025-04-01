"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type DisclosureContextType = {
  openPopup: (key: string) => void;
  closePopup: (key: string) => void;
  isPopupOpen: (key: string) => boolean;
};

const DisclosureContext = createContext<DisclosureContextType | undefined>(
  undefined
);

export const DisclosureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openPopups, setOpenPopups] = useState<Record<string, boolean>>({});

  const openPopup = useCallback((key: string) => {
    setOpenPopups((prev) => ({ ...prev, [key]: true }));
  }, []);

  const closePopup = useCallback((key: string) => {
    setOpenPopups((prev) => ({ ...prev, [key]: false }));
  }, []);

  const isPopupOpen = useCallback(
    (key: string) => !!openPopups[key],
    [openPopups]
  );

  return (
    <DisclosureContext.Provider value={{ openPopup, closePopup, isPopupOpen }}>
      {children}
    </DisclosureContext.Provider>
  );
};

export const useDisclosure = () => {
  return useContext(DisclosureContext);
};
