import React from "react";
import { Form, Input, DatePicker, Select, Row, Col, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

interface EditStudentFormProps {
  form: any;
  initialValues: any;
}

const EditStudentForm: React.FC<EditStudentFormProps> = ({
  form,
  initialValues,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      // initialValues={
      //   {
      //     // ...initialValues,
      //     // birth_date: dayjs(initialValues.birth_date),
      //   }
      // }
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="student_code"
            label="Mã sinh viên"
            rules={[{ required: true, message: "Vui lòng nhập mã sinh viên" }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="birth_date"
            label="Ngày sinh"
            // rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker 
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="citizen_id"
            label="CMND/CCCD"
            rules={[{ required: true, message: "Vui lòng nhập CMND/CCCD" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Title level={5} className="mt-4">
        Thông tin địa chỉ
      </Title>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="province"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Title level={5} className="mt-4">
        Thông tin học tập
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="department"
            label="Khoa"
            rules={[{ required: true, message: "Vui lòng nhập khoa" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="major"
            label="Chuyên ngành"
            rules={[{ required: true, message: "Vui lòng nhập chuyên ngành" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="class_name"
            label="Lớp"
            rules={[{ required: true, message: "Vui lòng nhập lớp" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="school_year"
            label="Niên khóa"
            rules={[{ required: true, message: "Vui lòng nhập niên khóa" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Title level={5} className="mt-4">
        Thông tin liên hệ khẩn cấp
      </Title>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="emergency_contact_name"
            label="Họ tên người liên hệ"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên người liên hệ" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="emergency_contact_phone"
            label="Số điện thoại liên hệ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại liên hệ",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="emergency_contact_relationship"
            label="Mối quan hệ"
            rules={[{ required: true, message: "Vui lòng nhập mối quan hệ" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EditStudentForm;
