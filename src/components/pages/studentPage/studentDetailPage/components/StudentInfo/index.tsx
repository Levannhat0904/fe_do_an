import { FACULTY_OPTIONS } from "@/constants/values";
import { MAJOR_OPTIONS } from "@/constants/values";
import { StudentStatusEnum } from "@/constants/enums";
import { Student } from "@/types/student";
import { Button, Divider, Tag } from "antd";

import { Card } from "antd";

import { Descriptions } from "antd";
import dayjs from "dayjs";
import router from "next/router";

const StudentInfo = ({ student }: { student: Student }) => {
  const getStatusTag = (status?: string) => {
    if (!status) return <Tag color="default">Không có thông tin</Tag>;

    switch (status) {
      case StudentStatusEnum.active:
        return <Tag color="green">Đã duyệt</Tag>;
      case StudentStatusEnum.inactive:
        return <Tag color="red">Đã từ chối</Tag>;
      case StudentStatusEnum.pending:
        return <Tag color="orange">Chờ duyệt</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Thông tin cá nhân" className="shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ và tên">
            {student.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
          <Descriptions.Item label="Mã số sinh viên">
            {student.studentCode}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {student.gender === "male" ? "Nam" : "Nữ"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {student.birthDate
              ? dayjs(student.birthDate).format("DD/MM/YYYY")
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {student.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Tỉnh/Thành phố">
            {student.province}
          </Descriptions.Item>
          <Descriptions.Item label="Quận/Huyện">
            {student.district}
          </Descriptions.Item>
          <Descriptions.Item label="Phường/Xã">
            {student.ward}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {student.address}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(student.status)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin học tập" className="shadow-sm">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Khoa">
            {FACULTY_OPTIONS.find((f) => f.value === student.faculty)?.label ||
              student.faculty}
          </Descriptions.Item>
          <Descriptions.Item label="Ngành">
            {Object.values(MAJOR_OPTIONS)
              .flat()
              .find((m) => m.value === student.major)?.label || student.major}
          </Descriptions.Item>
          <Descriptions.Item label="Lớp">{student.className}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái sinh viên">
            {getStatusTag(student.status)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default StudentInfo;
