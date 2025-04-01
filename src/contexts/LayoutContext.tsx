"use client";

import React, { createContext, useContext, useState } from "react";

interface LayoutContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // const {
  //   loading: provincesLoading,
  //   data: provinces,
  //   refetch: refetchProvinces,
  //   loadMore: loadMoreProvinces,
  //   hasMore: hasMoreProvinces,
  // } = useFetchProvince();

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
