import React from "react";
import { Button, DatePicker, Drawer, Form, Input, Select } from "antd";
import { DrawerProps } from "antd/es/drawer";

interface DrawerEditStudentProps extends DrawerProps {
  open: boolean;
  onClose: () => void;
  student: any;
}

const DrawerEditStudent = (props: DrawerEditStudentProps) => {
  const { open, onClose, student } = props;
  const [form] = Form.useForm();
  return (
    <Drawer
      title="Thông tin sinh viên"
      open={open}
      onClose={onClose}
      width={600}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button type="primary" onClick={onClose}>
            Lưu
          </Button>
          <Button className="ml-2" onClick={onClose}>
            Hủy
          </Button>
        </div>
      }
      style={{ padding: 0 }}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        initialValues={
          {
            // ...student,
          }
        }
      >
        <Form.Item label="Họ tên" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Tỉnh/Thành phố" name="province">
          <Input />
        </Form.Item>
        <Form.Item label="Quận/Huyện" name="district">
          <Input />
        </Form.Item>
        <Form.Item label="Phòng" name="department">
          <Input />
        </Form.Item>
        <Form.Item label="Khoa" name="major">
          <Input />
        </Form.Item>
        <Form.Item label="Lớp" name="class_name">
          <Input />
        </Form.Item>
        <Form.Item label="Năm học" name="school_year">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="birth_date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Giới tính" name="gender">
          <Select
            options={[
              { value: "male", label: "Nam" },
              { value: "female", label: "Nữ" },
              { value: "other", label: "Khác" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select
            options={[
              { value: "active", label: "Hoạt động" },
              { value: "inactive", label: "Không hoạt động" },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerEditStudent;
