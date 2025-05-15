import dynamic from "next/dynamic";
import React from "react";

// Import trang quản lý bảo trì từ thư mục components/pages
const MaintenancePage = dynamic(
  () => import("@/components/pages/sinh-vien/bao-tri"),
  {
    ssr: false,
  }
);

/**
 * Trang quản lý yêu cầu bảo trì của sinh viên
 */
const StudentMaintenancePage: React.FC = () => {
  return <MaintenancePage />;
};

export default StudentMaintenancePage;
