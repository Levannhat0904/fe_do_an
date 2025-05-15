import dynamic from "next/dynamic";
import React from "react";

// Import trang quản lý hợp đồng từ thư mục components/pages
const ContractPage = dynamic(
  () => import("@/components/pages/sinh-vien/hop-dong"),
  {
    ssr: false,
  }
);

/**
 * Trang quản lý hợp đồng của sinh viên
 */
const StudentContractPage: React.FC = () => {
  return <ContractPage />;
};

export default StudentContractPage;
