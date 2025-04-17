import dynamic from "next/dynamic";

const StudentPageContent = dynamic(
  () => import("@/components/pages/studentPage/studentListPage"),
  {
    ssr: false,
  }
);

export default function InspectionPartners() {
  return <StudentPageContent />;
}
