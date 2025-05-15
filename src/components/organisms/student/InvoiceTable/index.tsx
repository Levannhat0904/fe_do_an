import React from "react";
import { Table, Tag, Space, Button } from "antd";
import { Invoice } from "@/types/student";

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoiceDetail?: (invoiceId: number) => void;
  onPayInvoice?: (invoiceId: number) => void;
}

/**
 * Component hiển thị bảng danh sách hóa đơn của sinh viên
 * Hiển thị các thông tin như: số hóa đơn, tháng, ngày hết hạn, tổng tiền, trạng thái
 * Cho phép sinh viên xem chi tiết và thanh toán hóa đơn
 */
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onViewInvoiceDetail,
  onPayInvoice,
}) => {
  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      paid: "success",
      pending: "warning",
      overdue: "error",
    };
    return statusColors[status] || "default";
  };

  const columns = [
    {
      title: "Số hóa đơn",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Tháng",
      dataIndex: "invoiceMonth",
      key: "invoiceMonth",
      render: (date: string) =>
        date
          ? new Date(date).toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })
          : "",
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) =>
        amount ? `${amount.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ",
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === "paid"
            ? "Đã thanh toán"
            : status === "pending"
            ? "Chờ thanh toán"
            : "Quá hạn"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Invoice) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
            disabled={record.paymentStatus === "paid"}
            onClick={() => onPayInvoice && record.id && onPayInvoice(record.id)}
          >
            Thanh toán
          </Button>
          <Button
            onClick={() =>
              onViewInvoiceDetail && record.id && onViewInvoiceDetail(record.id)
            }
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={invoices}
      rowKey="id"
      pagination={false}
    />
  );
};

export default InvoiceTable;
