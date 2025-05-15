import React from "react";
import { Card, Descriptions, Button, Tag, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Dormitory } from "@/types/student";

const { Text } = Typography;

interface RoomCardProps {
  roomData: Dormitory | null;
  onRegisterRoom?: () => void;
}

/**
 * Component hiển thị thông tin phòng ở của sinh viên
 * Hiện thị các thông tin như: tòa nhà, phòng, giường, giá thuê, ngày vào/ra, trạng thái
 */
const RoomCard: React.FC<RoomCardProps> = ({ roomData, onRegisterRoom }) => {
  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "success",
      pending: "warning",
      inactive: "error",
      maintenance: "processing",
    };
    return statusColors[status] || "default";
  };

  return (
    <Card
      title={
        <>
          <HomeOutlined /> Thông tin phòng ở
        </>
      }
      style={{
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
      extra={
        roomData ? (
          <Button type="link" style={{ color: "#fa8c16" }}>
            Chi tiết
          </Button>
        ) : null
      }
    >
      {roomData ? (
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Tòa nhà">
            {roomData.buildingName}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng">
            {roomData.roomNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Giường">
            {roomData.bedNumber || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Giá thuê hàng tháng">
            {roomData.monthlyFee?.toLocaleString("vi-VN")} VNĐ
          </Descriptions.Item>
          <Descriptions.Item label="Ngày vào">
            {roomData.checkInDate
              ? new Date(roomData.checkInDate).toLocaleDateString("vi-VN")
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày hết hạn">
            {roomData.checkOutDate
              ? new Date(roomData.checkOutDate).toLocaleDateString("vi-VN")
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(roomData.status || "")}>
              {roomData.status === "active" ? "Đang ở" : "Chưa xác nhận"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Bạn chưa được phân phòng</Text>
          <div style={{ marginTop: "10px" }}>
            <Button
              type="primary"
              style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
              onClick={onRegisterRoom}
            >
              Đăng ký phòng
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RoomCard;
