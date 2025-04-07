import dynamic from "next/dynamic";

const RegisterDormitoryPageContent = dynamic(
  () => import("@/components/pages/registerDormitoryManagement"),
  {
    ssr: false,
  }
);

export default function InspectionPartners() {
  return <RegisterDormitoryPageContent />;
}
