"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  message,
  Spin,
  Avatar,
  UploadFile,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Student } from "@/types/student";
import { useUpdateStudentProfile } from "@/api/student";
import { useAuth } from "@/contexts/AuthContext";
import { ACCEPT_IMAGE_FILE } from "@/constants";
import UploadCamera from "@/components/atoms/KIcons/UploadCamera";
import { UploadChangeParam } from "antd/es/upload";
import Image from "next/image";
import { RcFile } from "antd/es/upload";
import { fileToBase64 } from "@/utils/common";
import { LOGO_URL } from "../../../../constants/common";
const { Option } = Select;

interface StudentProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccess?: () => void;
}

const genderOptions = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
];

const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  open,
  onClose,
  student,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const { adminProfile } = useAuth();
  const [fileAvatar, setFileAvatar] = useState<UploadFile | null>(null);
  const [displayAvatar, setDisplayAvatar] = useState(
    student?.avatarPath
      ? `http://localhost:3000${student?.avatarPath}`
      : LOGO_URL
  );

  const updateProfileMutation = useUpdateStudentProfile();
  console.log("student", student);
  useEffect(() => {
    if (student && open) {
      form.setFieldsValue({
        ...student,
        province: student.province?.toString(),
        district: student.district?.toString(),
        ward: student.ward?.toString(),
        birthDate: student.birthDate ? dayjs(student.birthDate) : undefined,
      });
      if (student.avatarPath) {
        setDisplayAvatar(`http://localhost:3000${student.avatarPath}`);
      }
    }
  }, [student, open, form]);

  const handleSubmit = async (values: any) => {
    if (!student?.id) return;

    try {
      setLoading(true);
      const formData = new FormData();

      // For student users, we always allow them to update their own profile
      // without needing to check IDs, since this component is only visible to them
      // for their own profile
      const isAdmin = adminProfile?.userType === "admin";

      // Add debug logging
      console.log("Student profile update - User:", adminProfile);
      console.log("Student profile being updated:", student);

      // Xử lý file upload nếu có
      if (fileAvatar) {
        formData.append("avatarPath", fileAvatar.originFileObj as Blob);
      }

      // Thêm các field khác
      Object.keys(values).forEach((key) => {
        if (key !== "avatarPath") {
          if (key === "birthDate" && values[key]) {
            formData.append(key, values[key].format("YYYY-MM-DD"));
          } else if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
          }
        }
      });

      // Gọi API cập nhật thông tin sinh viên
      await updateProfileMutation.mutateAsync({
        id: student.id,
        data: formData,
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error updating student profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      // Kiểm tra định dạng file
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được tải lên file ảnh!");
        return Upload.LIST_IGNORE;
      }

      // Kiểm tra kích thước file (tối đa 2MB)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return Upload.LIST_IGNORE;
      }

      return false; // Không tự động upload ngay
    },
    onChange: ({ fileList }: any) => {
      setFileList(fileList);
    },
    fileList,
    maxCount: 1,
  };
  const handleUploadFile = useCallback(
    async (info: UploadChangeParam<UploadFile>) => {
      const file = info?.file;
      if (!file) {
        return;
      }
      setFileAvatar(file);
      try {
        const base64String = await fileToBase64(file as RcFile);
        if (base64String) {
          setDisplayAvatar(base64String);
        } else {
          setDisplayAvatar("");
        }
      } catch (error) {
        setDisplayAvatar("");
      }
    },
    []
  );

  return (
    <Drawer
      title="Chỉnh sửa thông tin sinh viên"
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <div className="flex space-x-2">
          <Button onClick={onClose} icon={<CloseOutlined />}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={updateProfileMutation.isPending || loading}
            icon={<SaveOutlined />}
            style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="animate-fadeIn"
        >
          <div className="relative w-full flex justify-center mt-3">
            <Upload
              accept={ACCEPT_IMAGE_FILE}
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleUploadFile}
            >
              <div className="relative cursor-pointer">
                <Image
                  src={student?.avatarPath ? displayAvatar : ""}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover aspect-square border-2 border-gray-300"
                />
                <div className="absolute  left-1/2 transform bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 shadow-md">
                  <CameraOutlined className="text-2xl text-gray-600 cursor-pointer" />
                </div>
              </div>
            </Upload>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin cơ bản */}
            <div className="col-span-2">
              <h2 className="text-lg font-medium mb-4 text-orange-500">
                Thông tin cơ bản
              </h2>
            </div>

            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="studentCode"
              label="Mã sinh viên"
              rules={[
                { required: true, message: "Vui lòng nhập mã sinh viên" },
              ]}
            >
              <Input disabled placeholder="Mã sinh viên" />
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select placeholder="Chọn giới tính">
                {genderOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
              name="avatarPath"
              label="Ảnh đại diện"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload {...uploadProps} listType="picture">
                <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
              </Upload>
            </Form.Item> */}

            {/* Thông tin liên hệ */}
            <div className="col-span-2 mt-4">
              <h2 className="text-lg font-medium mb-4 text-orange-500">
                Thông tin liên hệ
              </h2>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            {/* Thông tin địa chỉ */}
            <div className="col-span-2 mt-4">
              <h2 className="text-lg font-medium mb-4 text-orange-500">
                Địa chỉ thường trú
              </h2>
            </div>

            <Form.Item name="province" label="Tỉnh/Thành phố">
              <Input placeholder="Nhập tỉnh/thành phố" />
            </Form.Item>

            <Form.Item name="district" label="Quận/Huyện">
              <Input placeholder="Nhập quận/huyện" />
            </Form.Item>

            <Form.Item name="ward" label="Phường/Xã">
              <Input placeholder="Nhập phường/xã" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ chi tiết"
              className="col-span-2"
            >
              <Input placeholder="Nhập địa chỉ chi tiết" />
            </Form.Item>

            {/* Thông tin học vụ */}
            <div className="col-span-2 mt-4">
              <h2 className="text-lg font-medium mb-4 text-orange-500">
                Thông tin học vụ
              </h2>
            </div>

            <Form.Item name="faculty" label="Khoa">
              <Input placeholder="Nhập khoa" />
            </Form.Item>

            <Form.Item name="major" label="Ngành">
              <Input placeholder="Nhập ngành học" />
            </Form.Item>

            <Form.Item name="className" label="Lớp">
              <Input placeholder="Nhập lớp" />
            </Form.Item>
          </div>
        </Form>
      )}
    </Drawer>
  );
};

export default StudentProfileDrawer;
