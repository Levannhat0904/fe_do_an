"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Spin,
  Empty,
  Row,
  Col,
  Tabs,
  message,
  Button,
  Table,
  Tag,
  Space,
} from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useGetCurrentStudentInvoices } from "@/api/invoice";
import { Invoice } from "@/types/student";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Trang quản lý hóa đơn của sinh viên
 * Hiển thị danh sách hóa đơn, chi tiết hóa đơn, lịch sử thanh toán
 */
const InvoicePage: React.FC = () => {
  const { user } = useAuth() as any;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  // Use React Query to fetch invoice data
  const {
    data: invoiceData,
    isLoading,
    isError,
    error,
  } = useGetCurrentStudentInvoices();

  useEffect(() => {
    if (invoiceData?.success && invoiceData?.data?.invoices) {
      setInvoices(invoiceData.data.invoices);

      // Calculate total paid and unpaid amounts
      let unpaid = 0;
      let paid = 0;
      invoiceData.data.invoices.forEach((invoice) => {
        if (
          invoice.paymentStatus === "pending" ||
          invoice.paymentStatus === "overdue"
        ) {
          unpaid += invoice.totalAmount || 0;
        } else if (invoice.paymentStatus === "paid") {
          paid += invoice.totalAmount || 0;
        }
      });
      setTotalUnpaid(unpaid);
      setTotalPaid(paid);
    } else if (isError) {
      console.error("Error fetching invoices:", error);
      message.error("Không thể tải thông tin hóa đơn");
    }
  }, [invoiceData, isError, error]);

  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      paid: "success",
      pending: "warning",
      overdue: "error",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "overdue":
        return "Quá hạn";
      default:
        return "Không xác định";
    }
  };

  // Phân loại hóa đơn
  const unpaidInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === "pending" || invoice.paymentStatus === "overdue"
  );
  const paidInvoices = invoices.filter(
    (invoice) => invoice.paymentStatus === "paid"
  );

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
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
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
          >
            Thanh toán
          </Button>
          <Button>Chi tiết</Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "20px" }}>
        <Card style={{ marginBottom: 20, borderRadius: 8 }}>
          <Title level={3} style={{ color: "#fa8c16", margin: 0 }}>
            <CreditCardOutlined /> Quản lý hóa đơn
          </Title>
          <Text>Xem và thanh toán các hóa đơn phòng ký túc xá của bạn</Text>
        </Card>

        {/* Thống kê */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12}>
            <Card
              style={{
                borderRadius: 8,
                backgroundColor: "#ffece0",
                borderColor: "#ffece0",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Row align="middle" gutter={16}>
                <Col>
                  <DollarOutlined style={{ fontSize: 36, color: "#fa8c16" }} />
                </Col>
                <Col>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    Cần thanh toán
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#fa541c",
                    }}
                  >
                    {totalUnpaid.toLocaleString("vi-VN")} VNĐ
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              style={{
                borderRadius: 8,
                backgroundColor: "#e6f7ff",
                borderColor: "#e6f7ff",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Row align="middle" gutter={16}>
                <Col>
                  <FileDoneOutlined
                    style={{ fontSize: 36, color: "#1890ff" }}
                  />
                </Col>
                <Col>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    Đã thanh toán
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#096dd9",
                    }}
                  >
                    {totalPaid.toLocaleString("vi-VN")} VNĐ
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card style={{ borderRadius: 8 }}>
          <Tabs defaultActiveKey="unpaid">
            <TabPane
              tab={
                <span>
                  <FileExclamationOutlined /> Chờ thanh toán (
                  {unpaidInvoices.length})
                </span>
              }
              key="unpaid"
            >
              {unpaidInvoices.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={unpaidInvoices}
                  rowKey="id"
                  pagination={false}
                />
              ) : (
                <Empty
                  description="Không có hóa đơn nào cần thanh toán"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileDoneOutlined /> Đã thanh toán ({paidInvoices.length})
                </span>
              }
              key="paid"
            >
              {paidInvoices.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={paidInvoices}
                  rowKey="id"
                  pagination={false}
                />
              ) : (
                <Empty
                  description="Không có hóa đơn nào đã thanh toán"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
};

export default InvoicePage;
