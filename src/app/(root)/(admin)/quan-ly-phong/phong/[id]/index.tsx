import dynamic from "next/dynamic";

const RoomDetailPageContent = dynamic(
  () => import("@/components/pages/roomPage/roomDetailPage"),
  {
    ssr: false,
  }
);

export default function RoomDetailPage() {
  return <RoomDetailPageContent />;
}
