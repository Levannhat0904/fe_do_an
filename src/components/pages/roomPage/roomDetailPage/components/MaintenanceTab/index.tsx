import React, { useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Space,
  Tag,
  Badge,
  Empty,
} from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../utils";
import MaintenanceDetailModal from "./MaintenanceDetailModal";

interface MaintenanceTabProps {
  maintenanceHistory: any[];
  pendingRequests: any[];
  onAddMaintenance: () => void;
  onProcessRequest: (request: any) => void;
  onViewMaintenance: (id: number) => void;
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  maintenanceHistory,
  pendingRequests,
  onAddMaintenance,
  onProcessRequest,
  onViewMaintenance,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetail = (record: any) => {
    setSelectedRequest(record);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedRequest(null);
    setIsDetailModalOpen(false);
  };

  const maintenanceColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        switch (type) {
          case "repair":
            return <Tag color="volcano">Sửa chữa</Tag>;
          case "cleaning":
            return <Tag color="green">Vệ sinh</Tag>;
          case "inspection":
            return <Tag color="blue">Kiểm tra</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chi phí",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number) => cost?.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "completed") {
          return <Badge status="success" text="Hoàn thành" />;
        } else if (status === "in-progress") {
          return <Badge status="processing" text="Đang thực hiện" />;
        } else {
          return <Badge status="default" text={status} />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      render: (_: unknown, record: any) => (
        <Space size="small" className="flex justify-end">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const requestColumns = [
    {
      title: "Ngày yêu cầu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        switch (type) {
          case "maintenance":
            return <Tag color="blue">Bảo trì</Tag>;
          case "complaint":
            return <Tag color="red">Khiếu nại</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requestedBy",
      key: "requestedBy",
    },
    {
      title: "Mức độ",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        switch (priority) {
          case "high":
            return <Tag color="red">Cao</Tag>;
          case "medium":
            return <Tag color="orange">Trung bình</Tag>;
          case "low":
            return <Tag color="green">Thấp</Tag>;
          default:
            return <Tag>{priority}</Tag>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "pending") {
          return <Badge status="warning" text="Chờ xử lý" />;
        } else if (status === "processing") {
          return <Badge status="processing" text="Đang xử lý" />;
        } else if (status === "completed") {
          return <Badge status="success" text="Hoàn thành" />;
        } else {
          return <Badge status="default" text={status} />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: any) => (
        <Space size="small">
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => onProcessRequest(record)}
            >
              Xử lý
            </Button>
          )}
          {record.status === "processing" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => onProcessRequest(record)}
            >
              Hoàn thành
            </Button>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="pending" style={{ marginBottom: "16px" }}>
        <Tabs.TabPane tab="Yêu cầu chờ xử lý" key="pending">
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddMaintenance}
            >
              Thêm yêu cầu mới
            </Button>
          </div>
          {pendingRequests && pendingRequests.length > 0 ? (
            <Table
              columns={requestColumns}
              dataSource={pendingRequests}
              rowKey="id"
              pagination={false}
            />
          ) : (
            <Empty description="Không có yêu cầu bảo trì nào đang chờ xử lý" />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lịch sử bảo trì" key="history">
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddMaintenance}
            >
              Thêm lịch sử bảo trì
            </Button>
          </div>
          {maintenanceHistory && maintenanceHistory.length > 0 ? (
            <Table
              columns={maintenanceColumns}
              dataSource={maintenanceHistory}
              rowKey="id"
              pagination={false}
            />
          ) : (
            <Empty description="Không có lịch sử bảo trì" />
          )}
        </Tabs.TabPane>
      </Tabs>

      <MaintenanceDetailModal
        request={selectedRequest}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </>
  );
};

export default MaintenanceTab; 