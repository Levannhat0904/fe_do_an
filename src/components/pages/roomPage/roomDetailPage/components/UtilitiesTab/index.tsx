import React from "react";
import { Card, Table, Button, Space, Badge, Tag } from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { formatDate, formatCurrency } from "../../utils";
import { StatusEnum } from "@/constants/enums";

interface UtilitiesTabProps {
  utilities: any[];
  onAddUtility: () => void;
  onEditInvoice: (invoice: any) => void;
  onUpdatePaymentStatus: (invoiceId: number) => void;
  onPrintInvoice: (invoice: any) => void;
}

const UtilitiesTab: React.FC<UtilitiesTabProps> = ({
  utilities,
  onAddUtility,
  onEditInvoice,
  onUpdatePaymentStatus,
  onPrintInvoice,
}) => {
  const columns = [
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      sorter: (a: any, b: any) =>
        new Date(b.month).getTime() - new Date(a.month).getTime(),
    },
    {
      title: "Điện (kWh)",
      dataIndex: "electricity",
      key: "electricity",
      render: (value: number) => Number(value),
    },
    {
      title: "Nước (m³)",
      dataIndex: "water",
      key: "water",
      render: (value: number) => Number(value),
    },
    {
      title: "Chi phí điện",
      dataIndex: "electricityCost",
      key: "electricityCost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Chi phí nước",
      dataIndex: "waterCost",
      key: "waterCost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Phí khác",
      dataIndex: "otherFees",
      key: "otherFees",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => {
        if (status === "paid") {
          return (
            <Badge
              status={StatusEnum.Success as any}
              text={`Đã thanh toán ${
                record.paidDate ? `(${formatDate(record.paidDate)})` : ""
              }`}
            />
          );
        } else if (status === StatusEnum.Pending) {
          return <Badge status="warning" text="Đang chờ thanh toán" />;
        } else if (status === StatusEnum.WaitingForApproval) {
          return <Badge status="warning" text="Chờ duyệt" />;
        } else {
          return <Badge status="error" text="Quá hạn" />;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: any) => (
        <Space size="small">
          {record.status !== "paid" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => onUpdatePaymentStatus(record.id)}
              disabled={record.status !== StatusEnum.WaitingForApproval}
            >
              Đánh dấu đã thu
            </Button>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditInvoice(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            size="small"
            icon={<ExportOutlined />}
            onClick={() => onPrintInvoice(record)}
          >
            Xuất hóa đơn
          </Button>
        </Space>
      ),
    },
  ];

  // Sort utility bills by creation date (newest first)
  const sortedUtilities = [...utilities].sort((a: any, b: any) => {
    // Use createdAt if available, otherwise use month
    const dateA = a.createdAt
      ? new Date(a.createdAt).getTime()
      : new Date(a.month).getTime();
    const dateB = b.createdAt
      ? new Date(b.createdAt).getTime()
      : new Date(b.month).getTime();
    return dateB - dateA; // Sort descending (newest first)
  });

  return (
    <Card
      title="Hóa đơn tiện ích"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddUtility}>
          Thêm hóa đơn
        </Button>
      }
      style={{ marginBottom: "20px" }}
    >
      <Table
        columns={columns}
        dataSource={sortedUtilities}
        rowKey="id"
        size="middle"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default UtilitiesTab; 