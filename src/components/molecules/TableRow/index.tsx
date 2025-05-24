"use client";
import React from "react";
import { DotsThreeCircleVertical, Eye } from "@phosphor-icons/react";
import { ICON_SIZE_DEFAULT, StatusEnum } from "@/constants";
import { KText } from "@/components/atoms";

interface TableRowProps {
  id: number;
  code: string;
  agentName: string;
  phoneNumber: string;
  joinDate: string;
  totalOrders: number;
  revenue: string;
  revenueReceived: string;
  status: StatusEnum;
}

const TableRow: React.FC<TableRowProps> = ({
  id,
  code,
  agentName,
  phoneNumber,
  joinDate,
  totalOrders,
  revenue,
  revenueReceived,
  status,
}) => {
  return (
    <tr className="border-b">
      <td>{id}</td>
      <td>{code}</td>
      <td>
        <KText>{agentName}</KText>
      </td>
      <td>
        <KText className="text-orange-500">{phoneNumber}</KText>
      </td>
      <td>{joinDate}</td>
      <td>{totalOrders}</td>
      <td>{revenue}</td>
      <td>{revenueReceived}</td>
      <td>
        {/* <KStatus status={status} /> */}
        <KText>{status}</KText>
      </td>
      <td>
        <div className="flex space-x-2">
          <Eye size={ICON_SIZE_DEFAULT} />
          <DotsThreeCircleVertical size={ICON_SIZE_DEFAULT} />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
