"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";

import { AuthProvider } from "@/contexts/AuthContext";
import { DisclosureProvider } from "@/contexts/DisclosureContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { MainLayout } from "@/components/layouts";
import { AUTH_ROUTES, colors, Routers } from "@/constants";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  // const client = useApolloClient();

  const pathname = usePathname();

  const renderLayout = () => {
    if (AUTH_ROUTES.includes(pathname as Routers)) {
      return <React.Fragment>{children}</React.Fragment>;
    }
    return <MainLayout>{children}</MainLayout>;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Averta Std CY",
          colorPrimary: colors.primary6,
        },
      }}
    >
      {/* <ApolloProvider client={client}> */}
      <AuthProvider>
        <MenuProvider>
          <DisclosureProvider>{renderLayout()}</DisclosureProvider>
        </MenuProvider>
      </AuthProvider>
      <ProgressBar
        height="4px"
        color="black"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {/* </ApolloProvider> */}
    </ConfigProvider>
  );
}
