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
  MenuOutlined,
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
  const { adminProfile: user, isPending, onLogout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);

  console.log("adminProfile in header:", user);
  // Theo dõi kích thước màn hình để responsive
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
            } else {
              console.error("onLogout is not defined in AuthContext");
            }
          },
        },
      ]}
    />
  );

  // Kiểm tra xem đường dẫn hiện tại có khớp với menu item nào
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
        }}
      >
        <div className="flex justify-between items-center h-full">
          {/* Logo và tên ứng dụng */}
          <div className="flex items-center">
            <div className="transition-transform duration-300 ease-in-out hover:scale-105">
              <Link href="/sinh-vien">
                <div className="flex items-center cursor-pointer">
                  <Image
                    src={LOGO_URL}
                    alt="KTX Logo"
                    width={32}
                    height={32}
                    className="mr-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placekitten.com/40/40";
                    }}
                  />
                  <span className="text-white font-bold text-lg hidden md:inline">
                    KTX Connect
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Menu điều hướng cho màn hình lớn */}
          {!isMobile && (
            <nav className="flex items-center h-full">
              {menuItems.map((item) => (
                <Link href={item.path} key={item.key}>
                  <div
                    className={`
                      h-full flex items-center px-4 mx-1 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1
                      ${
                        isActive(item.path)
                          ? "text-white border-b-2 border-white font-bold"
                          : "text-white/80 hover:text-white"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="ml-1">{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          )}

          {/* Menu di động cho màn hình nhỏ */}
          {isMobile && (
            <div className="relative">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: "white" }}
              />
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ease-in-out animate-fadeDown">
                  {menuItems.map((item) => (
                    <Link href={item.path} key={item.key}>
                      <div
                        className={`
                          px-4 py-3 hover:bg-orange-100 flex items-center cursor-pointer transition-colors duration-200
                          ${
                            isActive(item.path)
                              ? "bg-orange-50 text-orange-500 font-medium"
                              : "text-gray-800"
                          }
                        `}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User profile và thông báo */}
          <div className="flex items-center">
            <Badge count={3} dot>
              <Button
                shape="circle"
                icon={<BellOutlined />}
                className="mr-3 flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
                style={{
                  color: "white",
                  borderColor: "white",
                  background: "transparent",
                }}
              />
            </Badge>

            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="cursor-pointer flex items-center hover:opacity-80 transition-opacity duration-300">
                <Image
                  src={
                    user?.profile?.avatarPath
                      ? user?.profile?.avatarPath
                      : LOGO_URL
                  }
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full object-cover aspect-square"
                />
                <span className="ml-2 text-white hidden md:inline">
                  {user?.profile?.fullName || "Sinh viên"}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>

      {/* Drawer chỉnh sửa thông tin sinh viên */}
      <StudentProfileDrawer
        open={profileDrawerVisible}
        onClose={() => setProfileDrawerVisible(false)}
        student={
          user?.profile
            ? {
                id: user.profile.id,
                studentCode: user.profile.staffCode,
                fullName: user.profile.fullName,
                phone: user.profile.phone || "",
                email: user.email,
                avatarPath: user.profile.avatarPath || undefined,
              }
            : null
        }
        onSuccess={() => {
          // Nếu muốn làm gì đó sau khi cập nhật thông tin thành công, hãy thực hiện ở đây
          // Ví dụ: refresh dữ liệu user
        }}
      />
    </>
  );
};

export default StudentHeader;
