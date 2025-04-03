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
    label: "Quản lý sinh viên",
    key: "quan-ly-sinh-vien",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý hợp đồng",
    key: "quan-ly-hop-dong",
    icon: <SIconShop />,
  },
  {
    label: "Quản lý phòng",
    key: "quan-ly-phong",
    icon: <SIconBadge />,
  },
  {
    label: "Quản lý hóa đơn",
    key: "quan-ly-hoa-don",
    icon: <SIconIdCard />,
  },
];
