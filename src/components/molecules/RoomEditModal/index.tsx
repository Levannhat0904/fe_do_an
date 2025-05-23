import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Button } from 'antd';

interface RoomEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  form: any;
}

const RoomEditModal: React.FC<RoomEditModalProps> = ({
  visible,
  onCancel,
  onSave,
  form,
}) => {
  return (
    <Modal
      title="Chỉnh sửa thông tin phòng"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSave}>
          Lưu thay đổi
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="roomNumber"
              label="Số phòng"
              rules={[{ required: true, message: "Vui lòng nhập số phòng!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="floor"
              label="Tầng"
              rules={[{ required: true, message: "Vui lòng nhập tầng!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="capacity"
              label="Sức chứa"
              rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={10} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Loại phòng"
              rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
            >
              <Select>
                <Select.Option value="nam">Nam</Select.Option>
                <Select.Option value="nữ">Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="monthlyFee"
              label="Giá phòng (VNĐ/tháng)"
              rules={[{ required: true, message: "Vui lòng nhập giá phòng!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={100000}
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
              name="roomArea"
              label="Diện tích (m²)"
              rules={[{ required: true, message: "Vui lòng nhập diện tích!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="amenities" label="Tiện nghi">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Chọn hoặc nhập tiện nghi"
          >
            <Select.Option value="Điều hòa">Điều hòa</Select.Option>
            <Select.Option value="Tủ lạnh">Tủ lạnh</Select.Option>
            <Select.Option value="Máy giặt">Máy giặt</Select.Option>
            <Select.Option value="Wifi">Wifi</Select.Option>
            <Select.Option value="Bàn học">Bàn học</Select.Option>
            <Select.Option value="Máy nước nóng">Máy nước nóng</Select.Option>
            <Select.Option value="Tủ quần áo">Tủ quần áo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomEditModal; 