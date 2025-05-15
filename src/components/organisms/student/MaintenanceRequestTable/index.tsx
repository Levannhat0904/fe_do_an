import React from "react";
import { Table, Tag, Button } from "antd";
import { MaintenanceRequest } from "@/types/student";

interface MaintenanceRequestTableProps {
  maintenanceRequests: MaintenanceRequest[];
  onViewDetail?: (requestId: number) => void;
  onCancelRequest?: (requestId: number) => void;
}

/**
 * Component hiển thị bảng danh sách yêu cầu bảo trì của sinh viên
 * Hiển thị các thông tin như: mã yêu cầu, loại yêu cầu, mô tả, mức độ ưu tiên, trạng thái, ngày tạo
 * Cho phép sinh viên xem chi tiết và hủy yêu cầu (nếu đang ở trạng thái chờ xử lý)
 */
const MaintenanceRequestTable: React.FC<MaintenanceRequestTableProps> = ({
  maintenanceRequests,
  onViewDetail,
  onCancelRequest,
}) => {
  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "warning",
      processing: "processing",
      completed: "success",
      rejected: "error",
    };
    return statusColors[status] || "default";
  };

  // Hàm lấy màu cho tag mức độ ưu tiên
  const getPriorityColor = (priority: string) => {
    const priorityColors: Record<string, string> = {
      low: "green",
      normal: "blue",
      high: "red",
      urgent: "red",
    };
    return priorityColors[priority] || "blue";
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestNumber",
      key: "requestNumber",
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "requestType",
      key: "requestType",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === "high"
            ? "Cao"
            : priority === "normal"
            ? "Trung bình"
            : priority === "urgent"
            ? "Khẩn cấp"
            : "Thấp"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === "completed"
            ? "Đã xử lý"
            : status === "processing"
            ? "Đang xử lý"
            : status === "rejected"
            ? "Từ chối"
            : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: MaintenanceRequest) => (
        <>
          <Button
            size="small"
            onClick={() => onViewDetail && record.id && onViewDetail(record.id)}
            style={{ marginRight: 8 }}
          >
            Chi tiết
          </Button>
          {record.status === "pending" && (
            <Button
              size="small"
              danger
              onClick={() =>
                onCancelRequest && record.id && onCancelRequest(record.id)
              }
            >
              Hủy
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={maintenanceRequests}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default MaintenanceRequestTable;
