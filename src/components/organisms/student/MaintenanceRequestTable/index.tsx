import React from "react";
import { Table, Tag, Button, Space } from "antd";
import { MaintenanceRequest } from "@/types/student";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      width: isMobile ? 100 : 120,
      fixed: isMobile ? undefined : ("left" as const),
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "requestType",
      key: "requestType",
      width: isMobile ? 120 : 150,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: isMobile ? 150 : 200,
      ellipsis: true,
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: isMobile ? 120 : 150,
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
      width: isMobile ? 120 : 150,
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
      width: isMobile ? 120 : 150,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động",
      key: "action",
      fixed: isMobile ? undefined : ("right" as const),
      width: isMobile ? 140 : 160,
      render: (_: any, record: MaintenanceRequest) => (
        <Space size="small" wrap>
          <Button
            size={isMobile ? "small" : "middle"}
            onClick={() => onViewDetail && record.id && onViewDetail(record.id)}
          >
            Chi tiết
          </Button>
          {record.status === "pending" && (
            <Button
              size={isMobile ? "small" : "middle"}
              danger
              onClick={() =>
                onCancelRequest && record.id && onCancelRequest(record.id)
              }
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={maintenanceRequests}
      rowKey="id"
      pagination={{
        pageSize: 5,
        responsive: true,
        position: ["bottomCenter"],
      }}
      scroll={{ x: isMobile ? 900 : 1100 }}
      size={isMobile ? "small" : "middle"}
    />
  );
};

export default MaintenanceRequestTable;
