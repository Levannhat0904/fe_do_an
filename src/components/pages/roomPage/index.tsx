"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Progress,
  Statistic,
  Row,
  Col,
  Badge,
  Tooltip,
  Modal,
  Form,
  InputNumber,
  notification,
  Tabs,
  Radio,
  Divider,
} from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import debounce from "lodash/debounce";

const { Option } = Select;

// Mock API hook - Thay thế bằng API thực tế
const useGetRooms = (page, limit, filters) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    const mockRooms = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      buildingName: `Tòa nhà ${["A", "B", "C"][Math.floor(i / 10)]}`,
      roomNumber: `${["A", "B", "C"][Math.floor(i / 10)]}${
        Math.floor(i % 10) + 1
      }0${Math.floor(i % 3) + 1}`,
      floor: Math.floor(i % 10) + 1,
      capacity: 4,
      occupied: Math.floor(Math.random() * 5),
      type: ["nam", "nữ", "nam", "nữ", "nam"][Math.floor(Math.random() * 5)],
      monthlyFee: [500000, 600000, 700000][Math.floor(Math.random() * 3)],
      status: ["active", "maintenance", "active", "active", "active"][
        Math.floor(Math.random() * 5)
      ],
      lastCleaned: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ).toISOString(),
      amenities: ["Điều hòa", "Tủ lạnh", "Máy giặt", "Tivi", "Wifi"].slice(
        0,
        Math.floor(Math.random() * 4) + 1
      ),
    }));

    // Filtering logic
    let filteredRooms = [...mockRooms];

    if (filters) {
      if (filters.buildingName) {
        filteredRooms = filteredRooms.filter((room) =>
          room.buildingName.includes(filters.buildingName)
        );
      }

      if (filters.type) {
        filteredRooms = filteredRooms.filter(
          (room) => room.type === filters.type
        );
      }

      if (filters.status) {
        filteredRooms = filteredRooms.filter(
          (room) => room.status === filters.status
        );
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredRooms = filteredRooms.filter(
          (room) =>
            room.roomNumber.toLowerCase().includes(searchLower) ||
            room.buildingName.toLowerCase().includes(searchLower)
        );
      }

      if (filters.availability === "available") {
        filteredRooms = filteredRooms.filter(
          (room) => room.occupied < room.capacity
        );
      } else if (filters.availability === "full") {
        filteredRooms = filteredRooms.filter(
          (room) => room.occupied >= room.capacity
        );
      }
    }

    // Pagination
    const totalItems = filteredRooms.length;
    const startIndex = (page - 1) * limit;
    const paginatedRooms = filteredRooms.slice(startIndex, startIndex + limit);

    const mockData = {
      data: paginatedRooms,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
      summary: {
        totalRooms: mockRooms.length,
        availableRooms: mockRooms.filter(
          (room) => room.occupied < room.capacity && room.status === "active"
        ).length,
        maintenanceRooms: mockRooms.filter(
          (room) => room.status === "maintenance"
        ).length,
        occupancyRate: Math.round(
          (mockRooms.reduce((sum, room) => sum + room.occupied, 0) /
            mockRooms.reduce((sum, room) => sum + room.capacity, 0)) *
            100
        ),
      },
    };

    // Simulate API delay
    // setTimeout(() => {
    //   setData(mockData);
    //   setIsLoading(false);
    // }, 600);
  }, [page, limit, filters]);

  return { data, isLoading, error };
};

