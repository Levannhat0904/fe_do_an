import React from "react";

export default function BuildingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Thông tin chi tiết tòa nhà</h1>
      <p>ID tòa nhà: {params.id}</p>
      <p>Chi tiết tòa nhà đang được phát triển...</p>
    </div>
  );
}
