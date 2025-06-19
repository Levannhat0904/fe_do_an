"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  DeleteOutlined,
  ExclamationCircleOutlined,
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
import buildingApi from "@/api/building";

const { Option } = Select;

const DormitoryRoomManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Đọc các tham số từ URL
  const getParamFromUrl = (paramName: string, defaultValue: any) => {
    const value = searchParams.get(paramName);
    return value ? (paramName === 'page' || paramName === 'limit' ? parseInt(value) : value) : defaultValue;
  };
  
  // Khởi tạo state từ URL params
  const [page, setPage] = useState(getParamFromUrl("page", 1));
  const [limit, setLimit] = useState(getParamFromUrl("limit", 10));
  const [inputValue, setInputValue] = useState(getParamFromUrl("search", "")); // State riêng cho input
  const [searchText, setSearchText] = useState(getParamFromUrl("search", "")); // State cho filter thực tế
  const [buildingFilter, setBuildingFilter] = useState(getParamFromUrl("building", ""));
  const [typeFilter, setTypeFilter] = useState(getParamFromUrl("type", ""));
  const [statusFilter, setStatusFilter] = useState(getParamFromUrl("status", ""));
  const [availabilityFilter, setAvailabilityFilter] = useState(getParamFromUrl("availability", ""));
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

  // Cập nhật URL khi các filter thay đổi
  const updateURL = useCallback(() => {
    const url = new URL(window.location.href);
    
    // Xóa tất cả params hiện tại
    url.searchParams.delete('page');
    url.searchParams.delete('limit');
    url.searchParams.delete('search');
    url.searchParams.delete('building');
    url.searchParams.delete('type');
    url.searchParams.delete('status');
    url.searchParams.delete('availability');
    
    // Thêm lại các params mới
    if (page > 1) url.searchParams.set('page', page.toString());
    if (limit !== 10) url.searchParams.set('limit', limit.toString());
    if (searchText) url.searchParams.set('search', searchText);
    if (buildingFilter) url.searchParams.set('building', buildingFilter);
    if (typeFilter) url.searchParams.set('type', typeFilter);
    if (statusFilter) url.searchParams.set('status', statusFilter);
    if (availabilityFilter) url.searchParams.set('availability', availabilityFilter);
    
    // Cập nhật URL không làm refresh trang
    window.history.pushState({}, '', url.toString());
  }, [page, limit, searchText, buildingFilter, typeFilter, statusFilter, availabilityFilter]);
  
  // Đồng bộ URL với state
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Debounce: khi inputValue đổi, sau 500ms mới setSearchText
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchText(inputValue);
      setPage(1); // Reset về trang 1 khi search
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Cập nhật filters khi các giá trị liên quan thay đổi
  useEffect(() => {
    setFilters({
      searchText,
      buildingName: buildingFilter,
      building: buildingFilter,
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
  }, [searchText, buildingFilter, typeFilter, statusFilter, availabilityFilter, page, limit]);

  // Fetch rooms data with useCallback
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
        const response = await buildingApi.getAllBuildings();
        setBuildings(response.data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Cập nhật giá trị input ngay lập tức
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
  };

  // Cập nhật các hàm xử lý filter
  const handleBuildingFilterChange = (value: string) => {
    setBuildingFilter(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleAvailabilityFilterChange = (value: string) => {
    setAvailabilityFilter(value);
    setPage(1);
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
    setInputValue("");
    setBuildingFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setAvailabilityFilter("");
    setPage(1);
  };

  const handleDeleteRoom = (room: Room) => {
    Modal.confirm({
      title: <span className="text-lg font-bold text-red-600 flex items-center gap-2"><ExclamationCircleOutlined style={{ fontSize: 28, color: '#faad14' }} /> Xác nhận xoá phòng {room.roomNumber}</span>,
      icon: null,
      content: <span className="text-base">Bạn có chắc chắn muốn xoá phòng <b>{room.roomNumber}</b> không? Hành động này không thể hoàn tác.</span>,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      async onOk() {
        try {
          notification.open({
            message: "Đang xoá...",
            description: `Đang xoá phòng ${room.roomNumber}`,
            duration: 0,
            key: "deleteRoom"
          });
          await roomApi.deleteRoom(room.id);
          notification.success({
            message: "Xoá thành công",
            description: `Đã xoá phòng ${room.roomNumber}`,
            key: "deleteRoom"
          });
          fetchRooms(filters);
        } catch (error: any) {
          notification.error({
            message: "Lỗi",
            description: error?.response?.data?.message || "Không thể xoá phòng. Vui lòng thử lại sau.",
            key: "deleteRoom"
          });
        }
      },
    });
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
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record.id)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRoom(record);
                setEditRoomModalVisible(true);
              }}
              className="hover:bg-yellow-50"
            />
          </Tooltip>
          <Tooltip title="Xoá phòng">
            <Button
              type="text"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRoom(record)}
              className="hover:bg-red-50"
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
            className="shadow-md hover:shadow-xl transition-shadow rounded-2xl border border-gray-100"
            cover={
              <div className="h-32 bg-gray-100 flex flex-col justify-center items-center relative rounded-t-2xl">
                <HomeOutlined className="text-4xl text-blue-500" />
                <div className="text-2xl font-bold mt-2">{room.roomNumber}</div>
                <div className="absolute top-2 right-2">
                  <Badge
                    status={room.status === "available" || room.status === "active" ? "success" : "warning"}
                    text={room.status === "available" || room.status === "active" ? "Hoạt động" : "Bảo trì"}
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
                  className="rounded-full hover:bg-blue-50"
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
                  className="rounded-full hover:bg-yellow-50"
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>,
              <Tooltip title="Xoá phòng" key="delete">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(room);
                  }}
                  className="rounded-full hover:bg-red-50"
                >
                  Xoá
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

              <div className="text-xs text-gray-500 mt-1 text-center">
                {room.occupiedBeds >= room.capacity
                  ? "Phòng đã đầy"
                  : `Còn trống ${room.capacity - room.occupiedBeds} chỗ`}
              </div>
            </div>

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
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card className="shadow-sm rounded-lg">
              <Statistic
                title="Tổng số phòng"
                value={data?.summary?.totalRooms || 0}
                prefix={<HomeOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card className="shadow-sm rounded-lg">
              <Statistic
                title="Phòng còn trống"
                value={data?.summary?.availableRooms || 0}
                prefix={<UsergroupAddOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card className="shadow-sm rounded-lg">
              <Statistic
                title="Phòng đang bảo trì"
                value={data?.summary?.maintenanceRooms || 0}
                prefix={<FilterOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="mb-2">
            <Card className="shadow-sm rounded-lg">
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

      <Card className="shadow-sm rounded-lg">
        {/* Hàng 1: Tiêu đề và nút thêm phòng */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2 w-full">
          <div className="text-2xl font-bold text-gray-900 flex-shrink-0 text-center md:text-left">
            Quản lý phòng ký túc xá
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: 18 }} />}
            onClick={handleAddRoom}
            className="rounded-full shadow-md text-base font-semibold flex items-center gap-2 px-5"
            // style={{ height: 44 }}
          >
            Thêm phòng mới
          </Button>
        </div>
        {/* Hàng 2: Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto justify-start md:justify-start mb-4">
          <Input.Search
            placeholder="Tìm phòng..."
            allowClear
            className="md:!w-64 sm:w-[200px] rounded-full"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onSearch={value => setInputValue(value)}
          />
          <Select
            placeholder="Tòa nhà"
            allowClear
            className="w-full sm:w-[120px] rounded-full"
            value={buildingFilter || undefined}
            onChange={handleBuildingFilterChange}
            style={{ borderRadius: 24 }}
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
            className="w-full sm:w-[120px] rounded-full"
            value={typeFilter || undefined}
            onChange={handleTypeFilterChange}
            style={{ borderRadius: 24 }}
          >
            <Option value="nam">Nam</Option>
            <Option value="nữ">Nữ</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            allowClear
            className="w-full sm:w-[120px] rounded-full"
            value={statusFilter || undefined}
            onChange={handleStatusFilterChange}
            style={{ borderRadius: 24 }}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="maintenance">Bảo trì</Option>
          </Select>
          <Select
            placeholder="Tình trạng"
            allowClear
            className="w-full sm:w-[120px] rounded-full"
            value={availabilityFilter || undefined}
            onChange={handleAvailabilityFilterChange}
            style={{ borderRadius: 24 }}
          >
            <Option value="available">Còn chỗ</Option>
            <Option value="full">Đã đầy</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={resetFilters} className="min-w-[90px] rounded-full border border-gray-300 hover:border-blue-400">
            Reset
          </Button>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <Table
              columns={columns as ColumnType<Room>[]}
              dataSource={data?.data}
              loading={isLoading}
              rowKey="id"
              scroll={{ x: 1300 }}
              pagination={{
                current: data?.pagination?.currentPage || page,
                pageSize: data?.pagination?.itemsPerPage || limit,
                total: data?.pagination?.totalItems,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ["10", "20", "30", "50"],
                onChange: (newPage, newPageSize) => {
                  setPage(newPage);
                  setLimit(newPageSize);
                },
                position: ["bottomLeft"],
              }}
              className="min-w-[600px] text-center"
              style={{ borderRadius: 16, overflow: 'hidden' }}
            />
          </div>
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
        width={typeof window !== 'undefined' && window.innerWidth < 600 ? '98vw' : 600}
        bodyStyle={{ padding: 12 }}
        style={{ top: 20 }}
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
        width={typeof window !== 'undefined' && window.innerWidth < 600 ? '98vw' : 600}
        okText="Cập nhật"
        cancelText="Hủy"
        bodyStyle={{ padding: 12 }}
        style={{ top: 20 }}
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
