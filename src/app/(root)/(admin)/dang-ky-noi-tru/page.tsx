import dynamic from "next/dynamic";
import React from "react";

const RegisterDormitory = dynamic(
  () => import("@/components/pages/RegisterDormitory"),
  {
    ssr: false,
  }
);

const DangKyNoiTruPage: React.FC = () => {
  return <RegisterDormitory />;
};

export default DangKyNoiTruPage;
