import dynamic from "next/dynamic";

const RoomPageContent = dynamic(() => import("@/components/pages/roomPage"), {
  ssr: false,
});

export default function InspectionPartners() {
  return <RoomPageContent />;
}
