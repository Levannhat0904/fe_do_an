"use client";
import { MenuProps } from "antd";
import { User } from "@phosphor-icons/react";

import {
  SIconBadge,
  SIconGrid,
  SIconIdCard,
  SIconShop,
} from "@/components/atoms";
import { Routers } from "./enums";

export const routers: MenuProps["items"] = [
  {
    label: "Tổng quan",
    key: Routers.home,
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý đơn hàng",
    key: "order-management",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý đại lý",
    key: "agent-management",
    icon: <SIconShop />,
  },
  {
    label: "Quản lý đối tác bảo hiểm",
    key: "insurance-partner-management",
    icon: <SIconBadge />,
  },
  {
    label: "Quản lý đối tác dv đăng kiểm",
    key: "inspection-partner-management",
    icon: <SIconIdCard />,
  },
  {
    label: "Quản lý khách hàng",
    key: "customer-management",
    icon: <User />,
  },
];
