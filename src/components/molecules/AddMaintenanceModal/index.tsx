import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, InputNumber } from 'antd';

interface AddMaintenanceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  form: any;
}

const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
  visible,
  onCancel,
  onSave,
  form,
}) => {
  return (
    <Modal
      title="Thêm lịch sử bảo trì"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSave}>
          Thêm bảo trì
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Ngày thực hiện"
              rules={[
                { required: true, message: "Vui lòng chọn ngày thực hiện!" },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Loại bảo trì"
              rules={[{ required: true, message: "Vui lòng chọn loại bảo trì!" }]}
            >
              <Select>
                <Select.Option value="repair">Sửa chữa</Select.Option>
                <Select.Option value="cleaning">Vệ sinh</Select.Option>
                <Select.Option value="inspection">Kiểm tra</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả công việc!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="cost"
              label="Chi phí (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập chi phí!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={10000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: string | undefined): number => {
                  if (!value) return 0;
                  const parsedValue = value.replace(/\$\s?|(,*)/g, "");
                  return Number(parsedValue);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="staff"
              label="Nhân viên thực hiện"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhân viên!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Select.Option value="completed">Hoàn thành</Select.Option>
            <Select.Option value="in-progress">Đang thực hiện</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMaintenanceModal; 