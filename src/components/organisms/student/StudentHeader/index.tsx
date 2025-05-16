"use client";

import React, { useState, useEffect } from "react";
import { Layout, Avatar, Badge, Dropdown, Button, Menu } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ToolOutlined,
  BellOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import StudentProfileDrawer from "../StudentProfileDrawer";
import Image from "next/image";
import { LOGO_URL } from "@/constants/common";
const { Header } = Layout;

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  path: string;
}

const StudentHeader: React.FC = () => {
  const pathname = usePathname();
  const { adminProfile: user, onLogout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    {
      key: "home",
      label: "Trang chủ",
      icon: <HomeOutlined />,
      path: "/sinh-vien",
    },
    {
      key: "contracts",
      label: "Hợp đồng",
      icon: <FileTextOutlined />,
      path: "/sinh-vien/hop-dong",
    },
    {
      key: "invoices",
      label: "Hóa đơn",
      icon: <CreditCardOutlined />,
      path: "/sinh-vien/hoa-don",
    },
    {
      key: "maintenance",
      label: "Bảo trì",
      icon: <ToolOutlined />,
      path: "/sinh-vien/bao-tri",
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: "Hồ sơ cá nhân",
          icon: <UserOutlined />,
          onClick: () => setProfileDrawerVisible(true),
        },
        {
          key: "edit",
          label: "Chỉnh sửa thông tin",
          icon: <EditOutlined />,
          onClick: () => setProfileDrawerVisible(true),
        },
        {
          key: "logout",
          label: "Đăng xuất",
          icon: <LogoutOutlined />,
          onClick: () => {
            if (onLogout) {
              console.log("Logging out...");
              onLogout();
            }
          },
        },
      ]}
    />
  );

  const isActive = (path: string) => {
    if (path === "/sinh-vien" && pathname === "/sinh-vien") return true;
    if (path !== "/sinh-vien" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <Header
        className="px-4 md:px-8 py-0 fixed top-0 z-10 w-full"
        style={{
          background: "linear-gradient(90deg, #fa8c16 0%, #ffa940 100%)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          height: isMobile ? "56px" : "64px",
        }}
      >
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/sinh-vien" className="flex items-center">
              <Image
                src={LOGO_URL}
                alt="KTX Logo"
                width={isMobile ? 28 : 32}
                height={isMobile ? 28 : 32}
                className="transition-transform duration-300 hover:scale-105"
              />
              <span className="text-white font-bold text-lg hidden md:inline ml-2">
                KTX UTT
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center h-full">
              {menuItems.map((item) => (
                <Link href={item.path} key={item.key}>
                  <div
                    className={`
                      h-full flex items-center px-4 mx-1 cursor-pointer
                      transition-all duration-300 hover:bg-white/10
                      ${
                        isActive(item.path)
                          ? "text-white border-b-2 border-white font-medium"
                          : "text-white/90 hover:text-white"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center">
            <Badge count={3} dot>
              <Button
                shape="circle"
                icon={<BellOutlined />}
                className="mr-3 flex items-center justify-center"
                style={{
                  color: "white",
                  borderColor: "white",
                  background: "transparent",
                }}
              />
            </Badge>

            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="cursor-pointer flex items-center">
                <Avatar
                  src={user?.profile?.avatarPath || LOGO_URL}
                  alt="avatar"
                  size={isMobile ? 32 : 36}
                  className="bg-orange-200"
                />
                <span className="ml-2 text-white hidden md:inline">
                  {user?.profile?.fullName || "Sinh viên"}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex justify-around items-stretch h-16">
            {menuItems.map((item) => (
              <Link href={item.path} key={item.key} className="flex-1">
                <div
                  className={`
                    flex flex-col items-center justify-center h-full
                    relative py-2 transition-colors duration-200
                    ${
                      isActive(item.path)
                        ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                        : "text-gray-400 hover:text-gray-600 active:text-orange-500"
                    }
                  `}
                >
                  <div
                    className={`
                    text-xl mb-1 transition-transform duration-200
                    ${isActive(item.path) ? "transform scale-110" : ""}
                  `}
                  >
                    {item.icon}
                  </div>
                  <div
                    className={`
                    text-xs font-medium
                    ${isActive(item.path) ? "opacity-100" : "opacity-80"}
                  `}
                  >
                    {item.label}
                  </div>
                  {isActive(item.path) && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Add padding to main content when on mobile */}
      {/* {isMobile && <div className="pb-16" />} */}

      {/* Profile Drawer */}
      <StudentProfileDrawer
        open={profileDrawerVisible}
        onClose={() => setProfileDrawerVisible(false)}
        student={user || null}
        onSuccess={() => {
          // Handle success
        }}
      />
    </>
  );
};

export default StudentHeader;
