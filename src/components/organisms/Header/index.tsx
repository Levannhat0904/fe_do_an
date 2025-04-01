"use client";

import { Layout } from "antd";
import { UserProfileMenu } from "@/components/molecules";
import { useLayout } from "@/contexts/LayoutContext";
import { Sidebar, SquareHalf } from "@phosphor-icons/react";
import { ICON_SIZE_DEFAULT } from "@/constants";

const { Header: LayoutHeader } = Layout;

export default function Header() {
  const { collapsed, toggleCollapsed } = useLayout();
  return (
    <LayoutHeader className="!bg-neutral9 flex md:justify-between justify-end items-center !px-8">
      <button
        onClick={toggleCollapsed}
        className="text-2xl text-neutral1 hidden md:block hover:text-primary transition-colors"
      >
        {collapsed ? (
          <SquareHalf size={ICON_SIZE_DEFAULT} />
        ) : (
          <Sidebar size={ICON_SIZE_DEFAULT} />
        )}
      </button>
      <UserProfileMenu />
    </LayoutHeader>
  );
}
