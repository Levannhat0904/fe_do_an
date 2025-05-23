import React from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Progress,
  Divider,
  Timeline,
  Tag,
} from "antd";
import { RoomDetail } from "@/api/room";
import { formatDate, formatCurrency } from "../../utils";

interface RoomInfoTabProps {
  data: RoomDetail;
  maintenanceHistory: any[];
}

const RoomInfoTab: React.FC<RoomInfoTabProps> = ({
  data,
  maintenanceHistory,
}) => {
  const { room } = data;

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={24} lg={16}>
        <Card title="Thông tin cơ bản" bordered={false}>
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="Tòa nhà">
              {room.buildingName}
            </Descriptions.Item>
            <Descriptions.Item label="Số phòng">
              {room.roomNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Tầng">
              {room.floorNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Diện tích">
              {room.roomArea ? `${room.roomArea} m²` : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Loại phòng">
              {room.roomType === "male" ? "Nam" : "Nữ"}
            </Descriptions.Item>
            <Descriptions.Item label="Sức chứa">
              {room.occupiedBeds}/{room.capacity} người
            </Descriptions.Item>
            <Descriptions.Item label="Giá phòng">
              {formatCurrency(room.pricePerMonth)}/tháng
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(room.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Vệ sinh gần nhất">
              {room.lastCleaned ? formatDate(room.lastCleaned) : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Bảo trì tiếp theo">
              {room.nextMaintenance
                ? formatDate(room.nextMaintenance)
                : "Chưa lên lịch"}
            </Descriptions.Item>
            <Descriptions.Item label="Tiện nghi" span={2}>
              {room.amenities && room.amenities.length > 0
                ? (Array.isArray(room.amenities)
                    ? room.amenities
                    : typeof room.amenities === "string"
                    ? JSON.parse(room.amenities)
                    : []
                  ).map((item: string, index: number) => (
                    <Tag key={index} color="blue">
                      {item}
                    </Tag>
                  ))
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              {room.notes || "Không có ghi chú"}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {room.description || "Không có mô tả"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col xs={24} md={24} lg={8}>
        <Card title="Thống kê" bordered={false}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "8px" }}>Tỷ lệ lấp đầy:</div>
            <Progress
              percent={Math.round((room.occupiedBeds / room.capacity) * 100)}
              status="active"
            />
          </div>

          <Divider />

          <Timeline>
            <Timeline.Item color="green">
              Vệ sinh gần nhất:{" "}
              {room.lastCleaned ? formatDate(room.lastCleaned) : "Chưa có"}
            </Timeline.Item>
            <Timeline.Item color="blue">
              Bảo trì gần nhất:{" "}
              {maintenanceHistory && maintenanceHistory.length > 0
                ? formatDate(maintenanceHistory[0].date)
                : "Chưa có"}
            </Timeline.Item>
            <Timeline.Item color="red">
              Bảo trì tiếp theo:{" "}
              {room.nextMaintenance
                ? formatDate(room.nextMaintenance)
                : "Chưa lên lịch"}
            </Timeline.Item>
          </Timeline>
        </Card>
      </Col>
    </Row>
  );
};

export default RoomInfoTab; 