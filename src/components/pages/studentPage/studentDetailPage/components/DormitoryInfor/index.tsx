import { Student } from "@/types/student";
import { Card, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";

interface Dormitory {
  id: number;
  buildingId: number;
  buildingName: string;
  roomId: number;
  roomNumber: string;
  bedNumber: string;
  semester: string;
  schoolYear: string;
  checkInDate: string;
  checkOutDate: string;
  contractId?: number;
  monthlyFee: number;
  depositAmount: number;
  status: string;
}

type Iprops = {
  student: Student;
  dormitory: Dormitory;
};

const DormitoryInfo = (props: Iprops) => {
  const { student, dormitory } = props;

  const getStatusBadge = (status: string) => {
    if (!status) return <Tag color="default">Không có thông tin</Tag>;

    switch (status.toLowerCase()) {
      case "active":
        return <Tag color="success">Đang ở</Tag>;
      case "inactive":
        return <Tag color="error">Đã rời đi</Tag>;
      case "pending":
        return <Tag color="warning">Chờ duyệt</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (!status) return <Tag color="default">Không có thông tin</Tag>;

    switch (status.toLowerCase()) {
      case "paid":
        return <Tag color="success">Đã thanh toán</Tag>;
      case "unpaid":
        return <Tag color="error">Chưa thanh toán</Tag>;
      case "partial":
        return <Tag color="warning">Thanh toán một phần</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  if (!dormitory || Object.keys(dormitory).length === 0) {
    return (
      <Card title="Thông tin ký túc xá" className="shadow-sm">
        <div className="text-center text-gray-500 py-4">
          Sinh viên chưa đăng ký ở ký túc xá
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Thông tin đăng ký" className="shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã phòng">
            {dormitory.roomId}
          </Descriptions.Item>
          <Descriptions.Item label="Học kỳ">
            {`Học kỳ ${dormitory.semester}, năm học ${dormitory.schoolYear}`}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {getStatusBadge(dormitory.status)}
          </Descriptions.Item>
          {dormitory.contractId && (
            <Descriptions.Item label="Mã hợp đồng">
              {dormitory.contractId}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="Thông tin phòng ở" className="shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tòa nhà">
            {dormitory.buildingName}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng">
            {dormitory.roomNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Giường">
            {dormitory.bedNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Phí hàng tháng">
            {Number(dormitory.monthlyFee).toLocaleString("vi-VN")} đồng
          </Descriptions.Item>
          <Descriptions.Item label="Tiền đặt cọc">
            {Number(dormitory.depositAmount).toLocaleString("vi-VN")} đồng
          </Descriptions.Item>
          {/* <Descriptions.Item label="Ngày check-in">
            {dormitory.checkInDate
              ? dayjs(dormitory.checkInDate).format("DD/MM/YYYY")
              : "Chưa check-in"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày check-out">
            {dormitory.checkOutDate
              ? dayjs(dormitory.checkOutDate).format("DD/MM/YYYY")
              : "Chưa check-out"}
          </Descriptions.Item> */}
        </Descriptions>
      </Card>
    </div>
  );
};

export default DormitoryInfo;
