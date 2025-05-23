import React from 'react';
import { Modal, Form, InputNumber, DatePicker, Row, Col, Button } from 'antd';

interface AddUtilityModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  form: any;
  selectedInvoice: any;
  monthFormat: string;
  dateFormat: string;
}

const AddUtilityModal: React.FC<AddUtilityModalProps> = ({
  visible,
  onCancel,
  onSave,
  form,
  selectedInvoice,
  monthFormat,
  dateFormat,
}) => {
  return (
    <Modal
      title={
        selectedInvoice
          ? "Cập nhật hóa đơn tiện ích"
          : "Thêm hóa đơn tiện ích"
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSave}>
          {selectedInvoice ? "Cập nhật" : "Thêm hóa đơn"}
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="invoiceMonth"
          label="Kỳ hóa đơn"
          rules={[{ required: true, message: "Vui lòng chọn kỳ hóa đơn" }]}
        >
          <DatePicker
            picker="month"
            format={monthFormat}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="electricity"
              label="Số điện (kWh)"
              rules={[{ required: true, message: "Vui lòng nhập số điện" }]}
            >
              <InputNumber
                min={0}
                placeholder="Nhập số điện"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="water"
              label="Số nước (m³)"
              rules={[
                { required: true, message: "Vui lòng nhập số nước" },
                {
                  validator: (_, value) => {
                    if (value > 9999) {
                      return Promise.reject(
                        "Giá trị số nước quá lớn, tối đa 9,999 m³"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                min={0}
                max={9999}
                placeholder="Nhập số nước"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serviceFee"
              label="Phí dịch vụ (VNĐ)"
              initialValue={100000}
            >
              <InputNumber
                min={0}
                placeholder="Nhập phí dịch vụ"
                style={{ width: "100%" }}
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
              name="dueDate"
              label="Ngày đến hạn"
              rules={[
                { required: true, message: "Vui lòng chọn ngày đến hạn" },
              ]}
            >
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                placeholder="Chọn ngày đến hạn"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddUtilityModal; 