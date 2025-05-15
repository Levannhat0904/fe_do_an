"use client";

import React from "react";
import { Card, Row, Col, Statistic, Typography, Progress } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface HomeCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
  progress?: number;
  onClick?: () => void;
}

/**
 * Card hiển thị thông tin tóm tắt trên trang chủ sinh viên
 * Với thiết kế sinh động và hiệu ứng hover
 */
const HomeCard: React.FC<HomeCardProps> = ({
  title,
  value,
  icon,
  description,
  color = "#fa8c16",
  progress,
  onClick,
}) => {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer animate-fadeIn hover-scale"
      style={{
        borderRadius: "12px",
        borderTop: `4px solid ${color}`,
      }}
      bodyStyle={{ padding: "20px" }}
      onClick={onClick}
    >
      <Row gutter={16} align="middle">
        <Col>
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-300 hover:scale-110"
            style={{
              background: `${color}20`, // Màu nền với 20% opacity
              color: color,
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              style: { fontSize: "24px" },
            })}
          </div>
        </Col>
        <Col flex="auto">
          <Title level={5} style={{ margin: "0 0 4px 0", color: "#262626" }}>
            {title}
          </Title>
          <Statistic
            value={value}
            valueStyle={{
              fontSize: "24px",
              fontWeight: "bold",
              color,
            }}
          />
          {description && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {description}
            </Text>
          )}
          {progress !== undefined && (
            <Progress
              percent={progress}
              status="active"
              showInfo={false}
              strokeColor={color}
              style={{ marginTop: "8px" }}
            />
          )}
        </Col>
      </Row>
    </Card>
  );
};

// Pre-defined card components for common use cases
export const RoomCard: React.FC<{
  roomNumber: string;
  buildingName: string;
  onClick?: () => void;
}> = ({ roomNumber, buildingName, onClick }) => (
  <HomeCard
    title="Phòng ở hiện tại"
    value={roomNumber}
    description={`Tòa nhà: ${buildingName}`}
    icon={<HomeOutlined />}
    color="#fa8c16"
    onClick={onClick}
  />
);

export const ContractCard: React.FC<{
  count: number;
  activeCount: number;
  onClick?: () => void;
}> = ({ count, activeCount, onClick }) => (
  <HomeCard
    title="Hợp đồng của bạn"
    value={count}
    description={`${activeCount} hợp đồng đang hiệu lực`}
    icon={<FileTextOutlined />}
    color="#1890ff"
    progress={count > 0 ? (activeCount / count) * 100 : 0}
    onClick={onClick}
  />
);

export const InvoiceCard: React.FC<{
  pendingCount: number;
  totalCount: number;
  onClick?: () => void;
}> = ({ pendingCount, totalCount, onClick }) => (
  <HomeCard
    title="Hóa đơn cần thanh toán"
    value={pendingCount}
    description={`Tổng cộng: ${totalCount} hóa đơn`}
    icon={<CreditCardOutlined />}
    color={pendingCount > 0 ? "#fa541c" : "#52c41a"}
    onClick={onClick}
  />
);

export const MaintenanceCard: React.FC<{
  pendingCount: number;
  totalCount: number;
  onClick?: () => void;
}> = ({ pendingCount, totalCount, onClick }) => (
  <HomeCard
    title="Yêu cầu bảo trì"
    value={pendingCount > 0 ? `${pendingCount} đang xử lý` : "Đã hoàn thành"}
    icon={<ToolOutlined />}
    color={pendingCount > 0 ? "#fa541c" : "#52c41a"}
    progress={
      totalCount > 0 ? ((totalCount - pendingCount) / totalCount) * 100 : 100
    }
    onClick={onClick}
  />
);

export default HomeCard;