const DormitoryRoomManagement = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Combine all filters
  const filters = {
    searchText,
    buildingName: buildingFilter,
    type: typeFilter,
    status: statusFilter,
    availability: availabilityFilter,
  };

  const { data, isLoading } = useGetRooms(page, limit, filters);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  const handleViewDetail = (id) => {
    router.push(`/quan-ly-ky-tuc-xa/phong/${id}`);
  };

  const handleAddRoom = () => {
    setAddRoomModalVisible(true);
  };

  const handleAddRoomSubmit = () => {
    form.validateFields().then((values) => {
      // Gọi API thêm phòng
      console.log("Submitted values:", values);

      notification.success({
        message: "Thêm phòng thành công",
        description: `Đã thêm phòng ${values.roomNumber} vào hệ thống`,
      });

      form.resetFields();
      setAddRoomModalVisible(false);
    });
  };

  const resetFilters = () => {
    setSearchText("");
    setBuildingFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setAvailabilityFilter("");
    setPage(1);
  };

  const columns = [
    {
      title: "Tòa nhà",
      dataIndex: "buildingName",
      key: "buildingName",
      width: 120,
      sorter: (a, b) => a.buildingName.localeCompare(b.buildingName),
    },
    {
      title: "Phòng",
      dataIndex: "roomNumber",
      key: "roomNumber",
      width: 100,
      sorter: (a, b) => a.roomNumber.localeCompare(b.roomNumber),
    },
    {
      title: "Tầng",
      dataIndex: "floor",
      key: "floor",
      width: 80,
      sorter: (a, b) => a.floor - b.floor,
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color={type === "nam" ? "blue" : "pink"}>
          {type === "nam" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Sức chứa",
      key: "capacity",
      width: 150,
      render: (_, record) => (
        <Tooltip title={`${record.occupied}/${record.capacity} chỗ đã sử dụng`}>
          <Progress
            percent={Math.round((record.occupied / record.capacity) * 100)}
            format={() => `${record.occupied}/${record.capacity}`}
            status={record.occupied >= record.capacity ? "exception" : "active"}
          />
        </Tooltip>
      ),
    },
    {
      title: "Tiện ích",
      dataIndex: "amenities",
      key: "amenities",
      width: 200,
      render: (amenities) => (
        <span>
          {amenities.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </span>
      ),
    },
    {
      title: "Giá phòng",
      dataIndex: "monthlyFee",
      key: "monthlyFee",
      width: 120,
      sorter: (a, b) => a.monthlyFee - b.monthlyFee,
      render: (fee) => `${fee.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = status === "active" ? "green" : "orange";
        let text = status === "active" ? "Hoạt động" : "Bảo trì";
        return (
          <Badge
            status={status === "active" ? "success" : "warning"}
            text={text}
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record.id)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => console.log("Edit room:", record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderCardView = () => {
    const rooms = data?.data || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            hoverable
            onClick={() => handleViewDetail(room.id)}
            className="shadow-sm hover:shadow-md transition-shadow"
            cover={
              <div className="h-32 bg-gray-100 flex flex-col justify-center items-center">
                <HomeOutlined className="text-4xl text-blue-500" />
                <div className="text-2xl font-bold mt-2">{room.roomNumber}</div>
              </div>
            }
            actions={[
              <Tooltip title="Xem chi tiết" key="view">
                <EyeOutlined
                  key="view"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(room.id);
                  }}
                />
              </Tooltip>,
              <Tooltip title="Chỉnh sửa" key="edit">
                <EditOutlined
                  key="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit room:", room.id);
                  }}
                />
              </Tooltip>,
            ]}
          >
            <div className="mb-2">
              <Tag
                color={room.type === "nam" ? "blue" : "pink"}
                className="mr-1"
              >
                {room.type === "nam" ? "Nam" : "Nữ"}
              </Tag>
              <Badge
                status={room.status === "active" ? "success" : "warning"}
                text={room.status === "active" ? "Hoạt động" : "Bảo trì"}
              />
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">{room.buildingName}</div>
              <div className="font-semibold">
                {room.monthlyFee.toLocaleString("vi-VN")} đ/tháng
              </div>
            </div>

            <div className="mb-2">
              <Progress
                percent={Math.round((room.occupied / room.capacity) * 100)}
                format={() => `${room.occupied}/${room.capacity}`}
                status={room.occupied >= room.capacity ? "exception" : "active"}
                size="small"
              />
            </div>

            <div className="text-xs">
              {room.amenities.map((item) => (
                <Tag key={item} size="small">
                  {item}
                </Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Tổng số phòng"
                value={data?.summary?.totalRooms || 0}
                prefix={<HomeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Phòng còn trống"
                value={data?.summary?.availableRooms || 0}
                prefix={<UsergroupAddOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Phòng đang bảo trì"
                value={data?.summary?.maintenanceRooms || 0}
                prefix={<FilterOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-sm">
              <Statistic
                title="Tỷ lệ lấp đầy"
                value={data?.summary?.occupancyRate || 0}
                suffix="%"
                prefix={
                  <Progress
                    type="circle"
                    percent={data?.summary?.occupancyRate || 0}
                    width={30}
                  />
                }
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card className="shadow-sm">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="text-2xl font-semibold mb-2 md:mb-0">
            Quản lý phòng ký túc xá
          </div>

          <div className="flex flex-wrap gap-2">
            <Input.Search
              placeholder="Tìm phòng..."
              allowClear
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Select
              placeholder="Tòa nhà"
              allowClear
              style={{ width: 120 }}
              value={buildingFilter || undefined}
              onChange={(value) => {
                setBuildingFilter(value);
                setPage(1);
              }}
            >
              <Option value="Tòa nhà A">Tòa nhà A</Option>
              <Option value="Tòa nhà B">Tòa nhà B</Option>
              <Option value="Tòa nhà C">Tòa nhà C</Option>
            </Select>

            <Select
              placeholder="Loại phòng"
              allowClear
              style={{ width: 120 }}
              value={typeFilter || undefined}
              onChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
            >
              <Option value="nam">Nam</Option>
              <Option value="nữ">Nữ</Option>
            </Select>

            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 120 }}
              value={statusFilter || undefined}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="maintenance">Bảo trì</Option>
            </Select>

            <Select
              placeholder="Tình trạng"
              allowClear
              style={{ width: 120 }}
              value={availabilityFilter || undefined}
              onChange={(value) => {
                setAvailabilityFilter(value);
                setPage(1);
              }}
            >
              <Option value="available">Còn chỗ</Option>
              <Option value="full">Đã đầy</Option>
            </Select>

            <Button icon={<ReloadOutlined />} onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <Radio.Button value="table">Bảng</Radio.Button>
            <Radio.Button value="card">Thẻ</Radio.Button>
          </Radio.Group>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRoom}
          >
            Thêm phòng mới
          </Button>
        </div>

        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={data?.data}
            loading={isLoading}
            rowKey="id"
            scroll={{ x: 1300 }}
            pagination={{
              current: data?.pagination?.currentPage,
              pageSize: data?.pagination?.itemsPerPage,
              total: data?.pagination?.totalItems,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "30", "50"],
              onChange: (page, pageSize) => {
                setPage(page);
                setLimit(pageSize);
              },
            }}
          />
        ) : (
          <div>
            {renderCardView()}
            <div className="flex justify-center mt-4">
              <Button.Group>
                <Button
                  type="primary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Trang trước
                </Button>
                <Button disabled>
                  {page} / {data?.pagination?.totalPages || 1}
                </Button>
                <Button
                  type="primary"
                  disabled={page === (data?.pagination?.totalPages || 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Trang sau
                </Button>
              </Button.Group>
            </div>
          </div>
        )}
      </Card>

      <Modal
        title="Thêm phòng mới"
        visible={addRoomModalVisible}
        onOk={handleAddRoomSubmit}
        onCancel={() => setAddRoomModalVisible(false)}
        okText="Thêm phòng"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buildingName"
                label="Tòa nhà"
                rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
              >
                <Select placeholder="Chọn tòa nhà">
                  <Option value="Tòa nhà A">Tòa nhà A</Option>
                  <Option value="Tòa nhà B">Tòa nhà B</Option>
                  <Option value="Tòa nhà C">Tòa nhà C</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="Số phòng"
                rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}
              >
                <Input placeholder="Nhập số phòng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="Tầng"
                rules={[{ required: true, message: "Vui lòng nhập tầng" }]}
              >
                <InputNumber
                  min={1}
                  max={20}
                  style={{ width: "100%" }}
                  placeholder="Nhập tầng"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại phòng"
                rules={[
                  { required: true, message: "Vui lòng chọn loại phòng" },
                ]}
              >
                <Select placeholder="Chọn loại phòng">
                  <Option value="nam">Nam</Option>
                  <Option value="nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Sức chứa"
                rules={[{ required: true, message: "Vui lòng nhập sức chứa" }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  placeholder="Nhập sức chứa"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="monthlyFee"
                label="Giá phòng (đồng/tháng)"
                rules={[{ required: true, message: "Vui lòng nhập giá phòng" }]}
              >
                <InputNumber
                  min={100000}
                  max={2000000}
                  step={50000}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập giá phòng"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="amenities" label="Tiện ích">
            <Select mode="multiple" placeholder="Chọn tiện ích">
              <Option value="Điều hòa">Điều hòa</Option>
              <Option value="Tủ lạnh">Tủ lạnh</Option>
              <Option value="Máy giặt">Máy giặt</Option>
              <Option value="Tivi">Tivi</Option>
              <Option value="Wifi">Wifi</Option>
              <Option value="Bàn học">Bàn học</Option>
              <Option value="Tủ quần áo">Tủ quần áo</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Radio.Group>
              <Radio value="active">Hoạt động</Radio>
              <Radio value="maintenance">Bảo trì</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DormitoryRoomManagement;
