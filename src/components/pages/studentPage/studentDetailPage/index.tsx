"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Button,
  Tabs,
  Tag,
  Spin,
  Modal,
  Form,
  Input,
  notification,
  Timeline,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  HistoryOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API_URL } from "@/constants/values";
import {
  useGetStudentById,
  useActiveStudent,
  useRejectStudent,
} from "@/api/student";
import { StudentStatusEnum } from "@/constants/enums";
import { Student, Dormitory, History, Roommate } from "@/types/student";
import StudentInfo from "./components/StudentInfo";
import StudentStatus from "./components/StudentStatus";
import Image from "next/image";
import StudentAction from "./components/StudentAction";
import FormEditRoom from "./components/FormEditRoom";
import DormitoryInfo from "./components/DormitoryInfor";
import RoommateInfo from "./components/RoommateInfo";
import dayjs from "dayjs";
import HistoryTimeline from "./components/HistoryTimeline";
const StudentDormitoryDetail = () => {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { data: student, isLoading, error, refetch } = useGetStudentById(id);
  const [modal, contextHolder] = Modal.useModal();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [showActiveStudentModal, setShowActiveStudentModal] = useState(false);
  const [showRejectStudentModal, setShowRejectStudentModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [form] = Form.useForm();
  const {
    mutate: activeStudent,
    isPending: isActiveStudentLoading,
    isSuccess: isActiveStudentSuccess,
    isError: isActiveStudentError,
  } = useActiveStudent(String(student?.id));
  const {
    mutate: rejectStudent,
    isPending: isRejectStudentLoading,
    isSuccess: isRejectStudentSuccess,
    isError: isRejectStudentError,
  } = useRejectStudent(String(student?.id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center text-red-500">
            <ExclamationCircleOutlined className="text-4xl mb-4" />
            <h2 className="text-xl">
              Đã xảy ra lỗi khi tải thông tin sinh viên
            </h2>
            {/* <p>{error}</p> */}
            <Button
              type="primary"
              className="mt-4"
              onClick={() => router.push("/quan-ly-ky-tuc-xa")}
            >
              Quay lại danh sách
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  const dormitory = {} as Dormitory;
  const history = [
    // fake data
    {
      id: 1,
      description: "Đăng ký ký túc xá",
      date: "2024-01-01",
      user: "Nguyễn Văn A",
    },
    {
      id: 2,
      description: "Đăng ký ký túc xá",
      date: "2024-01-01",
      user: "Nguyễn Văn A",
    },
    {
      id: 3,
      description: "Đăng ký ký túc xá",
      date: "2024-01-01",
      user: "Nguyễn Văn A",
    },
  ];
  const roommates = [
    {
      id: 1,
      studentCode: "1234567890",
      fullName: "Nguyễn Văn A",
      gender: "male",
      status: "pending",
    },
    {
      id: 2,
      studentCode: "1234567890",
      fullName: "Nguyễn Văn A",
      gender: "male",
      status: "pending",
    },
    {
      id: 3,
      studentCode: "1234567890",
      fullName: "Nguyễn Văn A",
      gender: "male",
      status: "pending",
    },
  ];

  const handleActiveStudent = () => {
    setShowActiveStudentModal(true);
  };
  const { confirm } = Modal;

  const confirmApproval = () => {
    confirm({
      title: "Xác nhận phê duyệt",
      content: `Bạn có chắc chắn muốn phê duyệt đơn đăng ký ký túc xá của sinh viên ${student?.fullName}?`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          activeStudent(undefined, {
            onSuccess: () => {
              notification.success({
                message: "Phê duyệt thành công",
                description: `Đã phê duyệt đăng ký ký túc xá cho sinh viên ${student?.fullName}`,
              });
              refetch();
              resolve(true);
            },
            onError: (error) => {
              notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi phê duyệt đăng ký ký túc xá",
              });
              reject(false);
            },
          });
        });
      },
    });
  };

  const handleRejectStudent = () => {
    setShowRejectStudentModal(true);
  };

  const confirmReject = () => {
    confirm({
      title: "Xác nhận từ chối",
      content: `Bạn có chắc chắn muốn từ chối đơn đăng ký ký túc xá của sinh viên ${student?.fullName}?`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          rejectStudent(undefined, {
            onSuccess: () => {
              notification.success({
                message: "Từ chối thành công",
                description: `Đã từ chối đăng ký ký túc xá cho sinh viên ${student?.fullName}`,
              });
              refetch();
              resolve(true);
            },
            onError: (error) => {
              notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi từ chối đăng ký ký túc xá",
              });
              reject(false);
            },
          });
        });
      },
    });
  };

  const handleEdit = () => {
    form.setFieldsValue({
      buildingName: dormitory.buildingName,
      roomNumber: dormitory.roomNumber,
      bedNumber: dormitory.bedNumber,
      semester: dormitory.semester,
      schoolYear: dormitory.schoolYear,
    });
    Modal.confirm({
      title: "Chỉnh sửa thông tin phòng ở",
      width: 600,
      content: <FormEditRoom form={form} student={student!} />,
      onOk: () => {
        const values = form.getFieldsValue();
        // Gọi API cập nhật thông tin
        notification.success({
          message: "Cập nhật thành công",
          description: "Đã cập nhật thông tin phòng ở của sinh viên",
        });
      },
    });
  };

  const handlePrint = () => {
    notification.info({
      message: "Đang in...",
      description: "Đang chuẩn bị tài liệu để in",
    });
  };

  const handleBack = () => {
    router.push("/quan-ly-sinh-vien");
  };

  const timelineItems = history.map((item) => ({
    children: (
      <div>
        <p className="font-semibold">{item.description}</p>
        <p className="text-sm text-gray-500">
          {dayjs(item.date).format("DD/MM/YYYY HH:mm")} - {item.user}
        </p>
      </div>
    ),
    color:
      item.action === "register"
        ? "blue"
        : item.action === "payment"
        ? "green"
        : "gray",
  }));

  return (
    <div className="p-6">
      <Card className="mb-6">
        <div className="flex md:flex-row flex-col justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-50 rounded-full mr-4">
              <div className="w-16 h-16">
                {student?.avatarPath ? (
                  <Image
                    src={`${API_URL}${student?.avatarPath}`}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="rounded-full aspect-square object-contain w-full h-full"
                  />
                ) : (
                  <UserOutlined className="text-4xl text-blue-500" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{student?.fullName}</h1>
              <p className="text-gray-500">
                {student?.studentCode} | {student?.className}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-lg mb-2 flex items-center">
              <span className="mr-2">Trạng thái:</span>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: StudentStatusEnum.active,
                      label: "Phê duyệt",
                      onClick: () => confirmApproval(),
                    },
                    {
                      key: StudentStatusEnum.inactive,
                      label: "Từ chối",
                      onClick: () => confirmReject(),
                    },
                    {
                      key: StudentStatusEnum.pending,
                      label: "Chờ duyệt",
                      disabled: student?.status === StudentStatusEnum.pending,
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <div className="cursor-pointer flex items-center gap-2 hover:opacity-80">
                  <StudentStatus status={student?.status} />
                  <DownOutlined className="text-sm" />
                </div>
              </Dropdown>
            </div>
            <StudentAction
              student={student!}
              handleEdit={handleEdit}
              handlePrint={handlePrint}
              handleBack={handleBack}
              loading={isActiveStudentLoading || isRejectStudentLoading}
            />
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "info",
              label: "Thông tin sinh viên",
              icon: <UserOutlined />,
              children: <StudentInfo student={student!} />,
            },
            {
              key: "dormitory",
              icon: <HomeOutlined />,
              label: "Thông tin ký túc xá",
              children: (
                <DormitoryInfo student={student!} dormitory={dormitory} />
              ),
            },
            {
              key: "roommates",
              label: "Bạn cùng phòng",
              icon: <UserOutlined />,
              children: (
                <RoommateInfo dormitory={dormitory} roommates={roommates} />
              ),
            },
            {
              key: "history",
              label: "Lịch sử hoạt động",
              icon: <HistoryOutlined />,
              children: <HistoryTimeline timelineItems={timelineItems} />,
            },
          ]}
        />
      </Card>

      {/* {contextHolder} */}
    </div>
  );
};

export default StudentDormitoryDetail;
