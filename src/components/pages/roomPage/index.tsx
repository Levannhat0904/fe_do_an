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
  UserOutlined,
  CheckOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import debounce from "lodash/debounce";
import roomApi, { RoomFilters, Room, RoomResponse } from "@/api/room";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSnowflake,
  faTv,
  faWifi,
  faWater,
  faIceCream,
  faDesktop,
  faTshirt,
  faBed,
} from "@fortawesome/free-solid-svg-icons";
import { StatusEnum } from "@/constants";
import { ColumnType } from "antd/es/table";

const { Option } = Select;

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
  const [editRoomModalVisible, setEditRoomModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [data, setData] = useState<RoomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>(
    []
  );
  const [filters, setFilters] = useState<RoomFilters>({
    page: 1,
    limit: 10,
  });

  // Cập nhật filters khi các giá trị liên quan thay đổi
  useEffect(() => {
    setFilters({
      searchText,
      buildingName: buildingFilter,
      type:
        typeFilter === "nam"
          ? "male"
          : typeFilter === "nữ"
          ? "female"
          : undefined,
      status: statusFilter as "active" | "maintenance" | undefined,
      availability: availabilityFilter as "available" | "full" | undefined,
      page,
      limit,
    });
  }, [
    searchText,
    buildingFilter,
    typeFilter,
    statusFilter,
    availabilityFilter,
    page,
    limit,
  ]);

  // Fetch rooms data
  const fetchRooms = useCallback(async (filterParams: RoomFilters) => {
    try {
      setIsLoading(true);
      const response = await roomApi.getRooms(filterParams);

      // Xử lý dữ liệu trước khi cập nhật state
      const processedData = {
        ...response,
        data: response.data.map((room) => ({
          ...room,
          amenities: Array.isArray(room.amenities)
            ? room.amenities
            : typeof room.amenities === "string"
            ? JSON.parse(room.amenities)
            : [],
        })),
      };

      setData(processedData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu phòng. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gọi fetchRooms khi filters thay đổi
  useEffect(() => {
    // Thêm kiểm tra để tránh gọi API khi component khởi tạo với filters rỗng
    if (Object.keys(filters).length > 0) {
      fetchRooms(filters);
    }
  }, [filters, fetchRooms]);

  // Fetch buildings for dropdown
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        // This would be replaced with actual API call
        const mockBuildings = [
          { id: 1, name: "Tòa nhà A" },
          { id: 2, name: "Tòa nhà B" },
          { id: 3, name: "Tòa nhà C" },
        ];
        setBuildings(mockBuildings);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

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

  const handleViewDetail = (id: number) => {
    router.push(`/quan-ly-ky-tuc-xa/phong/${id}`);
  };

  const handleAddRoom = () => {
    setAddRoomModalVisible(true);
  };

  const handleAddRoomSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Create FormData for API call
      const formData = new FormData();
      formData.append("buildingId", values.buildingId);
      formData.append("roomNumber", values.roomNumber);
      formData.append("floorNumber", values.floorNumber);
      formData.append("roomType", values.type === "nam" ? "male" : "female");
      formData.append("capacity", values.capacity);
      formData.append("pricePerMonth", values.monthlyFee);
      formData.append(
        "status",
        values.status === "active" ? "available" : "maintenance"
      );

      if (values.amenities && values.amenities.length > 0) {
        // Đảm bảo amenities luôn là mảng trước khi chuyển thành JSON
        const amenitiesArray = Array.isArray(values.amenities)
          ? values.amenities
          : [values.amenities];
        formData.append("amenities", JSON.stringify(amenitiesArray));
      }

      await roomApi.addRoom(formData);

      notification.success({
        message: "Thêm phòng thành công",
        description: `Đã thêm phòng ${values.roomNumber} vào hệ thống`,
      });

      form.resetFields();
      setAddRoomModalVisible(false);
      fetchRooms(filters); // Refresh the data
    } catch (error) {
      console.error("Error adding room:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm phòng. Vui lòng thử lại sau.",
      });
    }
  };

  const handleEditRoom = async () => {
    try {
      const values = await editForm.validateFields();
      console.log("Form values:", values);

      // Create FormData for API call
      const formData = new FormData();

      // Convert buildingId to number
      const buildingId = Number(values.buildingId);
      formData.append("buildingId", buildingId.toString());

      formData.append("roomNumber", values.roomNumber);
      formData.append("floorNumber", values.floorNumber.toString());
      formData.append("roomType", values.type === "nam" ? "male" : "female");

      // Convert capacity to number
      const capacity = Number(values.capacity);
      formData.append("capacity", capacity.toString());

      // Convert monthlyFee to number and use correct field name
      const pricePerMonth = Number(values.monthlyFee);
      formData.append("pricePerMonth", pricePerMonth.toString());

      formData.append(
        "status",
        values.status === "active" ? "available" : "maintenance"
      );

      if (values.amenities && values.amenities.length > 0) {
        // Đảm bảo amenities luôn là mảng trước khi chuyển thành JSON
        const amenitiesArray = Array.isArray(values.amenities)
          ? values.amenities
          : [values.amenities];
        formData.append("amenities", JSON.stringify(amenitiesArray));
      }

      if (selectedRoom) {
        // Đảm bảo roomId là số
        const roomId = Number(selectedRoom.id);
        console.log("Updating room with ID:", roomId);
        console.log("FormData contents:");
        // Sử dụng Array.from để tránh lỗi iterating FormDataIterator
        Array.from(formData.entries()).forEach((pair) => {
          console.log(pair[0] + ": " + pair[1]);
        });

        // Kiểm tra xem roomId có phải là số hợp lệ không
        if (isNaN(roomId)) {
          notification.error({
            message: "Lỗi",
            description: "ID phòng không hợp lệ",
          });
          return;
        }

        await roomApi.updateRoom(roomId, formData);

        notification.success({
          message: "Cập nhật phòng thành công",
          description: `Đã cập nhật phòng ${values.roomNumber}`,
        });

        setEditRoomModalVisible(false);
        fetchRooms(filters); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating room:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật phòng. Vui lòng thử lại sau.",
      });
    }
  };

  // Effect để cập nhật form khi selectedRoom thay đổi
  useEffect(() => {
    if (selectedRoom && editRoomModalVisible) {
      // Xử lý amenities đúng cách
      let amenitiesData = [];
      if (selectedRoom.amenities) {
        if (typeof selectedRoom.amenities === "string") {
          try {
            amenitiesData = JSON.parse(selectedRoom.amenities);
          } catch (e) {
            console.error("Lỗi parse amenities trong useEffect:", e);
            amenitiesData = [];
          }
        } else if (Array.isArray(selectedRoom.amenities)) {
          amenitiesData = selectedRoom.amenities;
        }
      }

      editForm.setFieldsValue({
        buildingId: selectedRoom.buildingId,
        roomNumber: selectedRoom.roomNumber,
        floorNumber: selectedRoom.floorNumber,
        type: selectedRoom.roomType === "male" ? "nam" : "nữ",
        capacity: selectedRoom.capacity,
        monthlyFee: selectedRoom.pricePerMonth,
        amenities: amenitiesData,
        status:
          selectedRoom.status === "available" ||
          selectedRoom.status === "active"
            ? "active"
            : "maintenance",
      });
    }
  }, [selectedRoom, editRoomModalVisible, editForm]);

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
      sorter: (a: Room, b: Room) =>
        a.buildingName.localeCompare(b.buildingName),
    },
    {
      title: "Phòng",
      dataIndex: "roomNumber",
      key: "roomNumber",
      width: 100,
      sorter: (a: Room, b: Room) => a.roomNumber.localeCompare(b.roomNumber),
    },
    {
      title: "Tầng",
      dataIndex: "floorNumber",
      key: "floorNumber",
      width: 80,
      sorter: (a: Room, b: Room) => a.floorNumber - b.floorNumber,
    },
    {
      title: "Loại phòng",
      dataIndex: "roomType",
      key: "roomType",
      width: 100,
      render: (type: string) => (
        <Tag color={type === "male" ? "blue" : "pink"}>
          {type === "male" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Sức chứa",
      key: "capacity",
      width: 150,
      render: (_: any, record: Room) => (
        <Tooltip
          title={`${record.occupiedBeds}/${record.capacity} chỗ đã sử dụng`}
        >
          <Progress
            percent={Math.round((record.occupiedBeds / record.capacity) * 100)}
            format={() => `${record.occupiedBeds}/${record.capacity}`}
            status={
              record.occupiedBeds >= record.capacity ? "exception" : "active"
            }
          />
        </Tooltip>
      ),
    },
    {
      title: "Tiện ích",
      dataIndex: "amenities",
      key: "amenities",
      width: 200,
      render: (amenities: string | any[]) => {
        let amenitiesArray = [];
        if (typeof amenities === "string") {
          try {
            amenitiesArray = JSON.parse(amenities);
          } catch (e) {
            console.error("Lỗi parse amenities:", e);
            amenitiesArray = [];
          }
        } else if (Array.isArray(amenities)) {
          amenitiesArray = amenities;
        }

        return (
          <span>
            {amenitiesArray.map((item: string) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </span>
        );
      },
    },
    {
      title: "Giá phòng",
      dataIndex: "pricePerMonth",
      key: "pricePerMonth",
      width: 120,
      sorter: (a: Room, b: Room) => a.pricePerMonth - b.pricePerMonth,
      render: (fee: number) => `${Number(fee)?.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: StatusEnum) => {
        const isActive =
          status === StatusEnum.Available || status === StatusEnum.Active;
        return (
          <Badge
            status={isActive ? "success" : "warning"}
            text={isActive ? "Hoạt động" : "Bảo trì"}
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_: any, record: Room) => (
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
              onClick={() => {
                setSelectedRoom(record);
                setEditRoomModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderCardView = () => {
    const rooms = data?.data || [];

    // Đối tượng chứa icon cho từng loại tiện ích
    const amenityIcons = {
      "Điều hòa": <FontAwesomeIcon icon={faSnowflake} />,
      "Tủ lạnh": <FontAwesomeIcon icon={faIceCream} />,
      "Máy giặt": <FontAwesomeIcon icon={faWater} />,
      Tivi: <FontAwesomeIcon icon={faTv} />,
      Wifi: <FontAwesomeIcon icon={faWifi} />,
      "Bàn học": <FontAwesomeIcon icon={faDesktop} />,
      "Tủ quần áo": <FontAwesomeIcon icon={faTshirt} />,
      "Chăn ga gối": <FontAwesomeIcon icon={faBed} />,
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            hoverable
            onClick={() => handleViewDetail(room.id)}
            className="shadow-sm hover:shadow-md transition-shadow"
            cover={
              <div className="h-32 bg-gray-100 flex flex-col justify-center items-center relative">
                <HomeOutlined className="text-4xl text-blue-500" />
                <div className="text-2xl font-bold mt-2">{room.roomNumber}</div>
                {/* Hiển thị badge trạng thái ở góc trên bên phải */}
                <div className="absolute top-2 right-2">
                  <Badge
                    status={
                      room.status === "available" || room.status === "active"
                        ? "success"
                        : "warning"
                    }
                    text={
                      room.status === "available" || room.status === "active"
                        ? "Hoạt động"
                        : "Bảo trì"
                    }
                  />
                </div>
              </div>
            }
            actions={[
              <Tooltip title="Xem chi tiết phòng" key="view">
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(room.id);
                  }}
                >
                  Xem chi tiết
                </Button>
              </Tooltip>,
              <Tooltip title="Chỉnh sửa thông tin phòng" key="edit">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoom(room);
                    setEditRoomModalVisible(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>,
            ]}
          >
            <div className="mb-3">
              <div className="flex justify-between items-center">
                <Tag
                  color={room.roomType === "male" ? "blue" : "pink"}
                  className="mr-1 px-2 py-1"
                  icon={
                    room.roomType === "male" ? (
                      <ManOutlined />
                    ) : (
                      <WomanOutlined />
                    )
                  }
                >
                  {room.roomType === "male" ? "Nam" : "Nữ"}
                </Tag>
                <div className="font-semibold">
                  {Number(room.pricePerMonth)?.toLocaleString("vi-VN")} đ/tháng
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-1">
              <div className="text-gray-600 font-medium">
                {room.buildingName}
              </div>
              <Tooltip
                title={`${room.occupiedBeds} sinh viên đang ở / Sức chứa ${room.capacity} người`}
              >
                <div className="text-sm text-blue-500 font-medium">
                  {room.occupiedBeds}/{room.capacity} <UserOutlined />
                </div>
              </Tooltip>
            </div>

            {/* Cải tiến thanh progress */}
            <div className="mb-3">
              <Tooltip
                title={`${room.occupiedBeds} sinh viên đang ở / Sức chứa ${room.capacity} người`}
              >
                <div className="flex items-center">
                  <Progress
                    percent={Math.round(
                      (room.occupiedBeds / room.capacity) * 100
                    )}
                    format={() => `${room.occupiedBeds}/${room.capacity}`}
                    status={
                      room.occupiedBeds >= room.capacity
                        ? "exception"
                        : "active"
                    }
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%":
                        room.occupiedBeds >= room.capacity
                          ? "#ff4d4f"
                          : "#52c41a",
                    }}
                    strokeWidth={10}
                  />
                </div>
              </Tooltip>

              {/* Thêm text mô tả */}
              <div className="text-xs text-gray-500 mt-1 text-center">
                {room.occupiedBeds >= room.capacity
                  ? "Phòng đã đầy"
                  : `Còn trống ${room.capacity - room.occupiedBeds} chỗ`}
              </div>
            </div>

            {/* Tiện ích với icon */}
            <div className="border-t pt-2">
              <div className="text-sm font-medium mb-1">Tiện ích:</div>
              <div className="flex flex-wrap gap-1">
                {(room.amenities || []).map((item) => (
                  <Tooltip key={item} title={item}>
                    <Badge
                      count={
                        <span className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                          {amenityIcons[item as keyof typeof amenityIcons] || (
                            <CheckOutlined />
                          )}
                          {item}
                        </span>
                      }
                      style={{ backgroundColor: "transparent" }}
                    />
                  </Tooltip>
                ))}
              </div>
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
              {buildings.map((building) => (
                <Option key={building.id} value={building.name}>
                  {building.name}
                </Option>
              ))}
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
            columns={columns as ColumnType<Room>[]}
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
        open={addRoomModalVisible}
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
                name="buildingId"
                label="Tòa nhà"
                rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
              >
                <Select placeholder="Chọn tòa nhà">
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
                name="floorNumber"
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
                  step={50000}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined) => {
                    const parsedValue = value?.replace(/\$\s?|(,*)/g, "");
                    return parsedValue ? parseFloat(parsedValue) : 0;
                  }}
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

      <Modal
        title="Chỉnh sửa phòng"
        open={editRoomModalVisible}
        onOk={handleEditRoom}
        onCancel={() => setEditRoomModalVisible(false)}
        width={600}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Divider orientation="left">
          Thông tin phòng {selectedRoom?.roomNumber}
        </Divider>
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buildingId"
                label="Tòa nhà"
                rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
              >
                <Select placeholder="Chọn tòa nhà">
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
                name="floorNumber"
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
                  parser={(value: string | undefined) => {
                    const parsedValue = value?.replace(/\$\s?|(,*)/g, "");
                    return parsedValue ? parseFloat(parsedValue) : 0;
                  }}
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
