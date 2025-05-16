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
  Radio,
  Row,
  Col,
  Card,
  Divider,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  CameraOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { AdminProfile, Student } from "@/types/student";
import { useUpdateStudentProfile } from "@/api/student";
import { useAuth } from "@/contexts/AuthContext";
import { ACCEPT_IMAGE_FILE } from "@/constants";
import UploadCamera from "@/components/atoms/KIcons/UploadCamera";
import { UploadChangeParam } from "antd/es/upload";
import Image from "next/image";
import { RcFile } from "antd/es/upload";
import { fileToBase64 } from "@/utils/common";
import { LOGO_URL } from "../../../../constants/common";
import { KInput } from "@/components/atoms";
import {
  useGetProvinces,
  Province,
  Ward,
  District,
} from "@/api/administrative";
import { useGetDistricts, useGetWards } from "@/api/administrative";
import { FACULTY_OPTIONS, MAJOR_OPTIONS } from "@/constants/values";

const { Option } = Select;

interface StudentProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  student: AdminProfile | null;
  onSuccess?: () => void;
}

const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  open,
  onClose,
  student,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileAvatar, setFileAvatar] = useState<UploadFile | null>(null);
  const [displayAvatar, setDisplayAvatar] = useState(
    student?.profile?.avatarPath ? student?.profile?.avatarPath : LOGO_URL
  );
  const { data: provinces } = useGetProvinces();
  const [selectedProvince, setSelectedProvince] = useState<number>();
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const { data: districts } = useGetDistricts(selectedProvince!);
  const { data: wards } = useGetWards(selectedProvince!, selectedDistrict!);
  const [selectedFaculty, setSelectedFaculty] = useState<string>();

  const updateProfileMutation = useUpdateStudentProfile();

  useEffect(() => {
    if (student && open) {
      form.setFieldsValue({
        ...student,
        fullName: student.profile.fullName,
        studentCode: student.profile.studentCode,
        gender: student.profile.gender,
        phone: student.profile.phone,
        province: Number(student.profile.province),
        district: Number(student.profile.district),
        ward: Number(student.profile.ward),
        address: student.profile.address,
        faculty: student.profile.faculty,
        major: student.profile.major,
        className: student.profile.className,
        birthDate: student.profile.birthDate
          ? dayjs(student.profile.birthDate)
          : undefined,
      });
      if (student.profile.avatarPath) {
        setDisplayAvatar(student.profile.avatarPath);
      }
      setSelectedProvince(Number(student.profile.province));
      setSelectedDistrict(Number(student.profile.district));
      setSelectedFaculty(student.profile.role);
    }
  }, [student, open, form]);

  const handleSubmit = async (values: any) => {
    if (!student?.id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      console.log(fileAvatar);

      if (fileAvatar) {
        formData.append("avatarPath", fileAvatar as any);
      }

      Object.keys(values).forEach((key) => {
        if (key !== "avatarPath") {
          if (key === "birthDate" && values[key]) {
            formData.append(key, values[key].format("YYYY-MM-DD"));
          } else if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
          }
        }
      });

      await updateProfileMutation.mutateAsync({
        id: student.id,
        data: formData,
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error("Error updating student profile:", error);
      if (error?.response?.data?.field) {
        form.setFields([
          {
            name: error.response.data.field,
            errors: [error.response.data.message],
          },
        ]);
      } else {
        message.error(
          error?.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!"
        );
      }
    } finally {
      setLoading(false);
    }
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

  const handleProvinceChange = (value: number) => {
    setSelectedProvince(value);
    setSelectedDistrict(undefined);
    form.setFieldsValue({
      district: undefined,
      ward: undefined,
    });
  };

  const handleDistrictChange = (value: number) => {
    setSelectedDistrict(value);
    form.setFieldsValue({
      ward: undefined,
    });
  };

  const handleFacultyChange = (value: string) => {
    setSelectedFaculty(value);
    form.setFieldsValue({
      major: undefined,
    });
  };

  const filterOption = (input: string, option?: { children: string }) => {
    return (option?.children || "").toLowerCase().includes(input.toLowerCase());
  };

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
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="animate-fadeIn"
        >
          {/* Phần ảnh chân dung */}
          <div className="relative w-full flex justify-center mb-6">
            <Upload
              accept={ACCEPT_IMAGE_FILE}
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleUploadFile}
            >
              <div className="relative cursor-pointer">
                <Image
                  src={displayAvatar}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover aspect-square border-2 border-gray-300"
                />
                <div className="absolute left-1/2 transform bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 shadow-md">
                  <CameraOutlined className="text-2xl text-gray-600 cursor-pointer" />
                </div>
              </div>
            </Upload>
          </div>

          {/* Phần 1: Thông tin cá nhân */}
          <Divider orientation="left" className="!text-gray-600 !s4-semibold">
            Thông tin cá nhân
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Mã số sinh viên"
                name="studentCode"
                rules={[
                  { required: true, message: "Vui lòng nhập mã số sinh viên!" },
                ]}
              >
                <KInput
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập MSSV"
                  disabled
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <KInput placeholder="Nhập họ tên đầy đủ" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                  <Radio value="other">Khác</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Ngày sinh"
                name="birthDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker
                  className="!rounded-lg !sbody-code !h-12 w-full"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Phần 2: Thông tin liên lạc */}
          <Divider orientation="left" className="!text-gray-600 !s4-semibold">
            Thông tin liên lạc
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <KInput
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Email cá nhân"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <KInput
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Nhập email cá nhân"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Phần 3: Thông tin địa chỉ */}
          <Divider orientation="left" className="!text-gray-600 !s4-semibold">
            Thông tin địa chỉ
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
                ]}
              >
                <Select
                  className="!rounded-lg !sbody-code !h-12 w-full"
                  showSearch
                  placeholder="Chọn tỉnh/thành phố"
                  onChange={handleProvinceChange}
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  {provinces?.map((province: Province) => (
                    <Option key={province.code} value={province.code}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Quận/Huyện"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện!" },
                ]}
              >
                <Select
                  className="!rounded-lg !sbody-code !h-12 w-full"
                  showSearch
                  placeholder="Chọn quận/huyện"
                  disabled={!selectedProvince}
                  onChange={handleDistrictChange}
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  {districts?.data?.map((district: District) => (
                    <Option key={district.code} value={district.code}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Phường/Xã"
                name="ward"
                rules={[
                  { required: true, message: "Vui lòng chọn phường/xã!" },
                ]}
              >
                <Select
                  className="!rounded-lg !sbody-code !h-12 w-full"
                  showSearch
                  placeholder="Chọn phường/xã"
                  disabled={!selectedDistrict}
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  {wards?.data?.map((ward: Ward) => (
                    <Option key={ward.code} value={ward.code}>
                      {ward.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Địa chỉ chi tiết"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ chi tiết!",
                  },
                ]}
              >
                <KInput
                  suffix={<HomeOutlined className="text-gray-400" />}
                  placeholder="Số nhà, tên đường..."
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Phần 4: Thông tin học vụ */}
          <Divider orientation="left" className="!text-gray-600 !s4-semibold">
            Thông tin học vụ
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Khoa"
                name="faculty"
                rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
              >
                <Select
                  className="!rounded-lg !sbody-code !h-12 w-full"
                  showSearch
                  placeholder="Chọn khoa"
                  onChange={handleFacultyChange}
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  {FACULTY_OPTIONS.map((faculty: any) => (
                    <Option key={faculty.value} value={faculty.value}>
                      {faculty.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Chuyên ngành"
                name="major"
                rules={[
                  { required: true, message: "Vui lòng chọn chuyên ngành!" },
                ]}
              >
                <Select
                  className="!rounded-lg !sbody-code !h-12 w-full"
                  showSearch
                  placeholder="Chọn chuyên ngành"
                  disabled={!selectedFaculty}
                  filterOption={filterOption}
                  optionFilterProp="children"
                >
                  {selectedFaculty &&
                    MAJOR_OPTIONS[selectedFaculty]?.map((major) => (
                      <Option key={major.value} value={major.value}>
                        {major.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Lớp"
                name="className"
                rules={[{ required: true, message: "Vui lòng nhập lớp!" }]}
              >
                <KInput placeholder="Nhập tên lớp" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );
};

export default StudentProfileDrawer;
