"use client";
import { MenuProps } from "antd";
import { User } from "@phosphor-icons/react";

import {
  SIconBadge,
  SIconGrid,
  SIconIdCard,
  SIconShop,
} from "@/components/atoms";
import { Routers, userRole } from "./enums";
// Định nghĩa các route cho từng loại role
export const adminRouters: MenuProps["items"] = [
  {
    label: "Tổng quan",
    key: Routers.home,
    icon: <SIconGrid />,
  },
  {
    label: "Đăng ký nội trú",
    key: "/dang-ky-noi-tru",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý đăng ký",
    key: "/quan-ly-don-dang-ky",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý sinh viên",
    key: "/quan-ly-sinh-vien",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý hợp đồng",
    key: "/quan-ly-hop-dong",
    icon: <SIconShop />,
  },
  {
    label: "Quản lý toà nhà",
    key: "/quan-ly-toa-nha",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý phòng",
    key: "/quan-ly-phong",
    icon: <SIconBadge />,
  },
  {
    label: "Quản lý hóa đơn",
    key: "/quan-ly-hoa-don",
    icon: <SIconIdCard />,
  },
];
export const studentRouters: MenuProps["items"] = [
  {
    label: "Tổng quan",
    key: Routers.home,
    icon: <SIconGrid />,
  },
  {
    label: "Đăng ký nội trú",
    key: "/dang-ky-noi-tru",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý đăng ký",
    key: "/quan-ly-don-dang-ky",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý sinh viên",
    key: "/quan-ly-sinh-vien",
    icon: <SIconGrid />,
  },
  {
    label: "Quản lý hợp đồng",
    key: "/quan-ly-hop-dong",
    icon: <SIconShop />,
  },
  {
    label: "Quản lý phòng",
    key: "/quan-ly-phong",
    icon: <SIconBadge />,
  },
  {
    label: "Quản lý hóa đơn",
    key: "quan-ly-hoa-don",
    icon: <SIconIdCard />,
  },
];

// Hàm helper để lấy routes dựa trên partner type
export const getRoutersByUserRole = (role?: userRole): MenuProps["items"] => {
  console.log("role", role);
  switch (role) {
    case userRole.super_admin:
      return adminRouters;
    case userRole.student:
      return studentRouters;
    case userRole.admin:
      return adminRouters;
    default:
      // return studentRouters;
      return [];
  }
};
