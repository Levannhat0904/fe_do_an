import React from "react";
import { Layout } from "antd";
import { Header, Sidebar } from "@/components/organisms";
import { LayoutProvider } from "@/contexts/LayoutContext";

const { Content } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <Layout className="flex" hasSider>
        <Sidebar />
        <Layout className="flex-1 flex flex-col !bg-neutral9">
          <Header />
          <Content className="h-[calc(100vh-64px)] p-6 overflow-y-auto bg-white rounded-tl-[20px]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </LayoutProvider>
  );
}
