import { Student } from "@/types/student";
import { Card, Descriptions } from "antd";
import dayjs from "dayjs";
import React from "react";
type Iprops = {
  student: Student;
  dormitory: any;
};
const DormitoryInfo = (props: Iprops) => {
  const { student, dormitory } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Thông tin đăng ký" className="shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã đăng ký">
            123
            {/* {dormitory.applicationId} */}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đăng ký">
            123
            {/* {dayjs(dormitory.registrationDate).format("DD/MM/YYYY")} */}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            123
            {/* {getStatusBadge(dormitory.approvalStatus)} */}
          </Descriptions.Item>
          {dormitory.approvalStatus === "approved" && (
            <>
              <Descriptions.Item label="Người duyệt">
                {dormitory.approvedBy || "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày duyệt">
                {dormitory.approvalDate
                  ? dayjs(dormitory.approvalDate).format("DD/MM/YYYY")
                  : "Chưa có"}
              </Descriptions.Item>
            </>
          )}
          {dormitory.approvalStatus === "rejected" && (
            <Descriptions.Item label="Lý do từ chối">
              {dormitory.rejectionReason || "Không có lý do"}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Học kỳ">
            {`Học kỳ ${dormitory.semester}, năm học ${dormitory.schoolYear}`}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin phòng ở" className="shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tòa nhà">
            ds
            {/* {dormitory.buildingName} */}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng">
            {dormitory.roomNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Giường">
            {dormitory.bedNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Phí hàng tháng">
            21212
            {/* {dormitory.monthlyFee.toLocaleString("vi-VN")} đồng */}
          </Descriptions.Item>
          <Descriptions.Item label="Tiền đặt cọc">
            232
            {/* {dormitory.depositAmount.toLocaleString("vi-VN")} đồng */}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            sdl
            {/* {getPaymentStatusBadge(dormitory.paymentStatus)} */}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày check-in">
            {dormitory.checkInDate
              ? dayjs(dormitory.checkInDate).format("DD/MM/YYYY")
              : "Chưa check-in"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày check-out">
            {dormitory.checkOutDate
              ? dayjs(dormitory.checkOutDate).format("DD/MM/YYYY")
              : "Chưa check-out"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default DormitoryInfo;
