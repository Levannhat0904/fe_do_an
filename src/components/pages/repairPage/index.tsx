"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Row,
  Col,
  Badge,
  Tooltip,
  Modal,
  Form,
  InputNumber,
  notification,
  Tabs,
  DatePicker,
  Upload,
  Spin,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import debounce from "lodash/debounce";

import buildingApi from "@/api/building";
import dayjs from "dayjs";
import MaintenanceDetailModal from "./MaintenanceDetailModal";
import { useRouter } from "next/navigation";
import maintenanceApi from "@/api/maintenance";
import roomApi from "@/api/room";
import { convertToJpg, getBase64 } from "@/utils/common";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  roomId: number;
  buildingId: number;
  roomNumber: string;
  buildingName: string;
  date: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  requestedBy: string;
  resolvedAt?: string;
  resolutionNote?: string;
  cost?: number;
  staff?: string;
  images?: string[];
}

const RepairPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const router = useRouter();

  const [rooms, setRooms] = useState<{ id: number; roomNumber: string }[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);

  // Fetch maintenance requests
  const fetchMaintenanceRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await maintenanceApi.getAllMaintenanceRequests({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        buildingId: buildingFilter,
        searchText: searchText || undefined,
        page,
        limit,
      });

      setMaintenanceRequests(response.data);
      setPagination({
        current: response.pagination.currentPage,
        pageSize: response.pagination.itemsPerPage,
        total: response.pagination.totalItems,
      });
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu yêu cầu bảo trì. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchText, statusFilter, priorityFilter, buildingFilter, page, limit]);

  // Fetch buildings for dropdown
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await buildingApi.getAllBuildings();
        setBuildings(response.data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  // Fetch rooms by building
  const fetchRoomsByBuilding = useCallback(async (buildingId: number) => {
    try {
      // Gọi API để lấy tất cả các phòng
      const response = await roomApi.getRooms();
      
      // Lọc phòng theo buildingId
      const filteredRooms = response.data.filter(room => room.buildingId === buildingId);
      
      const roomsList = filteredRooms.map(room => ({
        id: room.id,
        roomNumber: room.roomNumber
      }));
      
      setRooms(roomsList);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceRequests();
  }, [fetchMaintenanceRequests]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setPriorityFilter("");
    setBuildingFilter(undefined);
    setPage(1);
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleViewDetail = (record: MaintenanceRequest) => {
    setSelectedRequest(record);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedRequest(null);
    setIsDetailModalOpen(false);
  };

  const handleAddRequest = () => {
    form.resetFields();
    setFileList([]);
    setIsAddModalOpen(true);
  };

  const handleBuildingChange = (buildingId: number) => {
    setSelectedBuildingId(buildingId);
    form.setFieldsValue({ roomId: undefined }); // Reset room selection
    fetchRoomsByBuilding(buildingId);
  };

  const handleAddRequestSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      const formData = new FormData();
      formData.append("buildingId", values.buildingId);
      formData.append("roomId", values.roomId);
      formData.append("type", values.type);
      formData.append("description", values.description);
      formData.append("priority", values.priority);
      
      // Chuyển đổi và thêm ảnh nếu có
      if (fileList.length > 0) {
        const convertPromises = fileList.map(async (file) => {
          if (file.originFileObj) {
            try {
              // Chuyển đổi ảnh sang JPG trước khi thêm vào FormData
              const jpgFile = await convertToJpg(file.originFileObj);
              return jpgFile;
            } catch (error) {
              console.error("Lỗi khi chuyển đổi ảnh:", error);
              return file.originFileObj; // Sử dụng file gốc nếu chuyển đổi thất bại
            }
          }
          return null;
        });
        
        const convertedFiles = await Promise.all(convertPromises);
        convertedFiles.forEach(file => {
          if (file) {
            formData.append("images", file);
          }
        });
      }
      
      await maintenanceApi.addMaintenanceRequest(formData);
      
      notification.success({
        message: "Thành công",
        description: "Đã thêm yêu cầu bảo trì mới",
      });
      
      setIsAddModalOpen(false);
      fetchMaintenanceRequests();
    } catch (error) {
      console.error("Error adding maintenance request:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm yêu cầu bảo trì. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessRequest = (record: MaintenanceRequest) => {
    const nextStatus = record.status === 'pending' ? 'processing' : 'completed';
    const actionText = record.status === 'pending' ? 'xử lý' : 'hoàn thành';
    
    Modal.confirm({
      title: `Xác nhận ${actionText} yêu cầu`,
      content: `Bạn có chắc chắn muốn ${actionText} yêu cầu bảo trì này không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await maintenanceApi.processMaintenanceRequest(record.id, {
            status: nextStatus
          });
          
          notification.success({
            message: "Thành công",
            description: `Đánh dấu ${actionText} yêu cầu bảo trì`,
          });
          
          fetchMaintenanceRequests();
        } catch (error) {
          console.error("Error processing maintenance request:", error);
          notification.error({
            message: "Lỗi",
            description: `Không thể đánh dấu ${actionText} yêu cầu bảo trì. Vui lòng thử lại sau.`,
          });
        }
      },
    });
  };

  const handleDeleteRequest = async (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa yêu cầu bảo trì này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await maintenanceApi.deleteMaintenanceRequest(id);
          
          notification.success({
            message: "Thành công",
            description: "Đã xóa yêu cầu bảo trì",
          });
          
          fetchMaintenanceRequests();
        } catch (error) {
          console.error("Error deleting maintenance request:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa yêu cầu bảo trì. Vui lòng thử lại sau.",
          });
        }
      },
    });
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge status="warning" text="Chờ xử lý" />;
      case "processing":
        return <Badge status="processing" text="Đang xử lý" />;
      case "completed":
        return <Badge status="success" text="Hoàn thành" />;
      case "canceled":
        return <Badge status="error" text="Đã hủy" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const renderPriority = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Tag color="red">Khẩn cấp</Tag>;
      case "high":
        return <Tag color="orange">Cao</Tag>;
      case "normal":
        return <Tag color="blue">Trung bình</Tag>;
      case "low":
        return <Tag color="green">Thấp</Tag>;
      default:
        return <Tag>{priority}</Tag>;
    }
  };

  const renderType = (type: string) => {
    // Các loại bảo trì phổ biến
    switch (type.toLowerCase()) {
      case "repair":
      case "sửa chữa":
        return <Tag color="volcano">Sửa chữa</Tag>;
      case "cleaning":
      case "vệ sinh":
        return <Tag color="green">Vệ sinh</Tag>;
      case "inspection":
      case "kiểm tra":
        return <Tag color="blue">Kiểm tra</Tag>;
      default:
        // Loại bảo trì tùy chỉnh
        return <Tag color="purple">{type}</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestNumber",
      key: "requestNumber",
      width: 120,
    },
    {
      title: "Phòng",
      dataIndex: "roomNumber",
      key: "roomNumber",
      width: 100,
      render: (text: string, record: MaintenanceRequest) => (
        <span>
          {record.buildingName} - {text}
        </span>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: renderType,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requestedBy",
      key: "requestedBy",
      width: 150,
      render: (requestedBy: string | null) => requestedBy || "Quản trị viên",
    },
    {
      title: "Mức độ",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: renderPriority,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: renderStatus,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 400,
      render: (_: any, record: MaintenanceRequest) => (
        <Space size="small">
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleProcessRequest(record)}
            >
              Đánh dấu xử lý
            </Button>
          )}
          {record.status === "processing" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => handleProcessRequest(record)}
            >
              Đánh dấu hoàn thành
            </Button>
          )}
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRequest(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise(resolve => {
        if (file.originFileObj) {
          getBase64(file.originFileObj, (url: string) => {
            resolve(url);
          });
        }
      });
    }
    
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  return (
    <div className="p-6">
      <Card title="Quản lý bảo trì" className="mb-6">
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Tìm kiếm theo mã, phòng, mô tả..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            value={statusFilter || undefined}
            allowClear
          >
            <Option value="pending">Chờ xử lý</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="canceled">Đã hủy</Option>
          </Select>
          <Select
            placeholder="Mức độ ưu tiên"
            style={{ width: 150 }}
            onChange={(value) => {
              setPriorityFilter(value);
              setPage(1);
            }}
            value={priorityFilter || undefined}
            allowClear
          >
            <Option value="urgent">Khẩn cấp</Option>
            <Option value="high">Cao</Option>
            <Option value="normal">Trung bình</Option>
            <Option value="low">Thấp</Option>
          </Select>
          <Select
            placeholder="Tòa nhà"
            style={{ width: 200 }}
            onChange={(value) => {
              setBuildingFilter(value);
              setPage(1);
            }}
            value={buildingFilter}
            allowClear
          >
            {buildings.map((building) => (
              <Option key={building.id} value={building.id}>
                {building.name}
              </Option>
            ))}
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={resetFilters}
          >
            Đặt lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRequest}
            style={{ marginLeft: "auto" }}
          >
            Thêm yêu cầu mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={maintenanceRequests}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} yêu cầu`,
          }}
          loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal chi tiết yêu cầu bảo trì */}
      {selectedRequest && (
        <MaintenanceDetailModal
          request={selectedRequest}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Modal thêm yêu cầu bảo trì */}
      <Modal
        title="Thêm yêu cầu bảo trì mới"
        open={isAddModalOpen}
        onOk={handleAddRequestSubmit}
        onCancel={() => setIsAddModalOpen(false)}
        confirmLoading={isSubmitting}
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={{ priority: "normal" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buildingId"
                label="Tòa nhà"
                rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
              >
                <Select 
                  placeholder="Chọn tòa nhà"
                  onChange={handleBuildingChange}
                >
                  {buildings.map((building) => (
                    <Option key={building.id} value={building.id}>
                      {building.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomId"
                label="Phòng"
                rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
              >
                <Select 
                  placeholder={selectedBuildingId ? "Chọn phòng" : "Vui lòng chọn tòa nhà trước"}
                  disabled={!selectedBuildingId}
                >
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.roomNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại bảo trì"
                rules={[{ required: true, message: "Vui lòng nhập loại bảo trì" }]}
              >
                <Input placeholder="Nhập loại bảo trì" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                rules={[{ required: true, message: "Vui lòng chọn mức độ ưu tiên" }]}
              >
                <Select placeholder="Chọn mức độ ưu tiên" defaultValue="normal">
                  <Option value="urgent">Khẩn cấp</Option>
                  <Option value="high">Cao</Option>
                  <Option value="normal">Trung bình</Option>
                  <Option value="low">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>
          <Form.Item name="images" label="Hình ảnh">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
              onPreview={handlePreview}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước ảnh */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default RepairPage;