"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  notification,
  Typography,
  Row,
  Col,
  Tag,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import buildingApi, { Building } from "@/api/building";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const BuildingPage: React.FC = () => {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await buildingApi.getAllBuildings();
      setBuildings(response.data);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách tòa nhà. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (building?: Building) => {
    setEditingBuilding(building || null);
    if (building) {
      form.setFieldsValue({
        name: building.name,
        totalFloors: building.totalFloors,
        description: building.description,
        status: building.status,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingBuilding) {
        // Update existing building
        await buildingApi.updateBuilding(editingBuilding.id, values);
        notification.success({
          message: "Thành công",
          description: `Cập nhật tòa nhà ${values.name} thành công`,
        });
      } else {
        // Create new building
        await buildingApi.createBuilding(values);
        notification.success({
          message: "Thành công",
          description: `Thêm tòa nhà ${values.name} thành công`,
        });
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchBuildings();
    } catch (error: any) {
      console.error("Form submission error:", error);
      notification.error({
        message: "Lỗi",
        description:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lưu thông tin tòa nhà",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await buildingApi.deleteBuilding(id);
      notification.success({
        message: "Thành công",
        description: "Xóa tòa nhà thành công",
      });
      fetchBuildings();
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa tòa nhà",
      });
    }
  };

  const handleViewDetails = (id: number) => {
    router.push(`/quan-ly-toa-nha/${id}`);
  };

  const columns = [
    {
      title: "Tên tòa nhà",
      dataIndex: "name",
      key: "name",
      sorter: (a: Building, b: Building) => a.name.localeCompare(b.name),
    },
    {
      title: "Số tầng",
      dataIndex: "totalFloors",
      key: "totalFloors",
      sorter: (a: Building, b: Building) => a.totalFloors - b.totalFloors,
    },
    {
      title: "Tổng số phòng",
      dataIndex: "totalRooms",
      key: "totalRooms",
      sorter: (a: Building, b: Building) =>
        (a.totalRooms || 0) - (b.totalRooms || 0),
      render: (totalRooms: number) => totalRooms || 0,
    },
    {
      title: "Phòng trống",
      dataIndex: "availableRooms",
      key: "availableRooms",
      render: (availableRooms: number, record: Building) => {
        const total = record.totalRooms || 0;
        const available = availableRooms || 0;
        return `${available}/${total}`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "green";
        let text = "Hoạt động";

        if (status === "maintenance") {
          color = "orange";
          text = "Bảo trì";
        } else if (status === "inactive") {
          color = "red";
          text = "Ngừng hoạt động";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Building) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tòa nhà?"
            description="Bạn có chắc chắn muốn xóa tòa nhà này? Hành động này không thể hoàn tác."
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.totalRooms ? record.totalRooms > 0 : false}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="building-page">
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2}>Quản lý tòa nhà</Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
              >
                Thêm tòa nhà
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchBuildings}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          dataSource={buildings}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} tòa nhà`,
          }}
        />
      </Card>

      {/* Modal for adding/editing buildings */}
      <Modal
        title={editingBuilding ? "Chỉnh sửa tòa nhà" : "Thêm tòa nhà mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleFormSubmit}
        okText={editingBuilding ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="name"
            label="Tên tòa nhà"
            rules={[{ required: true, message: "Vui lòng nhập tên tòa nhà" }]}
          >
            <Input placeholder="Nhập tên tòa nhà (VD: Tòa nhà A)" />
          </Form.Item>

          <Form.Item
            name="totalFloors"
            label="Số tầng"
            rules={[
              { required: true, message: "Vui lòng nhập số tầng" },
              { type: "number", min: 1, message: "Số tầng phải lớn hơn 0" },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập số tầng"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="active"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Hoạt động</Option>
              <Option value="maintenance">Bảo trì</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea
              rows={4}
              placeholder="Nhập mô tả cho tòa nhà (không bắt buộc)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BuildingPage;
