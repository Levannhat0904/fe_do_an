import dynamic from "next/dynamic";

const BillPageContent = dynamic(() => import("@/components/pages/billPage"), {
  ssr: false,
});

export default function InspectionPartners() {
  return <BillPageContent />;
}
