import dynamic from "next/dynamic";

const RepairPageContent = dynamic(() => import("@/components/pages/repairPage"), {
  ssr: false,
});

export default function MaintenancePage() {
  return <RepairPageContent />;
}
