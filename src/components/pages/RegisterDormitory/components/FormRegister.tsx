"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Radio,
  Upload,
  message,
  Row,
  Col,
  Card,
  Divider,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import KButton from "@/components/atoms/KButton";
import { useCreateStudentRegistration } from "@/api/student";
import { UploadFile } from "antd/es/upload/interface";
const { Option } = Select;
const { TextArea } = Input;

const StudentForm = () => {
  const { mutate: createStudentRegistration, isPending } =
    useCreateStudentRegistration();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onFinish = (values: any) => {
    setLoading(true);
    const payload = {
      ...values,
      birthDate: values.birthDate.format("YYYY-MM-DD"),
      avatarPath: values.avatarPath,
    };
    createStudentRegistration(payload);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Bạn chỉ có thể tải lên file ảnh!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title={
          <span className="text-xl s3-semibold text-amber-500">
            ĐĂNG KÝ THÔNG TIN SINH VIÊN
          </span>
        }
        bordered={false}
        className="shadow-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="mt-4"
        >
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
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập MSSV"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ tên đầy đủ" />
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
                  className="w-full"
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
                <Input
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
                <Input
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
                <Select placeholder="Chọn tỉnh/thành phố">
                  <Option value="hanoi">Hà Nội</Option>
                  <Option value="hcm">TP. Hồ Chí Minh</Option>
                  {/* Thêm các tỉnh thành khác */}
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
                <Select placeholder="Chọn quận/huyện">
                  <Option value="thanhxuan">Thanh Xuân</Option>
                  <Option value="caugiay">Cầu Giấy</Option>
                  {/* Thêm các quận huyện khác */}
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
                <Select placeholder="Chọn phường/xã">
                  <Option value="phuong1">Phường 1</Option>
                  <Option value="phuong2">Phường 2</Option>
                  {/* Thêm các phường xã khác */}
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
                <TextArea
                  rows={1}
                  // prefix={<HomeOutlined className="text-gray-400" />}
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
                <Select placeholder="Chọn khoa">
                  <Option value="cntt">Công nghệ thông tin</Option>
                  <Option value="kt">Kinh tế</Option>
                  {/* Thêm các khoa khác */}
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
                <Select placeholder="Chọn chuyên ngành">
                  <Option value="khmt">Khoa học máy tính</Option>
                  <Option value="ktqt">Kinh tế quốc tế</Option>
                  {/* Thêm các chuyên ngành khác */}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={12}>
              <Form.Item
                label="Lớp"
                name="className"
                rules={[{ required: true, message: "Vui lòng nhập lớp!" }]}
              >
                <Input placeholder="Nhập tên lớp" />
              </Form.Item>
            </Col>
          </Row>

          {/* Phần 5: Ảnh chân dung */}
          <Divider orientation="left" className="!text-gray-600 !s4-semibold">
            Ảnh chân dung
          </Divider>

          <Form.Item
            name="avatarPath"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Vui lòng tải lên ảnh chân dung!" },
            ]}
          >
            <Upload
              {...uploadProps}
              listType="picture"
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
            </Upload>
          </Form.Item>

          {/* Nút submit */}
          <Form.Item className="mt-8">
            <div className="flex justify-center gap-4">
              <KButton
                type="primary"
                htmlType="submit"
                // loading={loading}
                className="bg-blue-600 hover:bg-blue-700 px-6 h-10 font-medium"
              >
                Lưu thông tin
              </KButton>

              <KButton
                htmlType="button"
                onClick={() => form.resetFields()}
                className="border-gray-300 hover:border-blue-500 px-6 h-10 font-medium"
              >
                Nhập lại
              </KButton>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StudentForm;
