import dynamic from "next/dynamic";
import React from "react";

const StudentPage = dynamic(() => import("@/components/pages/sinh-vien/home"), {
  ssr: false,
});

const StudentHomePage: React.FC = () => {
  return <StudentPage />;
};

export default StudentHomePage;
