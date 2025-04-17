import dynamic from "next/dynamic";

const StudentDetailPageContent = dynamic(
  () => import("@/components/pages/studentPage/studentDetailPage"),
  {
    ssr: false,
  }
);

export default function InspectionPartners() {
  return <StudentDetailPageContent />;
}
