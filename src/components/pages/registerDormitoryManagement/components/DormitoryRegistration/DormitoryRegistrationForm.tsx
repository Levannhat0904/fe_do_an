import React from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  DatePicker,
  Space,
  Divider,
} from "antd";

interface Props {
  onSubmit: (values: any) => void;
}

const RegisterForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} scrollToFirstError>
      <Divider>Student Information</Divider>

      <Form.Item
        name="studentCode"
        label="Student Code"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
          <Select.Option value="other">Other</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="birth_date"
        label="Birth Date"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="citizen_id"
        label="Citizen ID"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="department"
        label="Department"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="major" label="Major" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="class_name" label="Class" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="school_year"
        label="School Year"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={6} style={{ width: "100%" }} />
      </Form.Item>

      <Divider>Emergency Contact</Divider>

      <Form.Item
        name="emergency_contact_name"
        label="Emergency Contact Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="emergency_contact_phone"
        label="Emergency Contact Phone"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="emergency_contact_relationship"
        label="Relationship"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Divider>Dormitory Registration Details</Divider>

      <Form.Item
        name="academic_year"
        label="Academic Year"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="1">Semester 1</Select.Option>
          <Select.Option value="2">Semester 2</Select.Option>
          <Select.Option value="summer">Summer</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="desired_room_type"
        label="Desired Room Type"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="family_situation" label="Family Situation">
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="scholarship_type" label="Scholarship Type">
        <Input />
      </Form.Item>

      <Form.Item name="distance_to_school" label="Distance to School (km)">
        <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="priority_category" label="Priority Category">
        <Input />
      </Form.Item>

      <Form.Item name="health_status" label="Health Status">
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="medical_conditions" label="Medical Conditions">
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="allergies" label="Allergies">
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="lifestyle_preferences" label="Lifestyle Preferences">
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="roommate_preferences" label="Roommate Preferences">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
