import React from "react";
import { Modal, Descriptions, Tag, Badge, Image, Divider } from "antd";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import maintenanceApi from "@/api/maintenance";

interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  roomId: number;
  buildingId: number;
  roomNumber: string;
  buildingName: string;
  date: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  requestedBy: string;
  resolvedAt?: string;
  resolutionNote?: string;
  cost?: number;
  staff?: string;
  images?: string[];
}

interface MaintenanceDetailModalProps {
  request: MaintenanceRequest;
  isOpen: boolean;
  onClose: () => void;
}

const swiperStyles = `
  .maintenance-swiper {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  .maintenance-swiper .swiper-button-next,
  .maintenance-swiper .swiper-button-prev {
    color: #fa8c16;
  }
  .maintenance-swiper .swiper-pagination-bullet-active {
    background: #fa8c16;
  }
`;

const MaintenanceDetailModal: React.FC<MaintenanceDetailModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!request) return null;

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge status="warning" text="Chờ xử lý" />;
      case "processing":
        return <Badge status="processing" text="Đang xử lý" />;
      case "completed":
        return <Badge status="success" text="Hoàn thành" />;
      case "canceled":
        return <Badge status="error" text="Đã hủy" />;
      case "rejected":
        return <Badge status="error" text="Từ chối" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const renderPriority = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Tag color="red">Khẩn cấp</Tag>;
      case "high":
        return <Tag color="orange">Cao</Tag>;
      case "normal":
        return <Tag color="blue">Trung bình</Tag>;
      case "low":
        return <Tag color="green">Thấp</Tag>;
      default:
        return <Tag>{priority}</Tag>;
    }
  };

  const renderType = (type: string) => {
    // Các loại bảo trì phổ biến
    switch (type.toLowerCase()) {
      case "repair":
      case "sửa chữa":
        return <Tag color="volcano">Sửa chữa</Tag>;
      case "cleaning":
      case "vệ sinh":
        return <Tag color="green">Vệ sinh</Tag>;
      case "inspection":
      case "kiểm tra":
        return <Tag color="blue">Kiểm tra</Tag>;
      default:
        // Loại bảo trì tùy chỉnh
        return <Tag color="purple">{type}</Tag>;
    }
  };

  const imageGallery =
    request.images &&
    Array.isArray(request.images) &&
    request.images.length > 0 ? (
      <>
        <style>{swiperStyles}</style>
        <Divider orientation="left">Hình ảnh</Divider>
        <div style={{ width: "100%", maxWidth: "100%", marginTop: "20px" }}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="maintenance-swiper"
            spaceBetween={0}
            slidesPerView={1}
            loop={false}
            style={{
              width: "100%",
              margin: "0 auto",
            }}
          >
            {request.images.map((path: string, index: number) => (
              <SwiperSlide key={index} style={{ width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f0f2f5",
                    borderRadius: "8px",
                    overflow: "hidden",
                    padding: "10px",
                  }}
                >
                  <Image
                    src={path}
                    alt={`Ảnh ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "280px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </>
    ) : null;

  return (
    <Modal
      title="Chi tiết yêu cầu bảo trì"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Mã yêu cầu">
          {request.requestNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Phòng">
          {request.buildingName} - {request.roomNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Loại yêu cầu">
          {renderType(request.type)}
        </Descriptions.Item>
        <Descriptions.Item label="Mức độ ưu tiên">
          {renderPriority(request.priority)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {renderStatus(request.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {dayjs(request.date).format("DD/MM/YYYY HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Người yêu cầu" span={2}>
          {request.requestedBy || "Quản trị viên"}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {request.description}
        </Descriptions.Item>
        {request.resolvedAt && (
          <Descriptions.Item label="Ngày hoàn thành">
            {dayjs(request.resolvedAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        )}
        {request.staff && (
          <Descriptions.Item label="Nhân viên xử lý">
            {request.staff}
          </Descriptions.Item>
        )}
        {request.cost !== undefined && request.cost !== null && (
          <Descriptions.Item label="Chi phí">
            {Number(request.cost).toLocaleString("vi-VN")} đ
          </Descriptions.Item>
        )}
        {request.resolutionNote && (
          <Descriptions.Item label="Ghi chú xử lý" span={2}>
            {request.resolutionNote}
          </Descriptions.Item>
        )}
      </Descriptions>
      {imageGallery}
    </Modal>
  );
};

export default MaintenanceDetailModal; 