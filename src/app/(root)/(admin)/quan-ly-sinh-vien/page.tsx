import dynamic from "next/dynamic";

const StudentPageContent = dynamic(
  () => import("@/components/pages/studentPage"),
  {
    ssr: false,
  }
);

export default function InspectionPartners() {
  return <StudentPageContent />;
}
