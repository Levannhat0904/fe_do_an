"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  Tag,
  Space,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Tooltip,
  Row,
  Col,
  Table,
  Badge,
  Progress,
  Divider,
  Empty,
  Timeline,
  Radio,
  InputNumber,
  List,
  Avatar
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ToolOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  StopOutlined,
  ExportOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

interface RoomDetailData {
  room: {
    id: number;
    buildingName: string;
    roomNumber: string;
    floor: number;
    capacity: number;
    occupied: number;
    type: string;
    monthlyFee: number;
    status: string;
    lastCleaned: string;
    nextMaintenance: string;
    createdAt: string;
    amenities: string[];
    description: string;
    roomArea: number;
    notes: string;
  };
  residents: any[];
  maintenanceHistory: any[];
  pendingRequests: any[];
  utilities: any[];
}

// Mock API hook - Thay thế bằng API thực tế
const useGetRoomDetail = (id: number) => {
  const [data, setData] = useState<RoomDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    const mockData = {
      room: {
        id: id,
        buildingName: "Tòa nhà A",
        roomNumber: `A${Math.floor(id / 10) + 1}0${id % 10}`,
        floor: Math.floor(id / 10) + 1,
        capacity: 4,
        occupied: 3,
        type: id % 2 === 0 ? "nam" : "nữ",
        monthlyFee: 600000,
        status: "active",
        lastCleaned: "2024-03-15T10:30:00",
        nextMaintenance: "2024-05-20T00:00:00",
        createdAt: "2023-08-10T00:00:00",
        amenities: ["Điều hòa", "Tủ lạnh", "Máy giặt", "Wifi", "Bàn học"],
        description: "Phòng 4 người với đầy đủ tiện nghi sinh hoạt",
        roomArea: 32, // m2
        notes: "Phòng đã được sửa chữa quạt trần vào ngày 10/03/2024"
      },
      residents: [
        {
          id: 101,
          studentCode: "SV000101",
          fullName: "Nguyễn Văn A",
          gender: "male",
          phone: "0987654321",
          email: "nguyenvana@example.com",
          status: "approved",
          joinDate: "2023-09-05T00:00:00",
          endDate: "2024-06-30T00:00:00",
          bedNumber: "01",
          paymentStatus: "paid"
        },
        {
          id: 102,
          studentCode: "SV000102",
          fullName: "Trần Văn B",
          gender: "male",
          phone: "0987654322",
          email: "tranvanb@example.com",
          status: "approved",
          joinDate: "2023-09-05T00:00:00",
          endDate: "2024-06-30T00:00:00",
          bedNumber: "02",
          paymentStatus: "partial"
        },
        {
          id: 103,
          studentCode: "SV000103",
          fullName: "Lê Thị C",
          gender: "female",
          phone: "0987654323",
          email: "lethic@example.com",
          status: "approved",
          joinDate: "2023-09-10T00:00:00",
          endDate: "2024-06-30T00:00:00",
          bedNumber: "03",
          paymentStatus: "paid"
        }
      ],
      maintenanceHistory: [
        {
          id: 1,
          date: "2024-03-10T09:30:00",
          type: "repair",
          description: "Sửa chữa quạt trần",
          cost: 150000,
          staff: "Kỹ thuật viên Nguyễn Văn X",
          status: "completed"
        },
        {
          id: 2,
          date: "2024-02-15T14:00:00",
          type: "cleaning",
          description: "Vệ sinh định kỳ",
          cost: 200000,
          staff: "Nhân viên vệ sinh Trần Thị Y",
          status: "completed"
        },
        {
          id: 3,
          date: "2024-01-05T10:00:00",
          type: "inspection",
          description: "Kiểm tra hệ thống điện",
          cost: 0,
          staff: "Kỹ thuật viên Phạm Văn Z",
          status: "completed"
        }
      ],
      pendingRequests: [
        {
          id: 201,
          date: "2024-04-05T08:45:00",
          type: "maintenance",
          description: "Báo hỏng bóng đèn phòng tắm",
          requestedBy: "Nguyễn Văn A",
          status: "pending",
          priority: "medium"
        },
        {
          id: 202,
          date: "2024-04-01T10:30:00",
          type: "complaint",
          description: "Tiếng ồn từ phòng bên cạnh sau 23:00",
          requestedBy: "Trần Văn B",
          status: "processing",
          priority: "low"
        }
      ],
      utilities: [
        {
          id: 301,
          month: "03/2024",
          electricity: 250, // kWh
          water: 12, // m3
          electricityCost: 500000,
          waterCost: 120000,
          otherFees: 80000,
          totalCost: 700000,
          dueDate: "2024-04-15T00:00:00",
          status: "unpaid"
        },
        {
          id: 302,
          month: "02/2024",
          electricity: 240, // kWh
          water: 10, // m3
          electricityCost: 480000,
          waterCost: 100000,
          otherFees: 80000,
          totalCost: 660000,
          dueDate: "2024-03-15T00:00:00",
          status: "paid",
          paidDate: "2024-03-10T00:00:00"
        }
      ]
    };

    // Giả lập API call
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 800);
  }, [id]);

  return { data, isLoading, error };
};

const RoomDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id;

  const [activeTab, setActiveTab] = useState("info");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addResidentModalVisible, setAddResidentModalVisible] = useState(false);
  const [addMaintenanceModalVisible, setAddMaintenanceModalVisible] = useState(false);
  const [addUtilityModalVisible, setAddUtilityModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useGetRoomDetail(roomId);

  // Handle edit room
  const handleEditRoom = () => {
    form.setFieldsValue({
      roomNumber: data?.room.roomNumber,
      floor: data?.room.floor,
      capacity: data?.room.capacity,
      type: data?.room.type,
      monthlyFee: data?.room.monthlyFee,
      amenities: data?.room.amenities,
      description: data?.room.description,
      roomArea: data?.room.roomArea,
      notes: data?.room.notes
    });
    setEditModalVisible(true);
  };

  const handleSaveRoom = () => {
    form.validateFields().then(values => {
      // Call API to update room data
      notification.success({
        message: "Cập nhật thành công",
        description: `Đã cập nhật thông tin phòng ${data?.room.roomNumber}`
      });
      setEditModalVisible(false);
    });
  };

  // Add resident handler
  const handleAddResident = () => {
    form.resetFields();
    setAddResidentModalVisible(true);
  };

  const handleSaveResident = () => {
    form.validateFields().then(values => {
      // Call API to add resident
      notification.success({
        message: "Thêm sinh viên thành công",
        description: `Đã thêm sinh viên ${values.fullName} vào phòng ${data?.room.roomNumber}`
      });
      setAddResidentModalVisible(false);
    });
  };

  // Add maintenance handler
  const handleAddMaintenance = () => {
    form.resetFields();
    setAddMaintenanceModalVisible(true);
  };

  const handleSaveMaintenance = () => {
    form.validateFields().then(values => {
      // Call API to add maintenance record
      notification.success({
        message: "Thêm bảo trì thành công",
        description: `Đã thêm lịch bảo trì cho phòng ${data?.room.roomNumber}`
      });
      setAddMaintenanceModalVisible(false);
    });
  };

  // Add utility handler
  const handleAddUtility = () => {
    form.resetFields();
    setAddUtilityModalVisible(true);
  };

  const handleSaveUtility = () => {
    form.validateFields().then(values => {
      // Call API to add utility record
      notification.success({
        message: "Thêm hóa đơn thành công",
        description: `Đã thêm hóa đơn tiện ích tháng ${values.month} cho phòng ${data?.room.roomNumber}`
      });
      setAddUtilityModalVisible(false);
    });
  };

  // Handle resident removal
  const showRemoveConfirm = (resident) => {
    Modal.confirm({
      title: 'Xác nhận xóa sinh viên',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa sinh viên ${resident.fullName} khỏi phòng này?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        // Call API to remove resident
        notification.success({
          message: 'Xóa thành công',
          description: `Đã xóa sinh viên ${resident.fullName} khỏi phòng ${data?.room.roomNumber}`
        });
      }
    });
  };

  // Handle request processing
  const handleProcessRequest = (request) => {
    Modal.confirm({
      title: 'Xử lý yêu cầu',
      content: `Xác nhận xử lý yêu cầu "${request.description}"?`,
      okText: 'Xử lý',
      cancelText: 'Hủy',
      onOk() {
        // Call API to process request
        notification.success({
          message: 'Đã cập nhật',
          description: `Yêu cầu đã được chuyển sang trạng thái xử lý`
        });
      }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', margin: '50px' }}>
        <Result
          status="error"
          title="Lỗi tải dữ liệu"
          subTitle="Không thể tải thông tin phòng. Vui lòng thử lại sau."
          extra={
            <Button type="primary" onClick={() => router.push('/rooms')}>
              Quay lại danh sách phòng
            </Button>
          }
        />
      </div>
    );
  }

  const { room, residents, maintenanceHistory, pendingRequests, utilities } = data;

  // Column definitions for residents table
  const residentColumns = [
    {
      title: 'Mã SV',
      dataIndex: 'studentCode',
      key: 'studentCode',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender === 'male' ? 'Nam' : 'Nữ',
    },
    {
      title: 'Giường',
      dataIndex: 'bedNumber',
      key: 'bedNumber',
    },
    {
      title: 'Ngày vào',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => formatDate(date),
    },
    {
      title: 'Ngày ra dự kiến',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => formatDate(date),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        if (status === 'paid') {
          return <Badge status="success" text="Đã thanh toán" />;
        } else if (status === 'partial') {
          return <Badge status="warning" text="Thanh toán một phần" />;
        } else {
          return <Badge status="error" text="Chưa thanh toán" />;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => showRemoveConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Column definitions for maintenance history table
  const maintenanceColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        switch (type) {
          case 'repair': return <Tag color="volcano">Sửa chữa</Tag>;
          case 'cleaning': return <Tag color="green">Vệ sinh</Tag>;
          case 'inspection': return <Tag color="blue">Kiểm tra</Tag>;
          default: return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Chi phí',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost) => formatCurrency(cost),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'staff',
      key: 'staff',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'completed') {
          return <Badge status="success" text="Hoàn thành" />;
        } else if (status === 'in-progress') {
          return <Badge status="processing" text="Đang thực hiện" />;
        } else {
          return <Badge status="default" text={status} />;
        }
      },
    },
  ];

  // Column definitions for pending requests table
  const requestColumns = [
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        switch (type) {
          case 'maintenance': return <Tag color="blue">Bảo trì</Tag>;
          case 'complaint': return <Tag color="red">Khiếu nại</Tag>;
          default: return <Tag>{type}</Tag>;
        }
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Người yêu cầu',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
    },
    {
      title: 'Mức độ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        switch (priority) {
          case 'high': return <Tag color="red">Cao</Tag>;
          case 'medium': return <Tag color="orange">Trung bình</Tag>;
          case 'low': return <Tag color="green">Thấp</Tag>;
          default: return <Tag>{priority}</Tag>;
        }
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'pending') {
          return <Badge status="warning" text="Chờ xử lý" />;
        } else if (status === 'processing') {
          return <Badge status="processing" text="Đang xử lý" />;
        } else if (status === 'completed') {
          return <Badge status="success" text="Hoàn thành" />;
        } else {
          return <Badge status="default" text={status} />;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleProcessRequest(record)}
            >
              Xử lý
            </Button>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Column definitions for utilities table
  const utilityColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Điện (kWh)',
      dataIndex: 'electricity',
      key: 'electricity',
    },
    {
      title: 'Nước (m³)',
      dataIndex: 'water',
      key: 'water',
    },
    {
      title: 'Chi phí điện',
      dataIndex: 'electricityCost',
      key: 'electricityCost',
      render: (cost) => formatCurrency(cost),
    },
    {
      title: 'Chi phí nước',
      dataIndex: 'waterCost',
      key: 'waterCost',
      render: (cost) => formatCurrency(cost),
    },
    {
      title: 'Phí khác',
      dataIndex: 'otherFees',
      key: 'otherFees',
      render: (cost) => formatCurrency(cost),
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost) => formatCurrency(cost),
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        if (status === 'paid') {
          return <Badge status="success" text={`Đã thanh toán (${formatDate(record.paidDate)})`} />;
        } else {
          return <Badge status="error" text="Chưa thanh toán" />;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'unpaid' && (
            <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
              Đánh dấu đã thu
            </Button>
          )}
          <Button size="small" icon={<ExportOutlined />}>
            Xuất hóa đơn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Space>
            <Button icon={<RollbackOutlined />} onClick={() => router.push('/rooms')}>
              Quay lại
            </Button>
            <h2 style={{ margin: 0 }}>Chi tiết phòng {room.roomNumber}</h2>
            {room.status === 'active' ? (
              <Tag color="green">Đang hoạt động</Tag>
            ) : (
              <Tag color="red">Ngừng hoạt động</Tag>
            )}
          </Space>
          <Space>
            <Button icon={<EditOutlined />} type="primary" onClick={handleEditRoom}>
              Chỉnh sửa thông tin
            </Button>
            {room.status === 'active' ? (
              <Button icon={<StopOutlined />} danger>
                Ngừng hoạt động
              </Button>
            ) : (
              <Button icon={<CheckCircleOutlined />} type="primary">
                Kích hoạt
              </Button>
            )}
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'info',
              label: (
                <span>
                  <HomeOutlined /> Thông tin phòng
                </span>
              ),
              children: (
                <>
                  <Row gutter={24}>
                    <Col span={16}>
                      <Card title="Thông tin cơ bản" bordered={false}>
                        <Descriptions bordered column={2}>
                          <Descriptions.Item label="Tòa nhà">{room.buildingName}</Descriptions.Item>
                          <Descriptions.Item label="Số phòng">{room.roomNumber}</Descriptions.Item>
                          <Descriptions.Item label="Tầng">{room.floor}</Descriptions.Item>
                          <Descriptions.Item label="Diện tích">{room.roomArea} m²</Descriptions.Item>
                          <Descriptions.Item label="Loại phòng">{room.type === 'nam' ? 'Nam' : 'Nữ'}</Descriptions.Item>
                          <Descriptions.Item label="Sức chứa">{room.occupied}/{room.capacity} người</Descriptions.Item>
                          <Descriptions.Item label="Giá phòng">{formatCurrency(room.monthlyFee)}/tháng</Descriptions.Item>
                          <Descriptions.Item label="Ngày tạo">{formatDate(room.createdAt)}</Descriptions.Item>
                          <Descriptions.Item label="Vệ sinh gần nhất">{formatDate(room.lastCleaned)}</Descriptions.Item>
                          <Descriptions.Item label="Bảo trì tiếp theo">{formatDate(room.nextMaintenance)}</Descriptions.Item>
                          <Descriptions.Item label="Tiện nghi" span={2}>
                            {room.amenities.map((item, index) => (
                              <Tag key={index} color="blue">{item}</Tag>
                            ))}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ghi chú" span={2}>
                            {room.notes}
                          </Descriptions.Item>
                          <Descriptions.Item label="Mô tả" span={2}>
                            {room.description}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="Thống kê" bordered={false}>
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ marginBottom: '8px' }}>Tỷ lệ lấp đầy:</div>
                          <Progress
                            percent={Math.round((room.occupied / room.capacity) * 100)}
                            status="active"
                          />
                        </div>

                        <Divider />

                        <Timeline>
                          <Timeline.Item color="green">Vệ sinh gần nhất: {formatDate(room.lastCleaned)}</Timeline.Item>
                          <Timeline.Item color="blue">Bảo trì gần nhất: {formatDate(maintenanceHistory[0].date)}</Timeline.Item>
                          <Timeline.Item color="red">Bảo trì tiếp theo: {formatDate(room.nextMaintenance)}</Timeline.Item>
                        </Timeline>
                      </Card>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: 'residents',
              label: (
                <span>
                  <UserOutlined /> Sinh viên ({residents.length})
                </span>
              ),
              children: (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Danh sách sinh viên</h3>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddResident}>
                      Thêm sinh viên
                    </Button>
                  </div>
                  <Table
                    columns={residentColumns}
                    dataSource={residents}
                    rowKey="id"
                    pagination={false}
                  />
                </>
              ),
            },
            {
              key: 'maintenance',
              label: (
                <span>
                  <ToolOutlined /> Bảo trì & Yêu cầu
                </span>
              ),
              children: (
                <>
                  <Tabs defaultActiveKey="pending" style={{ marginBottom: '16px' }}>
                    <Tabs.TabPane tab="Yêu cầu chờ xử lý" key="pending">
                      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
                          Thêm yêu cầu mới
                        </Button>
                      </div>
                      <Table
                        columns={requestColumns}
                        dataSource={pendingRequests}
                        rowKey="id"
                        pagination={false}
                      />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Lịch sử bảo trì" key="history">
                      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMaintenance}>
                          Thêm lịch sử bảo trì
                        </Button>
                      </div>
                      <Table
                        columns={maintenanceColumns}
                        dataSource={maintenanceHistory}
                        rowKey="id"
                        pagination={false}
                      />
                    </Tabs.TabPane>
                  </Tabs>
                </>
              ),
            },
            {
              key: 'utilities',
              label: (
                <span>
                  <CalendarOutlined /> Hóa đơn tiện ích
                </span>
              ),
              children: (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Hóa đơn tiện ích</h3>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUtility}>
                      Thêm hóa đơn
                    </Button>
                  </div>
                  <Table
                    columns={utilityColumns}
                    dataSource={utilities}
                    rowKey="id"
                    pagination={false}
                  />
                </>
              ),
            },
          ]}
        />
        </Tabs>

      {/* Edit Room Modal */}
      <Modal
        title="Chỉnh sửa thông tin phòng"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setEditModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveRoom}>
            Lưu thay đổi
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="Số phòng"
                rules={[{ required: true, message: 'Vui lòng nhập số phòng!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="Tầng"
                rules={[{ required: true, message: 'Vui lòng nhập tầng!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Sức chứa"
                rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} max={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại phòng"
                rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
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
                rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={100000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomArea"
                label="Diện tích (m²)"
                rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="amenities"
            label="Tiện nghi"
          >
            <Select mode="tags" style={{ width: '100%' }} placeholder="Chọn hoặc nhập tiện nghi">
              <Select.Option value="Điều hòa">Điều hòa</Select.Option>
              <Select.Option value="Tủ lạnh">Tủ lạnh</Select.Option>
              <Select.Option value="Máy giặt">Máy giặt</Select.Option>
              <Select.Option value="Wifi">Wifi</Select.Option>
              <Select.Option value="Bàn học">Bàn học</Select.Option>
              <Select.Option value="Máy nước nóng">Máy nước nóng</Select.Option>
              <Select.Option value="Tủ quần áo">Tủ quần áo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Resident Modal */}
      <Modal
        title="Thêm sinh viên vào phòng"
        open={addResidentModalVisible}
        onCancel={() => setAddResidentModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAddResidentModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveResident}>
            Thêm sinh viên
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentCode"
                label="Mã sinh viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
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
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bedNumber"
                label="Số giường"
                rules={[{ required: true, message: 'Vui lòng chọn số giường!' }]}
              >
                <Select>
                  <Select.Option value="01">Giường 01</Select.Option>
                  <Select.Option value="02">Giường 02</Select.Option>
                  <Select.Option value="03">Giường 03</Select.Option>
                  <Select.Option value="04">Giường 04</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
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
                rules={[{ required: true, message: 'Vui lòng chọn ngày vào!' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày ra dự kiến"
                rules={[{ required: true, message: 'Vui lòng chọn ngày ra dự kiến!' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Add Maintenance Modal */}
      <Modal
        title="Thêm lịch sử bảo trì"
        open={addMaintenanceModalVisible}
        onCancel={() => setAddMaintenanceModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAddMaintenanceModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveMaintenance}>
            Thêm bảo trì
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày thực hiện"
                rules={[{ required: true, message: 'Vui lòng chọn ngày thực hiện!' }]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại bảo trì"
                rules={[{ required: true, message: 'Vui lòng chọn loại bảo trì!' }]}
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
            rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="Chi phí (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={10000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="staff"
                label="Nhân viên thực hiện"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="in-progress">Đang thực hiện</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Utility Modal */}
      <Modal
        title="Thêm hóa đơn tiện ích"
        open={addUtilityModalVisible}
        onCancel={() => setAddUtilityModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAddUtilityModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveUtility}>
            Thêm hóa đơn
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="month"
            label="Tháng"
            rules={[{ required: true, message: 'Vui lòng nhập tháng!' }]}
          >
            <Input placeholder="MM/YYYY" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="electricity"
                label="Chỉ số điện (kWh)"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ số điện!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="water"
                label="Chỉ số nước (m³)"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ số nước!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="electricityCost"
                label="Chi phí điện (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí điện!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={10000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="waterCost"
                label="Chi phí nước (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí nước!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={10000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="otherFees"
            label="Phí khác (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập phí khác!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={10000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Hạn thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn hạn thanh toán!' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Select.Option value="unpaid">Chưa thanh toán</Select.Option>
                  <Select.Option value="paid">Đã thanh toán</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="paidDate"
            label="Ngày thanh toán"
            dependencies={['status']}
            rules={[
              ({ getFieldValue }) => ({
                required: getFieldValue('status') === 'paid',
                message: 'Vui lòng chọn ngày thanh toán!'
              }),
            ]}
          >
            <Input type="date" disabled={form.getFieldValue('status') !== 'paid'} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomDetailPage;
