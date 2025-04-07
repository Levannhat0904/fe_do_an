import dynamic from "next/dynamic";

const ContractPageContent = dynamic(
  () => import("@/components/pages/contractPage"),
  {
    ssr: false,
  }
);

export default function InspectionPartners() {
  return <ContractPageContent />;
}
