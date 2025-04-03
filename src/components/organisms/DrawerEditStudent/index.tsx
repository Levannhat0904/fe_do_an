import React from "react";
import { DatePicker, Drawer, Form, Input, Select } from "antd";
import { DrawerProps } from "antd/es/drawer";

interface DrawerEditStudentProps extends DrawerProps {
  open: boolean;
  onClose: () => void;
  student: any;
}
// {
//   id: 2,
//   user_id: 102,
//   student_code: "ST002",
//   full_name: "Alice Smith",
//   gender: "female",
//   birth_date: "2001-03-20",
//   phone: "0123456788",
//   address: "456 Oak Avenue",
//   province: "Province B",
//   district: "District 2",
//   ward: "Ward Y",
//   department: "Computer Science",
//   major: "Data Science",
//   class_name: "DS2023A",
//   school_year: 2023,
//   avatar_path: "/avatars/default.png",
//   citizen_id: "123456789013",
//   emergency_contact_name: "Bob Smith",
//   emergency_contact_phone: "0987654322",
//   emergency_contact_relationship: "Parent",
//   status: "active",
// },
const DrawerEditStudent = (props: DrawerEditStudentProps) => {
  const { open, onClose, student } = props;
  return (
    <Drawer
      title="Thông tin sinh viên"
      open={open}
      onClose={onClose}
      width={500}
    >
      <Form>
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
