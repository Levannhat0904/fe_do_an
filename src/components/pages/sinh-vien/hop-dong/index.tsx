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
  List,
  Modal,
  Descriptions,
  Button,
  Tag,
} from "antd";
import {
  FileTextOutlined,
  FilePdfOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import contractApi from "@/api/contract";
import { Contract } from "@/types/student";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Trang quản lý hợp đồng của sinh viên
 * Hiển thị danh sách hợp đồng, chi tiết hợp đồng, lịch sử hợp đồng
 */
const ContractPage: React.FC = () => {
  const { user } = useAuth() as any;
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          // Fetch contracts for the student
          const response = await contractApi.getContractsByStudent(user.id);
          setContracts(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        message.error("Không thể tải thông tin hợp đồng");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user]);

  const handleViewContractDetail = async (contractId: number) => {
    try {
      setLoading(true);
      // Fetch contract details
      const response = await contractApi.getContractById(contractId);
      setSelectedContract(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching contract details:", error);
      message.error("Không thể tải chi tiết hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "success",
      expired: "error",
      terminated: "error",
      pending: "warning",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hiệu lực";
      case "expired":
        return "Đã hết hạn";
      case "terminated":
        return "Đã chấm dứt";
      default:
        return "Không xác định";
    }
  };

  // Sắp xếp hợp đồng theo trạng thái và ngày bắt đầu
  const activeContracts = contracts.filter(
    (contract) => contract.status === "active"
  );
  const expiredContracts = contracts.filter(
    (contract) =>
      contract.status === "expired" || contract.status === "terminated"
  );

  const ContractItem = ({ contract }: { contract: Contract }) => (
    <Card
      hoverable
      style={{ marginBottom: 16, borderRadius: 8 }}
      onClick={() => contract.id && handleViewContractDetail(contract.id)}
    >
      <Row gutter={16} align="middle">
        <Col xs={4} sm={2}>
          <FilePdfOutlined style={{ fontSize: 32, color: "#fa8c16" }} />
        </Col>
        <Col xs={20} sm={16}>
          <div style={{ fontWeight: "bold" }}>
            Hợp đồng #{contract.contractNumber}
          </div>
          <div>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            {contract.startDate
              ? new Date(contract.startDate).toLocaleDateString("vi-VN")
              : ""}{" "}
            -{" "}
            {contract.endDate
              ? new Date(contract.endDate).toLocaleDateString("vi-VN")
              : ""}
          </div>
        </Col>
        <Col xs={24} sm={6} style={{ textAlign: "right" }}>
          <Tag color={getStatusColor(contract.status || "")}>
            {getStatusText(contract.status || "")}
          </Tag>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "20px" }}>
        <Card style={{ marginBottom: 20, borderRadius: 8 }}>
          <Title level={3} style={{ color: "#fa8c16", margin: 0 }}>
            <FileTextOutlined /> Quản lý hợp đồng
          </Title>
          <Text>Xem và quản lý các hợp đồng thuê phòng ký túc xá của bạn</Text>
        </Card>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Card style={{ borderRadius: 8 }}>
            <Tabs defaultActiveKey="active">
              <TabPane
                tab={
                  <span>
                    <CheckCircleOutlined /> Hợp đồng hiện tại
                  </span>
                }
                key="active"
              >
                {activeContracts.length > 0 ? (
                  activeContracts.map((contract) => (
                    <ContractItem key={contract.id} contract={contract} />
                  ))
                ) : (
                  <Empty
                    description="Bạn không có hợp đồng đang hiệu lực"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined /> Hợp đồng cũ
                  </span>
                }
                key="expired"
              >
                {expiredContracts.length > 0 ? (
                  expiredContracts.map((contract) => (
                    <ContractItem key={contract.id} contract={contract} />
                  ))
                ) : (
                  <Empty
                    description="Bạn không có hợp đồng cũ"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </TabPane>
            </Tabs>
          </Card>
        )}

        <Modal
          title={`Chi tiết hợp đồng #${selectedContract?.contractNumber}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
            <Button
              key="download"
              type="primary"
              style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
            >
              <FilePdfOutlined /> Tải hợp đồng
            </Button>,
          ]}
          width={700}
        >
          {selectedContract ? (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã hợp đồng">
                {selectedContract.contractNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {selectedContract.startDate
                  ? new Date(selectedContract.startDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {selectedContract.endDate
                  ? new Date(selectedContract.endDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Tiền đặt cọc">
                {selectedContract.depositAmount?.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Phí hàng tháng">
                {selectedContract.monthlyFee?.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedContract.status || "")}>
                  {getStatusText(selectedContract.status || "")}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {selectedContract.createdAt
                  ? new Date(selectedContract.createdAt).toLocaleDateString(
                      "vi-VN"
                    )
                  : ""}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Spin />
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default ContractPage;
