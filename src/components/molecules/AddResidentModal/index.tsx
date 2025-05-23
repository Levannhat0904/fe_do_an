import React from 'react';
import { Modal, Form, Input, Radio, Row, Col, Button } from 'antd';

interface AddResidentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  form: any;
}

const AddResidentModal: React.FC<AddResidentModalProps> = ({
  visible,
  onCancel,
  onSave,
  form,
}) => {
  return (
    <Modal
      title="Thêm sinh viên vào phòng"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSave}>
          Thêm sinh viên
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="studentCode"
              label="Mã sinh viên"
              rules={[{ required: true, message: "Vui lòng nhập mã sinh viên!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="joinDate"
              label="Ngày vào"
              rules={[{ required: true, message: "Vui lòng chọn ngày vào!" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="Ngày ra dự kiến"
              rules={[
                { required: true, message: "Vui lòng chọn ngày ra dự kiến!" },
              ]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddResidentModal; 