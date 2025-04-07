"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Tag,
  Descriptions,
  Row,
  Col,
  Typography,
  Button,
  Drawer,
  Space,
  message,
  Form,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  CalendarOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import EditStudentForm from "./components/EditStudentForm";
import DrawerEditStudent from "@/components/organisms/DrawerEditStudent";
const { Title } = Typography;

interface StudentDetailProps {
  student?: {
    id: number;
    user_id: number;
    student_code: string;
    full_name: string;
    gender: string;
    birth_date: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    department: string;
    major: string;
    class_name: string;
    school_year: number;
    avatar_path: string;
    citizen_id: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    status: string;
  };
}

const StudentDetailPage: React.FC<StudentDetailProps> = () => {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id;
  console.log("studentId", studentId);
  const [openDrawerEditStudent, setOpenDrawerEditStudent] = useState(false);
  const [studentDetail, setStudentDetail] = useState<any>(null);
  const [form] = Form.useForm();

  // TODO: get student detail from api
  // const getStudentDetail = async () => {
  //   const response = await axios.get(`/api/students/${studentId}`);
  //   setStudentDetail(response.data);
  // };
  // Fake data for demo - remove this when you have real data

  const student = {
    id: 1,
    user_id: 101,
    student_code: "ST001",
    full_name: "John Doe",
    gender: "male",
    birth_date: "2000-01-15",
    phone: "0123456789",
    address: "123 Main Street",
    province: "Province A",
    district: "District 1",
    ward: "Ward X",
    department: "Computer Science",
    major: "Software Engineering",
    class_name: "SE2023A",
    school_year: 2023,
    avatar_path: "/avatars/default.png",
    citizen_id: "123456789012",
    emergency_contact_name: "Jane Doe",
    emergency_contact_phone: "0987654321",
    emergency_contact_relationship: "Parent",
    status: "active",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Quay lại
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setOpenDrawerEditStudent(true)}
        >
          Chỉnh sửa
        </Button>
      </div>

      {/* Header Section */}
      <Card className="mb-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar
            size={120}
            src={student.avatar_path}
            icon={<UserOutlined />}
            className="shadow-lg"
          />
          <div className="text-center md:text-left">
            <Title level={3} className="mb-2">
              {student.full_name}
            </Title>
            <div className="space-y-2">
              <Tag color="blue" icon={<IdcardOutlined />}>
                {student.student_code}
              </Tag>
              <Tag color={student.status === "active" ? "green" : "red"}>
                {student.status.toUpperCase()}
              </Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* Information Grid */}
      <Row gutter={[16, 16]} className="[&>div]:flex mt-10">
        {/* Personal Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <UserOutlined />
                Thông tin cá nhân
              </span>
            }
            className="shadow-md w-full"
          >
            <Descriptions column={1} layout="horizontal" className="h-full">
              <Descriptions.Item label="Giới tính">
                {student.gender === "male" ? "Nam" : "Nữ"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {new Date(student.birth_date).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="CMND/CCCD">
                {student.citizen_id}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {student.phone}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Academic Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <BookOutlined />
                Thông tin học tập
              </span>
            }
            className="shadow-md w-full"
          >
            <Descriptions column={1} className="h-full">
              <Descriptions.Item label="Khoa">
                {student.department}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên ngành">
                {student.major}
              </Descriptions.Item>
              <Descriptions.Item label="Lớp">
                {student.class_name}
              </Descriptions.Item>
              <Descriptions.Item label="Niên khóa">
                {student.school_year}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Address Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <HomeOutlined />
                Thông tin địa chỉ
              </span>
            }
            className="shadow-md w-full"
          >
            <Descriptions column={1} className="h-full">
              <Descriptions.Item label="Địa chỉ">
                {student.address}
              </Descriptions.Item>
              <Descriptions.Item label="Phường/Xã">
                {student.ward}
              </Descriptions.Item>
              <Descriptions.Item label="Quận/Huyện">
                {student.district}
              </Descriptions.Item>
              <Descriptions.Item label="Tỉnh/Thành phố">
                {student.province}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Emergency Contact */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <PhoneOutlined />
                Thông tin liên hệ khẩn cấp
              </span>
            }
            className="shadow-md w-full"
          >
            <Descriptions column={1} className="h-full">
              <Descriptions.Item label="Họ tên">
                {student.emergency_contact_name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {student.emergency_contact_phone}
              </Descriptions.Item>
              <Descriptions.Item label="Mối quan hệ">
                {student.emergency_contact_relationship}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Edit Drawer */}
      <DrawerEditStudent
        open={openDrawerEditStudent}
        onClose={() => setOpenDrawerEditStudent(false)}
        student={student}
      />
    </div>
  );
};

export default StudentDetailPage;
