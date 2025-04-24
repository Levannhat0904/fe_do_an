import dynamic from "next/dynamic";

const BuildingPageContent = dynamic(
  () => import("@/components/pages/buildingPage"),
  {
    ssr: false,
  }
);

export default function BuildingPage() {
  return <BuildingPageContent />;
}
