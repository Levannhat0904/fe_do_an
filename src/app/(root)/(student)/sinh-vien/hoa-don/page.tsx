import dynamic from "next/dynamic";
import React from "react";

// Import trang quản lý hóa đơn từ thư mục components/pages
const InvoicePage = dynamic(
  () => import("@/components/pages/sinh-vien/hoa-don"),
  {
    ssr: false,
  }
);

/**
 * Trang quản lý hóa đơn của sinh viên
 */
const StudentInvoicePage: React.FC = () => {
  return <InvoicePage />;
};

export default StudentInvoicePage;
