import dynamic from "next/dynamic";
// tra cứu hóa đơn đành cho admin và sinh viên
const LookUpBillPageContent = dynamic(
  () => import("@/components/pages/lookUpBillPage"),
  {
    ssr: false,
  }
);

export default function TraCuuHoaDon() {
  return <LookUpBillPageContent />;
}
