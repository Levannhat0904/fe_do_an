"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Menu, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import { useLayout } from "@/contexts/LayoutContext";
import { useMenu } from "@/contexts/MenuContext";
import { KLogoSidebar } from "@/components/atoms";
import { getRoutersByUserRole } from "@/constants/routers";
import { userRole } from "@/constants/enums";
import styles from "./styles.module.scss";
import { useCurrentSession } from "@/api/auth";
const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const { collapsed } = useLayout();
  const { activeKey, setActiveKey } = useMenu();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { data: profile, isPending } = useCurrentSession();
  console.log("profiless", profile?.data?.profile?.role);
  const onMenuSelect = (info: any) => {
    router.push(info.key);
    setActiveKey(info.key);
    setDrawerVisible(false);
  };

  const MenuContent = () => (
    <Menu
      className={`${styles.menu} !bg-neutral9`}
      theme="light"
      mode="inline"
      items={getRoutersByUserRole(
        isPending
          ? userRole.undefined
          : (profile?.data?.profile?.role as userRole) || userRole.student
      )}
      onClick={onMenuSelect}
      selectedKeys={[activeKey]}
    />
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-neutral9 rounded"
        onClick={() => setDrawerVisible(true)}
      >
        <MenuOutlined />
      </button>

      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="md:hidden"
        bodyStyle={{ padding: 0, backgroundColor: "var(--neutral9)" }}
      >
        <div className="flex gap-2 items-center justify-center h-16 p-4 mb-5">
          <KLogoSidebar />
        </div>
        <MenuContent />
      </Drawer>

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`hidden md:block h-screen overflow-y-auto !bg-neutral9 transition-all ${
          collapsed
            ? "!w-[80px] !max-w-[80px] !flex-[0_0_80px]"
            : "!w-[280px] !max-w-[280px] !flex-[0_0_280px]"
        }`}
      >
        <div className="flex gap-2 items-center justify-center h-16 p-4 mb-5">
          <KLogoSidebar />
        </div>
        <MenuContent />
      </Sider>
    </>
  );
}
