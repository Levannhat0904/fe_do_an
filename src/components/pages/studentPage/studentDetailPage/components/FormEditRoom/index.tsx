import { Student } from "@/types/student";
import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

type IProps = {
  form: FormInstance;
  student: Student;
};

const FormEditRoom = (props: IProps) => {
  const { form, student } = props;
  return (
    <Form form={form} layout="vertical" className="mt-4">
      <Form.Item name="buildingName" label="Tòa nhà">
        <Select>
          <Select.Option value="Tòa nhà A">Tòa nhà A</Select.Option>
          <Select.Option value="Tòa nhà B">Tòa nhà B</Select.Option>
          <Select.Option value="Tòa nhà C">Tòa nhà C</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="roomNumber" label="Số phòng">
        <Input />
      </Form.Item>
      <Form.Item name="bedNumber" label="Số giường">
        <Input />
      </Form.Item>
      <Form.Item name="semester" label="Học kỳ">
        <Select>
          <Select.Option value="1">Học kỳ 1</Select.Option>
          <Select.Option value="2">Học kỳ 2</Select.Option>
          <Select.Option value="3">Học kỳ hè</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="schoolYear" label="Năm học">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default FormEditRoom;
