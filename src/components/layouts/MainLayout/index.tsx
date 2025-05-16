import React from "react";
import { Layout } from "antd";
import { Header, Sidebar } from "@/components/organisms";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/constants";

const { Content } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminProfile, isPending } = useAuth();
  return (
    <LayoutProvider>
      <Layout className="flex" hasSider>
        {/* <Sidebar /> */}
        {adminProfile?.profile.role !== UserType.student ? <Sidebar /> : null}
        <Layout className="flex-1 flex flex-col !bg-neutral9">
          <Header />
          {/* {adminProfile?.profile.role !== UserType.student ? <Header /> : null} */}
          <Content className="h-[calc(100vh-64px)] overflow-y-auto bg-white rounded-tl-[20px]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </LayoutProvider>
  );
}
